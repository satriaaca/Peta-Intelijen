/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_CONFIG?: string;
  readonly [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
