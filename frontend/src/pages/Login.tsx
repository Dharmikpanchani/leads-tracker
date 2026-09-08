import React, { useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/Store';
import { loginUser } from '../redux/slices/authSlice';
import { loginSchema } from '../utils/validationSchemas';
import { trimObjectValues } from '../utils/formatters';

export const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const formik = useFormik({
    initialValues: {
      email: 'developer@yopmail.com',
      password: 'Admin@123',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const sanitized = trimObjectValues(values);
      const result = await dispatch(loginUser(sanitized));
      if (loginUser.fulfilled.match(result)) {
        navigate('/leads');
      }
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/leads" replace />;
  }

  return (
    <Box className="login-page-container">
      {/* Background Video with Fallback & Overlay */}
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

      {/* Left Branding Hero */}
      <Box className="login-brand-hero">
        <Box className="login-hero-badge">
          <span className="pulsing-dot" />
          <span>Leads Tracker • Enterprise CRM</span>
        </Box>
        <Typography variant="h3" className="login-hero-title">
          Smart Lead Management & Pipeline Velocity
        </Typography>
        <Typography variant="body1" className="login-hero-desc">
          Capture, qualify, and convert potential leads with intelligent real-time analytics, status pipelines, and seamless team collaboration.
        </Typography>
        <Box className="login-hero-features">
          <div className="hero-feature-item">
            <span className="feature-icon">⚡</span>
            <span>Real-time Lead Ingestion</span>
          </div>
          <div className="hero-feature-item">
            <span className="feature-icon">📊</span>
            <span>3,000+ Tracked Records</span>
          </div>
          <div className="hero-feature-item">
            <span className="feature-icon">🔒</span>
            <span>JWT Secure Authentication</span>
          </div>
        </Box>
      </Box>

      {/* Right Login Card */}
      <Box className="login-card">
        {/* Brand Logo */}
        <Box className="login-logo">
          <AppLogoIcon sx={{ fontSize: 32 }} />
        </Box>

        <Typography className="login-title">
          Login your account
        </Typography>
        <Typography className="login-subtitle">
          Enter your email and password to login to your account.
        </Typography>

        {/* Login Form */}
        <form onSubmit={formik.handleSubmit}>
          {/* Email Field */}
          <Box className="login-form-group">
            <label htmlFor="email">
              Email<span className="required-asterisk">*</span>
            </label>
            <TextField
              fullWidth
              id="email"
              name="email"
              placeholder="Enter Email"
              variant="outlined"
              size="small"
              inputProps={{ maxLength: 100, minLength: 5 }}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(getIn(formik.touched, 'email') && getIn(formik.errors, 'email'))}
              helperText={
                getIn(formik.touched, 'email') && getIn(formik.errors, 'email') ? (
                  <span className="field-error">{getIn(formik.errors, 'email')}</span>
                ) : null
              }
            />
          </Box>

          {/* Password Field */}
          <Box className="login-form-group" sx={{ mt: 2 }}>
            <label htmlFor="password">
              Password<span className="required-asterisk">*</span>
            </label>
            <TextField
              fullWidth
              id="password"
              name="password"
              placeholder="Enter Password"
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
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
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

          {/* Forgot Password Link */}
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Link
              to="/forgot-password"
              style={{
                color: '#00509d',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Forgot Password?
            </Link>
          </Box>

          {/* Submit Button */}
          <Button
            fullWidth
            type="submit"
            disabled={loading}
            className="btn-primary-gradient"
            sx={{
              mt: 2,
              py: 1.2,
              fontSize: '15px',
              height: '42px',
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#ffffff' }} /> : 'Login'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
