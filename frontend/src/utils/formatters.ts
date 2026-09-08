/**
 * Common formatting and string utility functions
 */

export const formatDate = (dateString?: string | Date | null, options?: Intl.DateTimeFormatOptions): string => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', options || {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
};

export const formatDateTime = (dateString?: string | Date | null): string => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid Date';
  }
};

export const capitalize = (str?: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getStatusBadgeStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'new':
      return { bg: '#e0f2fe', color: '#0284c7', label: 'New' };
    case 'contacted':
      return { bg: '#fef3c7', color: '#d97706', label: 'Contacted' };
    case 'qualified':
      return { bg: '#dcfce7', color: '#16a34a', label: 'Qualified' };
    case 'lost':
      return { bg: '#fee2e2', color: '#dc2626', label: 'Lost' };
    default:
      return { bg: '#f1f5f9', color: '#475569', label: capitalize(status) };
  }
};

export const trimObjectValues = <T extends Record<string, any>>(obj: T): T => {
  const result: any = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') {
      result[key] = val.trim();
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      result[key] = trimObjectValues(val);
    } else {
      result[key] = val;
    }
  }
  return result as T;
};
