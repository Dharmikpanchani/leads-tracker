export const responseMessage = {
  // Auth & Profile
  LOGIN_SUCCESS: 'Logged in successfully.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  TOKEN_REQUIRED: 'Access token is required.',
  TOKEN_EXPIRED: 'Session expired. Please log in again.',
  INVALID_TOKEN: 'Invalid authentication token.',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required.',
  REFRESH_SUCCESS: 'Token refreshed successfully.',
  USER_NOT_FOUND: 'User account not found.',
  PROFILE_FETCHED: 'User profile fetched successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  NAME_REQUIRED: 'Name is required.',
  PASSWORD_CHANGED: 'Password changed successfully. Please login with your new password.',
  CURRENT_PASSWORD_MISMATCH: 'Current password does not match.',
  EMAIL_NOT_REGISTERED: 'No registered user found with this email address.',
  
  // OTP & Password Recovery
  OTP_SENT: 'OTP has been sent to your email address successfully.',
  OTP_RESENT: 'New OTP sent successfully to your email.',
  OTP_VERIFIED: 'OTP verified successfully.',
  OTP_EXPIRED: 'OTP has expired. Please request a new OTP.',
  OTP_INVALID: 'Invalid OTP entered. Please check and try again.',
  OTP_NOT_FOUND: 'OTP expired or not requested. Please request a new OTP.',
  OTP_REQUIRED_BEFORE_RESET: 'Please verify your OTP before resetting password.',
  PASSWORD_RESET_SUCCESS: 'Password has been reset successfully. You can now login with your new password.',

  // Leads
  LEAD_CREATED: 'Lead created successfully.',
  LEAD_FETCHED: 'Lead details fetched successfully.',
  LEADS_FETCHED: 'Leads list fetched successfully.',
  LEAD_UPDATED: 'Lead updated successfully.',
  LEAD_DELETED: 'Lead deleted successfully.',
  LEAD_NOT_FOUND: 'Lead not found.',
  EMAIL_ALREADY_EXISTS: 'Lead with this email already exists.',
  LEADS_ARRAY_REQUIRED: 'Leads array is required.',
  LEADS_BULK_CREATED: 'Batch leads created successfully.',
  LEAD_STATS_FETCHED: 'Lead statistics fetched successfully.',

  // Notes
  NOTE_ADDED: 'Note added successfully.',
  NOTES_FETCHED: 'Notes fetched successfully.',
  NOTE_NOT_FOUND: 'Note not found.',
  NOTE_DELETED: 'Note deleted successfully.',

  // Common / Errors
  INTERNAL_SERVER_ERROR: 'Internal server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Validation failed. Please check the submitted fields.',
  RATE_LIMIT_API: 'Too many requests. Please try again after some time.',
  RATE_LIMIT_AUTH: 'Too many authentication attempts. Please try again in 15 minutes.',
};

export default responseMessage;

