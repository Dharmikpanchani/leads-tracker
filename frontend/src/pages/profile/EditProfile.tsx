import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Badge as RoleIcon,
} from '@mui/icons-material';
import { Formik, Form, getIn } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/Store';
import { fetchProfile } from '../../redux/slices/authSlice';
import apiClient from '../../api/apiClient';
import Api from '../../api/EndPoint';
import toast from 'react-hot-toast';
import { profileSchema } from '../../utils/validationSchemas';

export const EditProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    name: user?.name || '',
    email: user?.email || '',
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading(true);
    try {
      const response = await apiClient.put(Api.UPDATE_PROFILE, { name: values.name.trim() });
      toast.success(response.data.message || 'Profile updated successfully!');
      dispatch(fetchProfile());
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: '750px', mx: 'auto' }}>
      {/* Header card info */}
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
        <Avatar
          sx={{
            width: 54,
            height: 54,
            backgroundColor: '#002147',
            color: '#f1b000',
            fontWeight: 800,
            fontSize: '20px',
            border: '2px solid #e2e8f0',
          }}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#002147', fontSize: '17px' }}>
            {user?.name || 'User Profile'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px' }}>
            {user?.email || 'developer@yopmail.com'}
          </Typography>
        </Box>
      </Box>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={profileSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form>
            <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <Grid container spacing={3}>
                {/* Full Name */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                    Full Name <span className="required-star">*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="name"
                    inputProps={{ maxLength: 70, minLength: 2 }}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(getIn(touched, 'name') && getIn(errors, 'name'))}
                    helperText={
                      getIn(touched, 'name') && getIn(errors, 'name') ? (
                        <span className="field-error">{getIn(errors, 'name')}</span>
                      ) : null
                    }
                    sx={{ mt: 0.5 }}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ color: '#002147', fontSize: 20, mr: 1 }} />,
                    }}
                  />
                </Grid>

                {/* Email (Readonly) */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                    Email Address (Read-only)
                  </Typography>
                  <TextField
                    fullWidth
                    disabled
                    size="small"
                    name="email"
                    value={values.email}
                    sx={{ mt: 0.5, backgroundColor: '#f1f5f9' }}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ color: '#94a3b8', fontSize: 20, mr: 1 }} />,
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
                  {loading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : 'Save Changes'}
                </Button>
              </Box>
            </Paper>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditProfile;
