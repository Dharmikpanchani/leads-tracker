export const Api = {
  // Auth
  LOGIN: '/auth/login',
  REFRESH_TOKEN: '/auth/refresh-token',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_OTP: '/auth/verify-otp',
  RESEND_OTP: '/auth/resend-otp',
  SET_PASSWORD: '/auth/set-password',

  // Leads
  LEADS: '/leads',
  LEAD_BY_ID: (id: string | number) => `/leads/${id}`,
  LEAD_STATS: '/leads/stats',
  BULK_LEADS: '/leads/bulk',

  // Notes
  LEAD_NOTES: (leadId: string | number) => `/leads/${leadId}/notes`,
  DELETE_NOTE: (leadId: string | number, noteId: string | number) => `/leads/${leadId}/notes/${noteId}`,
};

export default Api;
