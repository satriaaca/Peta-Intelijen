import React, { useState } from 'react';
import ForeignerFormView, { ForeignerEntry } from './ForeignerFormView';
import { AppUser } from '../types';

interface PoraViewProps {
  currentUser: AppUser | null;
}

export default function PoraView({ currentUser }: PoraViewProps) {
  return (
    <div className="space-y-6">
      <ForeignerFormView currentUser={currentUser} />
    </div>
  );
}
