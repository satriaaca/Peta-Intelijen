import express from "express";
import path from "path";
import https from "https";
import { createServer as createViteServer } from "vite";
import { pool, initializeDatabase } from "./server/db";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // Initialize PostgreSQL tables & seed on boot
  initializeDatabase().catch((e) => {
    console.error("Initial DB connection failed:", e.message);
  });

  // -------------------------------------------------------------
  // POSTGRESQL REST API ENDPOINTS
  // -------------------------------------------------------------

  // 1. DB Health & Stats
  app.get("/api/db/health", async (_req, res) => {
    try {
      const intelRes = await pool.query("SELECT COUNT(*) FROM intelligence_entries");
      const outreachRes = await pool.query("SELECT COUNT(*) FROM outreach_entries");
      const caseStatsRes = await pool.query("SELECT COUNT(*) FROM case_statistics");
      res.json({
        status: "ok",
        engine: "Neon PostgreSQL",
        connected: true,
        counts: {
          intelligence: parseInt(intelRes.rows[0].count, 10),
          outreach: parseInt(outreachRes.rows[0].count, 10),
          caseStats: parseInt(caseStatsRes.rows[0].count, 10),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({
        status: "error",
        engine: "Neon PostgreSQL",
        connected: false,
        message: err.message,
      });
    }
  });

  // 2. GET Intelligence Entries
  app.get("/api/intelligence", async (req, res) => {
    try {
      const sectionFilter = req.query.section as string | undefined;
      let query = `
        SELECT 
          id, 
          no_register AS "no", 
          section_id AS "section", 
          sektor_symbol, 
          keterangan, 
          narrative, 
          TO_CHAR(event_date, 'YYYY-MM-DD') AS "date", 
          TO_CHAR(report_date, 'YYYY-MM-DD') AS "reportDate", 
          location, 
          kecamatan, 
          classification, 
          officer_name AS "officerName", 
          source_confidence AS "sourceConfidence", 
          status, 
          gdrive_file_id AS "gdriveFileId", 
          gdrive_file_url AS "photoUrl", 
          photo_caption AS "photoCaption", 
          photos,
          created_at AS "createdAt", 
          updated_at AS "updatedAt"
        FROM intelligence_entries
      `;
      const params: any[] = [];

      if (sectionFilter) {
        query += " WHERE section_id = $1";
        params.push(sectionFilter);
      }

      query += " ORDER BY event_date DESC, created_at DESC";

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (err: any) {
      console.error("GET /api/intelligence error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // 3. POST / Upsert Intelligence Entry
  app.post("/api/intelligence", async (req, res) => {
    try {
      const entry = req.body;
      if (!entry.id || !entry.no || !entry.section || !entry.narrative) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const query = `
        INSERT INTO intelligence_entries (
          id, no_register, section_id, sektor_symbol, keterangan, narrative,
          event_date, report_date, location, kecamatan, classification,
          officer_name, source_confidence, status, gdrive_file_id, gdrive_file_url,
          photo_caption, photos, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
        )
        ON CONFLICT (id) DO UPDATE SET
          no_register = EXCLUDED.no_register,
          section_id = EXCLUDED.section_id,
          sektor_symbol = EXCLUDED.sektor_symbol,
          keterangan = EXCLUDED.keterangan,
          narrative = EXCLUDED.narrative,
          event_date = EXCLUDED.event_date,
          report_date = EXCLUDED.report_date,
          location = EXCLUDED.location,
          kecamatan = EXCLUDED.kecamatan,
          classification = EXCLUDED.classification,
          officer_name = EXCLUDED.officer_name,
          source_confidence = EXCLUDED.source_confidence,
          status = EXCLUDED.status,
          gdrive_file_id = EXCLUDED.gdrive_file_id,
          gdrive_file_url = EXCLUDED.gdrive_file_url,
          photo_caption = EXCLUDED.photo_caption,
          photos = EXCLUDED.photos,
          updated_at = EXCLUDED.updated_at
        RETURNING *;
      `;

      const now = new Date();
      const primaryPhotoUrl = entry.photos && entry.photos.length > 0 ? entry.photos[0].url : (entry.photoUrl || null);
      const primaryCaption = entry.photos && entry.photos.length > 0 ? (entry.photos[0].caption || entry.photoCaption || null) : (entry.photoCaption || null);

      const params = [
        entry.id,
        entry.no,
        entry.section,
        entry.sektor_symbol || "PO",
        entry.keterangan || "Umum",
        entry.narrative,
        entry.date,
        entry.reportDate || entry.date,
        entry.location || "",
        entry.kecamatan || "Tabanan",
        entry.classification || "TERBATAS",
        entry.officerName || "",
        entry.sourceConfidence || "A1",
        entry.status || "SELESAI",
        entry.gdriveFileId || null,
        primaryPhotoUrl,
        primaryCaption,
        entry.photos ? JSON.stringify(entry.photos) : null,
        entry.createdAt ? new Date(entry.createdAt) : now,
        now,
      ];

      const result = await pool.query(query, params);
      res.json({ success: true, entry: result.rows[0] });
    } catch (err: any) {
      console.error("POST /api/intelligence error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // 4. DELETE Intelligence Entry
  app.delete("/api/intelligence/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query("DELETE FROM intelligence_entries WHERE id = $1", [id]);
      res.json({ success: true, id });
    } catch (err: any) {
      console.error("DELETE /api/intelligence error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // 5. GET Outreach / JMS Entries
  app.get("/api/outreach", async (req, res) => {
    try {
      const triwulanFilter = req.query.triwulan
        ? parseInt(req.query.triwulan as string, 10)
        : undefined;

      let query = `
        SELECT 
          id,
          no_kegiatan AS "no",
          triwulan,
          jenis_kegiatan,
          tema_kegiatan,
          TO_CHAR(waktu, 'YYYY-MM-DD') AS "waktu",
          tempat,
          kecamatan,
          jumlah_peserta,
          target_peserta,
          narasumber,
          materi_pokok,
          latitude,
          longitude,
          status,
          gdrive_file_id AS "gdriveFileId",
          gdrive_file_url AS "photoUrl",
          photo_caption AS "photoCaption",
          photos,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM outreach_entries
      `;
      const params: any[] = [];

      if (triwulanFilter) {
        query += " WHERE triwulan = $1";
        params.push(triwulanFilter);
      }

      query += " ORDER BY waktu DESC, created_at DESC";

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (err: any) {
      console.error("GET /api/outreach error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // 6. POST / Upsert Outreach / JMS Entry
  app.post("/api/outreach", async (req, res) => {
    try {
      const entry = req.body;
      if (!entry.id || !entry.no || !entry.tema_kegiatan) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const query = `
        INSERT INTO outreach_entries (
          id, no_kegiatan, triwulan, jenis_kegiatan, tema_kegiatan, waktu,
          tempat, kecamatan, jumlah_peserta, target_peserta, narasumber,
          materi_pokok, latitude, longitude, status, gdrive_file_id,
          gdrive_file_url, photo_caption, photos, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
        )
        ON CONFLICT (id) DO UPDATE SET
          no_kegiatan = EXCLUDED.no_kegiatan,
          triwulan = EXCLUDED.triwulan,
          jenis_kegiatan = EXCLUDED.jenis_kegiatan,
          tema_kegiatan = EXCLUDED.tema_kegiatan,
          waktu = EXCLUDED.waktu,
          tempat = EXCLUDED.tempat,
          kecamatan = EXCLUDED.kecamatan,
          jumlah_peserta = EXCLUDED.jumlah_peserta,
          target_peserta = EXCLUDED.target_peserta,
          narasumber = EXCLUDED.narasumber,
          materi_pokok = EXCLUDED.materi_pokok,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          status = EXCLUDED.status,
          gdrive_file_id = EXCLUDED.gdrive_file_id,
          gdrive_file_url = EXCLUDED.gdrive_file_url,
          photo_caption = EXCLUDED.photo_caption,
          photos = EXCLUDED.photos,
          updated_at = EXCLUDED.updated_at
        RETURNING *;
      `;

      const now = new Date();
      const primaryPhotoUrl = entry.photos && entry.photos.length > 0 ? entry.photos[0].url : (entry.photoUrl || null);
      const primaryCaption = entry.photos && entry.photos.length > 0 ? (entry.photos[0].caption || entry.photoCaption || null) : (entry.photoCaption || null);

      const params = [
        entry.id,
        entry.no,
        entry.triwulan || 1,
        entry.jenis_kegiatan || "Jaksa Masuk Sekolah (JMS)",
        entry.tema_kegiatan,
        entry.waktu,
        entry.tempat,
        entry.kecamatan || "Tabanan",
        entry.jumlah_peserta || 0,
        entry.target_peserta || entry.jumlah_peserta || 0,
        entry.narasumber || null,
        entry.materi_pokok || null,
        entry.latitude || -8.5385,
        entry.longitude || 115.1232,
        entry.status || "TERLAKSANA",
        entry.gdriveFileId || null,
        primaryPhotoUrl,
        primaryCaption,
        entry.photos ? JSON.stringify(entry.photos) : null,
        entry.createdAt ? new Date(entry.createdAt) : now,
        now,
      ];

      const result = await pool.query(query, params);
      res.json({ success: true, entry: result.rows[0] });
    } catch (err: any) {
      console.error("POST /api/outreach error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // 7. DELETE Outreach Entry
  app.delete("/api/outreach/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query("DELETE FROM outreach_entries WHERE id = $1", [id]);
      res.json({ success: true, id });
    } catch (err: any) {
      console.error("DELETE /api/outreach error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // 8. GET Case Statistics (from PostgreSQL)
  app.get("/api/case-stats", async (req, res) => {
    try {
      const yearFilter = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
      let query = `
        SELECT 
          id, category, year, lid_spdp, dik_kejaksaan, dik_kepolisian, tut, notes, updated_at AS "updatedAt"
        FROM case_statistics
      `;
      const params: any[] = [];
      if (yearFilter) {
        query += " WHERE year = $1";
        params.push(yearFilter);
      }
      query += " ORDER BY year DESC, category ASC";
      const result = await pool.query(query, params);
      const rows = result.rows.map((r) => ({
        id: r.id,
        category: r.category,
        year: r.year,
        stages: {
          lid_spdp: r.lid_spdp || 0,
          dik_kejaksaan: r.dik_kejaksaan || 0,
          dik_kepolisian: r.dik_kepolisian || 0,
          tut: r.tut || 0,
        },
        notes: r.notes || "",
        updatedAt: r.updatedAt ? new Date(r.updatedAt).getTime() : Date.now(),
      }));
      res.json(rows);
    } catch (err: any) {
      console.error("GET /api/case-stats error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // 9. POST / Upsert Case Statistics (to PostgreSQL)
  app.post("/api/case-stats", async (req, res) => {
    try {
      const item = req.body;
      if (!item.id || !item.category || !item.year) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const query = `
        INSERT INTO case_statistics (
          id, category, year, lid_spdp, dik_kejaksaan, dik_kepolisian, tut, notes, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          category = EXCLUDED.category,
          year = EXCLUDED.year,
          lid_spdp = EXCLUDED.lid_spdp,
          dik_kejaksaan = EXCLUDED.dik_kejaksaan,
          dik_kepolisian = EXCLUDED.dik_kepolisian,
          tut = EXCLUDED.tut,
          notes = EXCLUDED.notes,
          updated_at = EXCLUDED.updated_at
        RETURNING *;
      `;
      const now = new Date();
      const params = [
        item.id,
        item.category,
        item.year,
        item.stages?.lid_spdp || 0,
        item.stages?.dik_kejaksaan || 0,
        item.stages?.dik_kepolisian || 0,
        item.stages?.tut || 0,
        item.notes || null,
        now,
      ];
      const result = await pool.query(query, params);
      res.json({ success: true, entry: result.rows[0] });
    } catch (err: any) {
      console.error("POST /api/case-stats error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // 10. GET Annual Targets
  app.get("/api/annual-targets", async (req, res) => {
    try {
      const yearFilter = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
      let query = `
        SELECT 
          id,
          program,
          category,
          year,
          target_tahunan AS "targetTahunan",
          realisasi_tahunan AS "realisasiTahunan",
          satuan,
          keterangan,
          updated_at AS "updatedAt"
        FROM annual_targets
      `;
      const params: any[] = [];
      if (yearFilter) {
        query += " WHERE year = $1";
        params.push(yearFilter);
      }
      query += " ORDER BY year DESC, id ASC";
      const result = await pool.query(query, params);
      const rows = result.rows.map((r) => ({
        id: r.id,
        program: r.program,
        category: r.category,
        year: r.year,
        targetTahunan: parseInt(r.targetTahunan || 0, 10),
        realisasiTahunan: parseInt(r.realisasiTahunan || 0, 10),
        satuan: r.satuan || 'Kegiatan',
        keterangan: r.keterangan || '',
        updatedAt: r.updatedAt ? Number(r.updatedAt) : Date.now(),
      }));
      res.json(rows);
    } catch (err: any) {
      console.error("GET /api/annual-targets error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // 11. POST / Upsert Annual Target
  app.post("/api/annual-targets", async (req, res) => {
    try {
      const item = req.body;
      if (!item.id || !item.program || !item.year) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const query = `
        INSERT INTO annual_targets (
          id, program, category, year, target_tahunan, realisasi_tahunan, satuan, keterangan, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          program = EXCLUDED.program,
          category = EXCLUDED.category,
          year = EXCLUDED.year,
          target_tahunan = EXCLUDED.target_tahunan,
          realisasi_tahunan = EXCLUDED.realisasi_tahunan,
          satuan = EXCLUDED.satuan,
          keterangan = EXCLUDED.keterangan,
          updated_at = EXCLUDED.updated_at
        RETURNING *;
      `;
      const params = [
        item.id,
        item.program,
        item.category || 'Penkum / JMS',
        item.year,
        Number(item.targetTahunan || 0),
        Number(item.realisasiTahunan || 0),
        item.satuan || 'Kegiatan',
        item.keterangan || null,
        Date.now(),
      ];
      const result = await pool.query(query, params);
      res.json({ success: true, entry: result.rows[0] });
    } catch (err: any) {
      console.error("POST /api/annual-targets error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // 12. DELETE Annual Target
  app.delete("/api/annual-targets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query("DELETE FROM annual_targets WHERE id = $1", [id]);
      res.json({ success: true, id });
    } catch (err: any) {
      console.error("DELETE /api/annual-targets error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // 13. Reset Database
  app.post("/api/db/reset", async (_req, res) => {
    try {
      await pool.query("TRUNCATE TABLE intelligence_entries, outreach_entries, case_statistics, annual_targets RESTART IDENTITY;");
      await initializeDatabase();
      res.json({ success: true, message: "Database reset to official default state" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });


  // -------------------------------------------------------------
  // EXTERNAL JAMPIDUM PERKARA API (Live API for Case Statistics)
  // -------------------------------------------------------------
  app.get("/api/jampidum-perkara", async (req, res) => {
    const year = (req.query.year as string) || "2026";
    const satker = (req.query.satker as string) || "22.08";
    const timestamp = req.query._ || Date.now().toString();

    const targetUrl = `https://jampidum.kejaksaan.go.id/web/api/perkara/info/${encodeURIComponent(
      year
    )}/${encodeURIComponent(satker)}?_=${timestamp}`;

    const requestOptions = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: "https://jampidum.kejaksaan.go.id/",
      },
      agent: new https.Agent({ rejectUnauthorized: false }),
      timeout: 15000,
    };

    https
      .get(targetUrl, requestOptions, (apiRes) => {
        let rawData = "";

        apiRes.on("data", (chunk) => {
          rawData += chunk;
        });

        apiRes.on("end", () => {
          try {
            const parsed = JSON.parse(rawData);
            res.setHeader("Cache-Control", "public, max-age=300");
            res.json(parsed);
          } catch (e: any) {
            console.error("Failed to parse JAMPIDUM JSON response:", e.message);
            res.status(502).json({
              success: false,
              message: "Invalid response from JAMPIDUM server",
              error: e.message,
              rawSnippet: rawData.slice(0, 200),
            });
          }
        });
      })
      .on("error", (err) => {
        console.error("Error contacting JAMPIDUM API:", err.message);
        res.status(500).json({
          success: false,
          message: "Gagal terhubung ke server JAMPIDUM Kejaksaan RI",
          error: err.message,
        });
      });
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
