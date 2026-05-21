import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'submitted':
      case 'pending_acceptance':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'declined':
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress':
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'quote_required':
      case 'requires_information':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(status)}`}>
      {status.replace(/_/g, ' ').toUpperCase()}
    </span>
  );
};
