import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Divider,
  Tooltip,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  EmailOutlined as EmailIcon,
  PhoneOutlined as PhoneIcon,
  Send as SendIcon,
  PersonOutline as PersonIcon,
  LanguageOutlined as SourceIcon,
  DonutLargeOutlined as StatusIcon,
  AccessTimeOutlined as TimeIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik, getIn } from 'formik';
import { RootState, AppDispatch } from '../../redux/Store';
import { fetchLeadById } from '../../redux/slices/leadSlice';
import { fetchNotesByLead, addNote, deleteNote } from '../../redux/slices/noteSlice';
import StatusChip from '../../components/common/StatusChip';
import PopupModal from '../../components/common/PopupModal';
import Pagination from '../../components/common/Pagination';
import Svg from '../../assets/Svg';
import { noteFormSchema } from '../../utils/validationSchemas';
import { formatDate, formatDateTime } from '../../utils/formatters';

export const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentLead, loading } = useSelector((state: RootState) => state.lead);
  const { notes, loading: notesLoading, actionLoading: noteActionLoading } = useSelector(
    (state: RootState) => state.note
  );

  const [notePage, setNotePage] = useState(0);
  const [notesPerPage, setNotesPerPage] = useState(5);

  const paginatedNotes = notes ? notes.slice(notePage * notesPerPage, (notePage + 1) * notesPerPage) : [];

  useEffect(() => {
    if (notePage > 0 && notePage * notesPerPage >= (notes?.length || 0)) {
      setNotePage(Math.max(0, Math.ceil((notes?.length || 0) / notesPerPage) - 1));
    }
  }, [notes, notePage, notesPerPage]);

  useEffect(() => {
    if (id) {
      dispatch(fetchLeadById(id));
      dispatch(fetchNotesByLead(id));
      setNotePage(0);
    }
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      content: '',
    },
    validationSchema: noteFormSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!id) return;
      const result = await dispatch(addNote({ leadId: id, content: values.content.trim() }));
      if (addNote.fulfilled.match(result)) {
        resetForm();
        setNotePage(0);
      }
    },
  });

  const [noteDeleteModalOpen, setNoteDeleteModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | number | null>(null);

  const handleOpenDeleteNote = (noteId: string | number) => {
    setSelectedNoteId(noteId);
    setNoteDeleteModalOpen(true);
  };

  const handleConfirmDeleteNote = async () => {
    if (!id || selectedNoteId === null) return;
    await dispatch(deleteNote({ leadId: id, noteId: selectedNoteId }));
    setNoteDeleteModalOpen(false);
    setSelectedNoteId(null);
  };

  if (loading || !currentLead) {
    return (
      <Box className="page-container" sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress size={36} sx={{ color: '#002147' }} />
        <Typography variant="body2" sx={{ mt: 2, color: '#64748b' }}>
          Loading lead details...
        </Typography>
      </Box>
    );
  }

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#002147' }}>
              {currentLead.name}
            </Typography>
            <StatusChip status={currentLead.status} />
          </Box>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Lead ID #{currentLead.id} &bull; Created {formatDate(currentLead.createdAt)}
          </Typography>
        </Box>
      </Box>

      {/* Main Details Card (Read-Only View) */}
      <Paper elevation={0} className="portal-card" sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#002147', mb: 2 }}>
          Lead Information
        </Typography>

        <Grid container spacing={3}>
          {/* Email */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b', mb: 0.5 }}>
              <EmailIcon fontSize="small" />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Email Address
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
              {currentLead.email}
            </Typography>
          </Grid>

          {/* Phone */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b', mb: 0.5 }}>
              <PhoneIcon fontSize="small" />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Phone Number
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
              {currentLead.phone}
            </Typography>
          </Grid>

          {/* Source */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b', mb: 0.5 }}>
              <SourceIcon fontSize="small" />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Lead Source
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
              {currentLead.source || 'N/A'}
            </Typography>
          </Grid>

          {/* Status (Read-Only Chip Display) */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b', mb: 0.5 }}>
              <StatusIcon fontSize="small" />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Pipeline Status
              </Typography>
            </Box>
            <Box sx={{ mt: 0.5 }}>
              <StatusChip status={currentLead.status} />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
              <TimeIcon fontSize="small" />
              <Typography variant="caption">
                <strong>Last Updated:</strong> {formatDateTime(currentLead.updatedAt)}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
              <TimeIcon fontSize="small" />
              <Typography variant="caption">
                <strong>Created At:</strong> {formatDateTime(currentLead.createdAt)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Notes & Activity Section */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} className="portal-card">
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#002147', mb: 2 }}>
              Lead Notes & Activity Log ({notes?.length || 0})
            </Typography>

            {/* Add Note Form */}
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mb: 4 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 1 }}>
                Add New Note / Follow-up Update
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                id="content"
                name="content"
                placeholder="Write note details, follow-up remarks, meeting outcome..."
                inputProps={{ maxLength: 500, minLength: 3 }}
                value={formik.values.content}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(getIn(formik.touched, 'content') && getIn(formik.errors, 'content'))}
                helperText={
                  getIn(formik.touched, 'content') && getIn(formik.errors, 'content') ? (
                    <span className="field-error">{getIn(formik.errors, 'content')}</span>
                  ) : null
                }
                sx={{ backgroundColor: '#f8fafc', borderRadius: '8px' }}
              />
              <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  disabled={noteActionLoading || !formik.values.content.trim()}
                  className="btn-primary-gradient"
                  startIcon={<SendIcon />}
                >
                  {noteActionLoading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : 'Add Note'}
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Notes List */}
            {notesLoading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={28} sx={{ color: '#002147' }} />
              </Box>
            ) : notes?.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {paginatedNotes.map((note) => (
                  <Box
                    key={note.id}
                    sx={{
                      p: 2.5,
                      borderRadius: '10px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      transition: 'border-color 0.2s ease',
                      '&:hover': { borderColor: '#cbd5e1' },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: '#00509d' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#002147' }}>
                          {note.createdBy || 'System Admin'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          &bull; {formatDateTime(note.createdAt)}
                        </Typography>
                      </Box>
                      <Tooltip title="Delete Note" arrow placement="bottom">
                        <Button
                          className="admin-table-data-btn admin-table-delete-btn"
                          onClick={() => handleOpenDeleteNote(note.id)}
                        >
                          <img src={Svg.trash} className="admin-icon" alt="Delete" />
                        </Button>
                      </Tooltip>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                    >
                      {note.content}
                    </Typography>
                  </Box>
                ))}

                {/* Pagination for Notes */}
                <Box sx={{ mt: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <Pagination
                    page={notePage}
                    rowsPerPage={notesPerPage}
                    setPage={setNotePage}
                    setRowsPerPage={setNotesPerPage}
                    count={notes.length}
                    itemName="notes"
                    rowsPerPageOptions={[5, 10, 20]}
                  />
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4, color: '#64748b' }}>
                <Typography variant="body2">No notes added for this lead yet.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Note Popup Modal */}
      <PopupModal
        type="delete"
        buttonText="Delete"
        module="this note"
        open={noteDeleteModalOpen}
        handleClose={() => setNoteDeleteModalOpen(false)}
        handleFunction={handleConfirmDeleteNote}
        buttonStatusSpinner={noteActionLoading}
      />
    </Box>
  );
};

export default LeadDetail;
