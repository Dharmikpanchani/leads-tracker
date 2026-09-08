import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LayersOutlined as AppLogoIcon,
} from '@mui/icons-material';
import { useFormik, getIn } from 'formik';
import apiClient from '../../api/apiClient';
import Api from '../../api/EndPoint';
import toast from 'react-hot-toast';
import { setPasswordSchema } from '../../utils/validationSchemas';

export const SetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: setPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await apiClient.post(Api.SET_PASSWORD, {
          email,
          password: values.password,
        });
        toast.success(response.data?.message || 'Password reset successfully!');
        navigate('/login', { replace: true });
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
    },
  });

  if (!email) {
    navigate('/forgot-password', { replace: true });
    return null;
  }

  return (
    <Box className="login-page-container" sx={{ justifyContent: 'center' }}>
      <div className="login-video-wrapper">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="login-bg-video"
          poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-996-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://cdn.pixabay.com/video/2023/10/12/184734-873923030_large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="login-video-overlay" />
      </div>

      <Box className="login-card">
        {/* Brand Logo */}
        <Box className="login-logo">
          <AppLogoIcon sx={{ fontSize: 32 }} />
        </Box>

        <Typography className="login-title">
          Set New Password
        </Typography>
        <Typography className="login-subtitle">
          Enter a new secure password for your account.
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          {/* New Password */}
          <Box className="login-form-group">
            <label htmlFor="password">
              New Password<span className="required-asterisk">*</span>
            </label>
            <TextField
              fullWidth
              id="password"
              name="password"
              placeholder="Enter New Password"
              variant="outlined"
              size="small"
              inputProps={{ maxLength: 50, minLength: 6 }}
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(getIn(formik.touched, 'password') && getIn(formik.errors, 'password'))}
              helperText={
                getIn(formik.touched, 'password') && getIn(formik.errors, 'password') ? (
                  <span className="field-error">{getIn(formik.errors, 'password')}</span>
                ) : null
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      size="small"
                      sx={{ color: '#94a3b8' }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Confirm Password */}
          <Box className="login-form-group" sx={{ mt: 2 }}>
            <label htmlFor="confirmPassword">
              Confirm Password<span className="required-asterisk">*</span>
            </label>
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm New Password"
              variant="outlined"
              size="small"
              inputProps={{ maxLength: 50, minLength: 6 }}
              type={showConfirmPassword ? 'text' : 'password'}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(getIn(formik.touched, 'confirmPassword') && getIn(formik.errors, 'confirmPassword'))}
              helperText={
                getIn(formik.touched, 'confirmPassword') && getIn(formik.errors, 'confirmPassword') ? (
                  <span className="field-error">{getIn(formik.errors, 'confirmPassword')}</span>
                ) : null
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      edge="end"
                      size="small"
                      sx={{ color: '#94a3b8' }}
                    >
                      {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            fullWidth
            type="submit"
            disabled={loading}
            className="btn-primary-gradient"
            sx={{
              mt: 3,
              py: 1.2,
              fontSize: '15px',
              height: '42px',
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#ffffff' }} /> : 'Set New Password'}
          </Button>

          <Box sx={{ mt: 2.5, textAlign: 'center' }}>
            <Link
              to="/login"
              style={{
                color: '#00509d',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Back to Login?
            </Link>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default SetPassword;
