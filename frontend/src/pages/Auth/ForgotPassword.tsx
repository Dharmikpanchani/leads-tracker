import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { LayersOutlined as AppLogoIcon } from '@mui/icons-material';
import { useFormik, getIn } from 'formik';
import apiClient from '../../api/apiClient';
import Api from '../../api/EndPoint';
import toast from 'react-hot-toast';
import { forgotPasswordSchema } from '../../utils/validationSchemas';

export const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await apiClient.post(Api.FORGOT_PASSWORD, {
          email: values.email.trim(),
        });
        toast.success(response.data?.message || 'OTP sent successfully!');
        navigate('/forgot-password/otp', {
          state: { email: values.email.trim() },
        });
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to send OTP.');
      } finally {
        setLoading(false);
      }
    },
  });

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
          Forgot Password
        </Typography>
        <Typography className="login-subtitle">
          Enter your registered email to receive a 6-digit verification OTP.
        </Typography>

        <form onSubmit={formik.handleSubmit}>
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
            {loading ? <CircularProgress size={22} sx={{ color: '#ffffff' }} /> : 'Send OTP'}
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

export default ForgotPassword;
