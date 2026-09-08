import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined as LockIcon,
  Save as SaveIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { Formik, Form, getIn } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../redux/Store';
import { logoutUser } from '../../redux/slices/authSlice';
import apiClient from '../../api/apiClient';
import Api from '../../api/EndPoint';
import toast from 'react-hot-toast';
import { changePasswordSchema } from '../../utils/validationSchemas';

export const ChangePassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    setLoading(true);
    try {
      const response = await apiClient.post(Api.CHANGE_PASSWORD, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      toast.success(response.data.message || 'Password changed successfully! Please log in again.');
      resetForm();

      // Logout and redirect to login
      setTimeout(async () => {
        await dispatch(logoutUser());
        navigate('/login');
      }, 1200);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: '750px', mx: 'auto' }}>
      {/* Header security info banner */}
      <Box
        sx={{
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          p: { xs: 2, sm: 3 },
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
          border: '1px solid #e2e8f0',
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #e2e8f0',
          }}
        >
          <LockIcon sx={{ color: '#002147', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#002147', fontSize: '16px' }}>
            Update your password
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px' }}>
            Ensure your account is using a strong password with at least 6 characters.
          </Typography>
        </Box>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={changePasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form>
            <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <Grid container spacing={3}>
                {/* Current Password */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                    Current Password <span className="required-star">*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type={showOldPassword ? 'text' : 'password'}
                    name="oldPassword"
                    placeholder="Enter current password"
                    inputProps={{ maxLength: 50, minLength: 6 }}
                    value={values.oldPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(getIn(touched, 'oldPassword') && getIn(errors, 'oldPassword'))}
                    helperText={
                      getIn(touched, 'oldPassword') && getIn(errors, 'oldPassword') ? (
                        <span className="field-error">{getIn(errors, 'oldPassword')}</span>
                      ) : null
                    }
                    sx={{ mt: 0.5 }}
                    InputProps={{
                      startAdornment: <SecurityIcon sx={{ color: '#002147', fontSize: 20, mr: 1 }} />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowOldPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showOldPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* New Password */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                    New Password <span className="required-star">*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    placeholder="Enter new password"
                    inputProps={{ maxLength: 50, minLength: 6 }}
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(getIn(touched, 'newPassword') && getIn(errors, 'newPassword'))}
                    helperText={
                      getIn(touched, 'newPassword') && getIn(errors, 'newPassword') ? (
                        <span className="field-error">{getIn(errors, 'newPassword')}</span>
                      ) : null
                    }
                    sx={{ mt: 0.5 }}
                    InputProps={{
                      startAdornment: <LockIcon sx={{ color: '#002147', fontSize: 20, mr: 1 }} />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showNewPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Confirm Password */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                    Confirm New Password <span className="required-star">*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    inputProps={{ maxLength: 50, minLength: 6 }}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(getIn(touched, 'confirmPassword') && getIn(errors, 'confirmPassword'))}
                    helperText={
                      getIn(touched, 'confirmPassword') && getIn(errors, 'confirmPassword') ? (
                        <span className="field-error">{getIn(errors, 'confirmPassword')}</span>
                      ) : null
                    }
                    sx={{ mt: 0.5 }}
                    InputProps={{
                      startAdornment: <LockIcon sx={{ color: '#002147', fontSize: 20, mr: 1 }} />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-gradient"
                  startIcon={<SaveIcon />}
                  sx={{ px: 3.5, py: 1 }}
                >
                  {loading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : 'Change Password'}
                </Button>
              </Box>
            </Paper>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ChangePassword;
