import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import { LayersOutlined as AppLogoIcon } from '@mui/icons-material';
import apiClient from '../../api/apiClient';
import Api from '../../api/EndPoint';
import toast from 'react-hot-toast';

export const ForgotPasswordOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const timerRef = useRef<any>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start countdown timer
  const startTimer = (seconds: number = 120) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(seconds);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
      return;
    }

    startTimer(120);
    // Auto-focus the first box on load
    inputRefs.current[0]?.focus();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [email, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Handle single box input
  const handleChange = (index: number, value: string) => {
    setError('');
    // Allow only numeric input
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    // If pasted or typed multiple digits
    if (cleaned.length > 1) {
      handlePasteData(cleaned);
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned[cleaned.length - 1];
    setOtpDigits(newDigits);

    // Auto advance focus to next input
    if (index < 5 && cleaned) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace / Arrow navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      const fullOtp = otpDigits.join('');
      if (fullOtp.length === 6) {
        handleVerify();
      }
    }
  };

  // Handle Clipboard Paste of 6 digits
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '');
    handlePasteData(pasteData);
  };

  const handlePasteData = (data: string) => {
    if (!data) return;
    const digits = data.slice(0, 6).split('');
    const newDigits = ['', '', '', '', '', ''];
    digits.forEach((d, i) => {
      newDigits[i] = d;
    });
    setOtpDigits(newDigits);
    setError('');

    // Focus last filled box or next box
    const nextFocusIndex = Math.min(digits.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  // Verify OTP Action
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join('');

    if (fullOtp.length < 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await apiClient.post(Api.VERIFY_OTP, {
        email,
        otp: fullOtp,
      });
      toast.success(response.data?.message || 'OTP verified successfully!');
      navigate('/set-password', {
        state: { email },
      });
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Invalid or expired OTP';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Action
  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    try {
      const response = await apiClient.post(Api.RESEND_OTP, { email });
      toast.success(response.data?.message || 'New OTP sent to your email!');
      setOtpDigits(['', '', '', '', '', '']);
      startTimer(120);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Box className="login-page-container" sx={{ justifyContent: 'center' }}>
      {/* Background Video */}
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

      {/* Demo Style OTP Card */}
      <Box className="login-card">
        {/* Brand Logo */}
        <Box className="login-logo">
          <AppLogoIcon sx={{ fontSize: 32 }} />
        </Box>

        <Typography className="login-title">
          Forgot Password OTP
        </Typography>
        <Typography className="login-subtitle">
          Please enter the 6-digit OTP sent to your email address{' '}
          <strong style={{ color: '#002147' }}>{email}</strong>.
        </Typography>

        <form onSubmit={handleVerify}>
          <Box className="login-form-group">
            <label style={{ textAlign: 'center', display: 'block', marginBottom: '10px' }}>
              6-Digit OTP<span className="required-asterisk">*</span>
            </label>

            {/* 6 Individual Digit Boxes matching Demo design */}
            <Box className="otp-input-wrapper">
              <div className="otp-container">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`otp-single-input ${error ? 'error' : ''}`}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
            </Box>

            {error && (
              <FormHelperText sx={{ color: '#ef4444', textAlign: 'center', mt: 1, fontWeight: 500 }}>
                {error}
              </FormHelperText>
            )}
          </Box>

          {/* Resend OTP Timer box matching Demo */}
          <Box className="resend-otp-box">
            {timeLeft > 0 ? (
              <Typography className="timer-text">
                Resend OTP in <span>{formatTime(timeLeft)}</span>
              </Typography>
            ) : (
              <Button
                className="resend-btn"
                onClick={handleResend}
                disabled={resendLoading}
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </Button>
            )}
          </Box>

          {/* Back to Forgot Password */}
          <Typography
            className="back-to-login"
            style={{
              cursor: 'pointer',
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#00509d',
            }}
            onClick={() => navigate('/forgot-password')}
          >
            Back to Forgot Password?
          </Typography>

          {/* Submit Button */}
          <Button
            fullWidth
            type="submit"
            disabled={loading || otpDigits.join('').length < 6}
            className="btn-primary-gradient"
            sx={{
              py: 1.2,
              fontSize: '15px',
              height: '42px',
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#ffffff' }} /> : 'Verify OTP'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPasswordOtp;
