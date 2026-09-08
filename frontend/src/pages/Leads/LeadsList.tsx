import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  MenuItem,
  InputAdornment,
  Grid,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  VisibilityOutlined as ViewIcon,
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  ContentCopy as CopyIcon,
  PostAdd as BulkAddIcon,
  NoteOutlined as NoteIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../redux/Store';
import {
  fetchLeads,
  fetchLeadStats,
  createLead,
  updateLead,
  deleteLead,
  resetLeadList,
  Lead,
} from '../../redux/slices/leadSlice';
import StatusChip from '../../components/common/StatusChip';
import Pagination from '../../components/common/Pagination';
import DataNotFound from '../../components/common/DataNotFound';
import PopupModal from '../../components/common/PopupModal';
import AddEditLeadModal from './AddEditLeadModal';
import Loader from '../../components/common/Loader';
import Svg from '../../assets/Svg';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatters';

export const LeadsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { leads, total, loading, stats, actionLoading } =
    useSelector((state: RootState) => state.lead);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed for TablePagination
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLeadForDelete, setSelectedLeadForDelete] = useState<Lead | null>(null);

  const isInitialMount = useRef(true);

  // Fetch lead stats on mount
  useEffect(() => {
    dispatch(fetchLeadStats());
  }, [dispatch]);

  // Clean unified data fetching effect (instant on page visit, debounced on search typing)
  useEffect(() => {
    const params = {
      search: searchTerm.trim(),
      status: statusFilter,
      page: currentPage + 1, // API is 1-indexed
      limit: pageSize,
    };

    if (isInitialMount.current) {
      isInitialMount.current = false;
      dispatch(resetLeadList());
      dispatch(fetchLeads(params));
      return;
    }

    const delay = searchTerm ? 400 : 0;
    const timer = setTimeout(() => {
      dispatch(fetchLeads(params));
    }, delay);

    return () => clearTimeout(timer);
  }, [dispatch, searchTerm, statusFilter, currentPage, pageSize]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(0);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(0);
  };

  const handleOpenAddModal = () => {
    setEditingLead(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  };

  const handleSaveLead = async (values: any) => {
    if (editingLead) {
      await dispatch(updateLead({ id: editingLead.id, data: values }));
    } else {
      await dispatch(createLead(values));
    }
    dispatch(
      fetchLeads({
        search: searchTerm,
        status: statusFilter,
        page: currentPage + 1,
        limit: pageSize,
      })
    );
  };

  const handleOpenDelete = (lead: Lead) => {
    setSelectedLeadForDelete(lead);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedLeadForDelete) {
      await dispatch(deleteLead(selectedLeadForDelete.id));
      setDeleteModalOpen(false);
      setSelectedLeadForDelete(null);
      dispatch(
        fetchLeads({
          search: searchTerm,
          status: statusFilter,
          page: currentPage + 1,
          limit: pageSize,
        })
      );
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <Box className="page-container">
      {/* Top Header & Breadcrumb */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#002147' }}>
            Leads Pipeline
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Manage, track, and follow up with prospective clients and leads
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/leads/batch')}
            startIcon={<BulkAddIcon />}
            sx={{
              borderColor: '#002147',
              color: '#002147',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': { borderColor: '#00509d', backgroundColor: 'rgba(0, 33, 71, 0.04)' },
            }}
          >
            Batch Add Leads
          </Button>

          <Button
            onClick={handleOpenAddModal}
            className="btn-primary-gradient"
            startIcon={<AddIcon />}
          >
            New Lead
          </Button>
        </Box>
      </Box>

      {/* Stats Cards Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Leads', count: stats?.total || 0, color: '#002147', bg: '#f1f5f9' },
          { label: 'New', count: stats?.new || 0, color: '#1d4ed8', bg: '#eff6ff' },
          { label: 'Contacted', count: stats?.contacted || 0, color: '#b45309', bg: '#fef3c7' },
          { label: 'Qualified', count: stats?.qualified || 0, color: '#047857', bg: '#ecfdf5' },
          { label: 'Lost', count: stats?.lost || 0, color: '#b91c1c', bg: '#fef2f2' },
        ].map((item) => (
          <Grid key={item.label} size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: '10px',
                backgroundColor: item.bg,
                border: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                {item.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: item.color, mt: 0.5 }}>
                {item.count}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Main Table Card */}
      <Box className="portal-card" sx={{ p: 0, overflow: 'hidden' }}>
        {/* Search & Filter Toolbar */}
        <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0' }} className="table-toolbar">
          <Box className="table-toolbar-left">
            {/* Debounced Search Input */}
            <TextField
              size="small"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={handleSearchChange}
              inputProps={{ maxLength: 100 }}
              sx={{ width: { xs: '100%', sm: 320 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch} sx={{ p: 0.5 }}>
                      <ClearIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />

            {/* Status Dropdown with Visible Selected Value / Placeholder */}
            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              sx={{ width: { xs: '100%', sm: 200 } }}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected: any) => {
                  if (!selected || selected === '') {
                    return <span style={{ color: '#64748b', fontWeight: 500 }}>All Statuses</span>;
                  }
                  return (
                    <span style={{ fontWeight: 600, color: '#002147' }}>
                      {String(selected).charAt(0).toUpperCase() + String(selected).slice(1)}
                    </span>
                  );
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0.5 }}>
                    <FilterIcon fontSize="small" sx={{ color: '#002147' }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">
                <em>All Statuses</em>
              </MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="qualified">Qualified</MenuItem>
              <MenuItem value="lost">Lost</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* Data Table */}
        <TableContainer>
          <Table className="custom-table-container">
            <TableHead className="custom-table-head">
              <TableRow>
                <TableCell width="25%">Lead Details</TableCell>
                <TableCell width="20%">Contact Info</TableCell>
                <TableCell width="15%">Status</TableCell>
                <TableCell width="12%">Notes</TableCell>
                <TableCell width="13%">Created Date</TableCell>
                <TableCell width="15%" align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <Loader colSpan={6} />
              ) : leads?.length > 0 ? (
                leads.map((lead) => (
                  <TableRow key={lead.id} className="custom-table-row">
                    {/* Lead Details */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '8px',
                            backgroundColor: '#eff6ff',
                            color: '#002147',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                          }}
                        >
                          {lead.name.charAt(0).toUpperCase()}
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              color: '#002147',
                              cursor: 'pointer',
                              '&:hover': { color: '#00509d', textDecoration: 'underline' },
                            }}
                            onClick={() => navigate(`/leads/${lead.id}`)}
                          >
                            {lead.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            Source: {lead.source || 'Direct Inbound'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Contact Info */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" sx={{ color: '#1e293b' }}>
                          {lead.email}
                        </Typography>
                        <Tooltip title="Copy Email">
                          <IconButton
                            size="small"
                            onClick={() => handleCopyText(lead.email, 'Email')}
                            sx={{ p: 0.5, color: '#94a3b8', '&:hover': { color: '#002147' } }}
                          >
                            <CopyIcon sx={{ fontSize: 13 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                        {lead.phone}
                      </Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusChip status={lead.status} />
                    </TableCell>

                    {/* Notes count */}
                    <TableCell>
                      <Chip
                        icon={<NoteIcon sx={{ fontSize: '14px !important', color: '#002147 !important' }} />}
                        label={`${lead.notesCount || 0} notes`}
                        size="small"
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: '#f1f5f9',
                          fontWeight: 600,
                          fontSize: '12px',
                          borderRadius: '6px',
                        }}
                      />
                    </TableCell>

                    {/* Created Date */}
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#475569', fontSize: '13px' }}>
                        {formatDate(lead.createdAt)}
                      </Typography>
                    </TableCell>

                    {/* Actions matching Demo */}
                    <TableCell align="right">
                      <Box className="admin-table-data-btn-flex">
                        <Tooltip title="View Details & Notes" arrow placement="bottom">
                          <Button
                            className="admin-table-data-btn admin-table-view-btn"
                            onClick={() => navigate(`/leads/${lead.id}`)}
                          >
                            <img src={Svg.yellowEye} className="admin-icon" alt="View" />
                          </Button>
                        </Tooltip>

                        <Tooltip title="Edit Lead" arrow placement="bottom">
                          <Button
                            className="admin-table-data-btn admin-table-edit-btn"
                            onClick={() => handleOpenEditModal(lead)}
                          >
                            <img src={Svg.editIcon} className="admin-icon" alt="Edit" />
                          </Button>
                        </Tooltip>

                        <Tooltip title="Delete Lead" arrow placement="bottom">
                          <Button
                            className="admin-table-data-btn admin-table-delete-btn"
                            onClick={() => handleOpenDelete(lead)}
                          >
                            <img src={Svg.trash} className="admin-icon" alt="Delete" />
                          </Button>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <DataNotFound />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modern Custom Pagination */}
        {total > 0 && (
          <Pagination
            page={currentPage}
            rowsPerPage={pageSize}
            setPage={setCurrentPage}
            setRowsPerPage={setPageSize}
            count={total}
            itemName="leads"
          />
        )}
      </Box>

      {/* Add / Edit Lead Modal */}
      <AddEditLeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveLead}
        initialData={editingLead}
        loading={actionLoading}
      />

      {/* Demo Exact PopupModal for Delete Confirmation */}
      <PopupModal
        type="delete"
        buttonText="Delete"
        module="this lead"
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        handleFunction={handleConfirmDelete}
        buttonStatusSpinner={actionLoading}
      />
    </Box>
  );
};

export default LeadsList;
