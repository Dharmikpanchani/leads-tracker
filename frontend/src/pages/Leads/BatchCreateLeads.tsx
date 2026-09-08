import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Paper,
  MenuItem,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { Formik, Form, FieldArray, getIn } from 'formik';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import Api from '../../api/EndPoint';
import Svg from '../../assets/Svg';
import toast from 'react-hot-toast';
import { batchLeadsFormSchema } from '../../utils/validationSchemas';
import { trimObjectValues } from '../../utils/formatters';

export const BatchCreateLeads: React.FC = () => {
  const navigate = useNavigate();

  const initialValues = {
    leads: [
      { name: '', email: '', phone: '', status: 'new', source: 'Batch Import' },
      { name: '', email: '', phone: '', status: 'new', source: 'Batch Import' },
    ],
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const sanitizedPayload = {
        leads: values.leads.map((l: any) => ({
          ...l,
          name: l.name.trim(),
          email: l.email.trim(),
          phone: l.phone.trim(),
          source: l.source ? l.source.trim() : '',
        })),
      };
      const response = await apiClient.post(Api.BULK_LEADS, sanitizedPayload);
      toast.success(response.data.message || 'Leads imported successfully!');
      navigate('/leads');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to import batch leads');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="page-container">
      {/* Top Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Button
            onClick={() => navigate('/leads')}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: '#002147',
              fontWeight: 600,
              textTransform: 'none',
              mb: 1,
            }}
          >
            Back to Leads
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#002147' }}>
            Batch / Multi-Lead Entry
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Add multiple leads simultaneously using dynamic FieldArray validation
          </Typography>
        </Box>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={batchLeadsFormSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
          <Form>
            <FieldArray name="leads">
              {({ push, remove }) => (
                <Box>
                  {values.leads.map((_, index) => {
                    const nameError = getIn(touched, `leads[${index}].name`) && getIn(errors, `leads[${index}].name`);
                    const emailError = getIn(touched, `leads[${index}].email`) && getIn(errors, `leads[${index}].email`);
                    const phoneError = getIn(touched, `leads[${index}].phone`) && getIn(errors, `leads[${index}].phone`);
                    const statusError = getIn(touched, `leads[${index}].status`) && getIn(errors, `leads[${index}].status`);
                    const sourceError = getIn(touched, `leads[${index}].source`) && getIn(errors, `leads[${index}].source`);

                    return (
                      <Paper
                        key={index}
                        elevation={0}
                        className="portal-card"
                        sx={{
                          mb: 2.5,
                          p: 3,
                          border: '1px solid #e2e8f0',
                          position: 'relative',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#002147' }}>
                            Lead #{index + 1}
                          </Typography>
                          {values.leads.length > 1 && (
                            <Tooltip title="Remove row" arrow placement="bottom">
                              <Button
                                className="admin-table-data-btn admin-table-delete-btn"
                                onClick={() => remove(index)}
                              >
                                <img src={Svg.trash} className="admin-icon" alt="Delete" />
                              </Button>
                            </Tooltip>
                          )}
                        </Box>

                        <Grid container spacing={2}>
                          {/* Name */}
                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                              Full Name <span className="required-star">*</span>
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              name={`leads.${index}.name`}
                              placeholder="e.g. John Doe"
                              inputProps={{ maxLength: 70, minLength: 2 }}
                              value={values.leads[index].name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(nameError)}
                              helperText={nameError ? <span className="field-error">{nameError}</span> : null}
                              sx={{ mt: 0.5 }}
                            />
                          </Grid>

                          {/* Email */}
                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                              Email Address <span className="required-star">*</span>
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              name={`leads.${index}.email`}
                              placeholder="john@example.com"
                              inputProps={{ maxLength: 100, minLength: 5 }}
                              value={values.leads[index].email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(emailError)}
                              helperText={emailError ? <span className="field-error">{emailError}</span> : null}
                              sx={{ mt: 0.5 }}
                            />
                          </Grid>

                          {/* Phone */}
                          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                              Phone Number <span className="required-star">*</span>
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              name={`leads.${index}.phone`}
                              placeholder="e.g. 9876543210"
                              inputProps={{ maxLength: 10 }}
                              value={values.leads[index].phone}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setFieldValue(`leads.${index}.phone`, val);
                              }}
                              onBlur={handleBlur}
                              error={Boolean(phoneError)}
                              helperText={phoneError ? <span className="field-error">{phoneError}</span> : null}
                              sx={{ mt: 0.5 }}
                            />
                          </Grid>

                          {/* Status */}
                          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                              Status <span className="required-star">*</span>
                            </Typography>
                            <TextField
                              select
                              fullWidth
                              size="small"
                              name={`leads.${index}.status`}
                              value={values.leads[index].status}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(statusError)}
                              sx={{ mt: 0.5 }}
                            >
                              <MenuItem value="new">New</MenuItem>
                              <MenuItem value="contacted">Contacted</MenuItem>
                              <MenuItem value="qualified">Qualified</MenuItem>
                              <MenuItem value="lost">Lost</MenuItem>
                            </TextField>
                          </Grid>

                          {/* Source */}
                          <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                              Source
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              name={`leads.${index}.source`}
                              placeholder="Source"
                              inputProps={{ maxLength: 80 }}
                              value={values.leads[index].source}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(sourceError)}
                              helperText={sourceError ? <span className="field-error">{sourceError}</span> : null}
                              sx={{ mt: 0.5 }}
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    );
                  })}

                  {/* Actions bar */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() =>
                        push({ name: '', email: '', phone: '', status: 'new', source: 'Batch Import' })
                      }
                      sx={{
                        borderColor: '#002147',
                        color: '#002147',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '8px',
                      }}
                    >
                      Add Another Lead Row
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary-gradient"
                      startIcon={<SaveIcon />}
                      sx={{ py: 1, px: 3 }}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={22} sx={{ color: '#ffffff' }} />
                      ) : (
                        `Save All ${values.leads.length} Leads`
                      )}
                    </Button>
                  </Box>
                </Box>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default BatchCreateLeads;
