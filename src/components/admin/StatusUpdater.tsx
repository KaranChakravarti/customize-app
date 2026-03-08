'use client';

import React, { useState, useTransition } from 'react';
import { updateProjectStatus } from '@/actions/project.actions';

export default function StatusUpdater({ projectId, currentStatus }: { projectId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  // Map statuses to progress percentages
  const statusMap: Record<string, number> = {
    'PENDING_REVIEW': 5,
    'IN_DESIGN': 25,
    'IN_DEVELOPMENT': 60,
    'REVISION': 75,
    'FINAL_DELIVERY': 90,
    'COMPLETED': 100,
    'CANCELLED': 0,
  };

  const handleUpdate = () => {
    startTransition(async () => {
      const progress = statusMap[status] || 5;
      const result = await updateProjectStatus(projectId, status, progress);
      
      if (!result.success) {
        alert(result.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full bg-[#0D0D0D] border border-[#262626] rounded-lg p-3 text-white focus:outline-none focus:border-[#FF4D00] transition-colors font-medium text-sm"
        disabled={isPending}
      >
        <option value="PENDING_REVIEW">Pending Review (5%)</option>
        <option value="IN_DESIGN">In Design Phase (25%)</option>
        <option value="IN_DEVELOPMENT">In Development (60%)</option>
        <option value="REVISION">Awaiting Client Revision (75%)</option>
        <option value="FINAL_DELIVERY">Final Delivery Sent (90%)</option>
        <option value="COMPLETED">Completed (100%)</option>
        <option value="CANCELLED">Cancelled (0%)</option>
      </select>

      <button
        onClick={handleUpdate}
        disabled={isPending || status === currentStatus}
        className="w-full py-3 rounded-lg bg-[#FF4D00] hover:bg-[#FF6A2A] text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Updating...' : 'Save & Notify Client'}
      </button>
    </div>
  );
}