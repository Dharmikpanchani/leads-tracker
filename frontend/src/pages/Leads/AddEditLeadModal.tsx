import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useFormik, getIn } from 'formik';
import FormDialog from '../../components/common/FormDialog';
import { Lead } from '../../redux/slices/leadSlice';
import { leadFormSchema } from '../../utils/validationSchemas';
import { trimObjectValues } from '../../utils/formatters';

interface AddEditLeadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<boolean | void>;
  initialData?: Lead | null;
  loading?: boolean;
}

export const AddEditLeadModal: React.FC<AddEditLeadModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const isEditing = Boolean(initialData);

  const initialValues = React.useMemo(
    () => ({
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      status: initialData?.status || 'new',
      source: initialData?.source || 'Web Portal',
    }),
    [initialData]
  );

  const formik = useFormik({
    initialValues,
    validationSchema: leadFormSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const sanitized = trimObjectValues(values);
      const isSuccess = await onSubmit(sanitized);
      if (isSuccess !== false) {
        formik.resetForm();
        onClose();
      }
    },
  });

  const handleModalClose = () => {
    formik.resetForm();
    onClose();
  };

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <FormDialog
      open={open}
      onClose={handleModalClose}
      title={isEditing ? 'Edit Lead Information' : 'Create New Lead'}
      maxWidth="sm"
      actions={
        <>
          <Button
            onClick={handleModalClose}
            disabled={loading}
            sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => formik.handleSubmit()}
            disabled={loading}
            className="btn-primary-gradient"
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: '#ffffff' }} />
            ) : isEditing ? (
              'Update Lead'
            ) : (
              'Save Lead'
            )}
          </Button>
        </>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2.5}>
          {/* Full Name */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
              Lead Name <span className="required-star">*</span>
            </Typography>
            <TextField
              fullWidth
              id="name"
              name="name"
              size="small"
              placeholder="e.g. Rajesh Sharma"
              inputProps={{ maxLength: 70, minLength: 2 }}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(getIn(formik.touched, 'name') && getIn(formik.errors, 'name'))}
              helperText={
                getIn(formik.touched, 'name') && getIn(formik.errors, 'name') ? (
                  <span className="field-error">{getIn(formik.errors, 'name')}</span>
                ) : null
              }
            />
          </Grid>

          {/* Email Address */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
              Email Address <span className="required-star">*</span>
            </Typography>
            <TextField
              fullWidth
              id="email"
              name="email"
              size="small"
              placeholder="user@example.com"
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
          </Grid>

          {/* Phone Number */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
              Phone Number <span className="required-star">*</span>
            </Typography>
            <TextField
              fullWidth
              id="phone"
              name="phone"
              size="small"
              placeholder="e.g. 9876543210"
              inputProps={{ maxLength: 10 }}
              value={formik.values.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                formik.setFieldValue('phone', val);
              }}
              onBlur={formik.handleBlur}
              error={Boolean(getIn(formik.touched, 'phone') && getIn(formik.errors, 'phone'))}
              helperText={
                getIn(formik.touched, 'phone') && getIn(formik.errors, 'phone') ? (
                  <span className="field-error">{getIn(formik.errors, 'phone')}</span>
                ) : null
              }
            />
          </Grid>

          {/* Status */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
              Lead Status <span className="required-star">*</span>
            </Typography>
            <TextField
              select
              fullWidth
              id="status"
              name="status"
              size="small"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(getIn(formik.touched, 'status') && getIn(formik.errors, 'status'))}
              helperText={
                getIn(formik.touched, 'status') && getIn(formik.errors, 'status') ? (
                  <span className="field-error">{getIn(formik.errors, 'status')}</span>
                ) : null
              }
            >
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="qualified">Qualified</MenuItem>
              <MenuItem value="lost">Lost</MenuItem>
            </TextField>
          </Grid>

          {/* Lead Source */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
              Lead Source
            </Typography>
            <TextField
              fullWidth
              id="source"
              name="source"
              size="small"
              placeholder="e.g. Website Form, Referral"
              inputProps={{ maxLength: 80 }}
              value={formik.values.source}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(getIn(formik.touched, 'source') && getIn(formik.errors, 'source'))}
              helperText={
                getIn(formik.touched, 'source') && getIn(formik.errors, 'source') ? (
                  <span className="field-error">{getIn(formik.errors, 'source')}</span>
                ) : null
              }
            />
          </Grid>
        </Grid>
      </form>
    </FormDialog>
  );
};

export default AddEditLeadModal;
