import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  PeopleAlt as LeadsIcon,
  CheckCircleOutline as QualifiedIcon,
  CancelOutlined as LostIcon,
  ArrowForward as ArrowForwardIcon,
  PieChartOutline as ChartIcon,
  BarChart as BarIcon,
  PhoneInTalk as ContactedIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/Store';
import { fetchLeads, fetchLeadStats, resetLeadList } from '../redux/slices/leadSlice';
import StatusChip from '../components/common/StatusChip';
import Loader from '../components/common/Loader';
import PageLoader from '../components/common/PageLoader';
import { formatDate } from '../utils/formatters';

// Smooth Count-Up Animated Number Component
const AnimatedNumber: React.FC<{ value: number; duration?: number }> = ({
  value,
  duration = 1000,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeOut * value));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <>{displayValue.toLocaleString()}</>;
};

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { leads, stats, loading } = useSelector((state: RootState) => state.lead);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  const [isFilled, setIsFilled] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const loadDashboardData = async () => {
    setIsFilled(false);
    setPageLoading(true);
    await Promise.all([
      dispatch(fetchLeadStats()).unwrap().catch(() => {}),
      dispatch(fetchLeads({ limit: 5 })).unwrap().catch(() => {}),
    ]);
    setPageLoading(false);
    setTimeout(() => {
      setIsFilled(true);
    }, 100);
  };

  useEffect(() => {
    loadDashboardData();
  }, [dispatch]);

  if (pageLoading) {
    return <PageLoader />;
  }

  const totalCount = stats?.total || 0;
  const newCount = stats?.new || 0;
  const contactedCount = stats?.contacted || 0;
  const qualifiedCount = stats?.qualified || 0;
  const lostCount = stats?.lost || 0;

  // Modern curated palette with gradients
  const cards = [
    {
      title: 'Total Inbound Leads',
      value: totalCount,
      icon: <LeadsIcon />,
      color: '#002147',
      bg: '#eff6ff',
    },
    {
      title: 'New Leads',
      value: newCount,
      icon: <TrendingUpIcon />,
      color: '#2563eb',
      bg: '#eff6ff',
    },
    {
      title: 'Contacted Leads',
      value: contactedCount,
      icon: <ContactedIcon />,
      color: '#d97706',
      bg: '#fffbeb',
    },
    {
      title: 'Qualified Prospects',
      value: qualifiedCount,
      icon: <QualifiedIcon />,
      color: '#059669',
      bg: '#ecfdf5',
    },
    {
      title: 'Lost Leads',
      value: lostCount,
      icon: <LostIcon />,
      color: '#e11d48',
      bg: '#fff1f2',
    },
  ];

  // Modern Chart Items Definition
  const chartData = [
    {
      label: 'New',
      count: newCount,
      color: '#2563eb',
      startColor: '#60a5fa',
      endColor: '#1d4ed8',
      lightBg: '#eff6ff',
      badgeBg: '#dbeafe',
      badgeColor: '#1e40af',
    },
    {
      label: 'Contacted',
      count: contactedCount,
      color: '#d97706',
      startColor: '#fbbf24',
      endColor: '#b45309',
      lightBg: '#fffbeb',
      badgeBg: '#fef3c7',
      badgeColor: '#92400e',
    },
    {
      label: 'Qualified',
      count: qualifiedCount,
      color: '#059669',
      startColor: '#34d399',
      endColor: '#047857',
      lightBg: '#ecfdf5',
      badgeBg: '#d1fae5',
      badgeColor: '#065f46',
    },
    {
      label: 'Lost',
      count: lostCount,
      color: '#e11d48',
      startColor: '#fb7185',
      endColor: '#be123c',
      lightBg: '#fff1f2',
      badgeBg: '#ffe4e6',
      badgeColor: '#9f1239',
    },
  ];

  // SVG Donut Calculations
  const radius = 72;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const donutSlices = chartData.map((item, idx) => {
    const percent = totalCount > 0 ? (item.count / totalCount) * 100 : 0;
    // When filling is true, draw full segment; when false, draw 0
    const strokeDasharray = isFilled
      ? `${(percent / 100) * circumference} ${circumference}`
      : `0 ${circumference}`;
    const strokeDashoffset = isFilled ? -((accumulatedPercent / 100) * circumference) : 0;
    accumulatedPercent += percent;

    return {
      ...item,
      id: `grad-${idx}`,
      percent: Math.round(percent),
      exactPercent: percent.toFixed(1),
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <Box className="page-container">
      {/* Header with Title and Refresh Button */}
      <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#002147', letterSpacing: '-0.3px' }}>
            Executive Dashboard & Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Real-time CRM lead tracking, pipeline conversion metrics, and performance overview
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          onClick={loadDashboardData}
          startIcon={<RefreshIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderColor: '#e2e8f0',
            color: '#002147',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            '&:hover': {
              borderColor: '#00509d',
              backgroundColor: '#f8fafc',
            },
          }}
        >
          Refresh Live Data
        </Button>
      </Box>

      {/* Top 5 KPI Metric Cards with Counter */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {cards.map((card, idx) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper
              elevation={0}
              className="portal-card"
              sx={{
                p: 2.5,
                mb: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 10px rgba(0, 33, 71, 0.03)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                animation: `fadeInUp 0.5s ease-out ${idx * 0.08}s both`,
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 24px rgba(0, 33, 71, 0.08)',
                  borderColor: '#cbd5e1',
                },
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '12px' }}>
                  {card.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: card.color, mt: 0.5, fontSize: '24px' }}>
                  <AnimatedNumber value={card.value} />
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: '12px',
                  background: card.bg,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: `1px solid rgba(0,0,0,0.04)`,
                }}
              >
                {card.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Visual Analytics Graphs Section */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        {/* 1. High-End Progressive Animated Donut Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            className="portal-card"
            sx={{
              p: 3.5,
              height: '100%',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 20px rgba(0, 33, 71, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'fadeInUp 0.6s ease-out both',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #002147 0%, #00509d 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  <ChartIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#002147', fontSize: '16px' }}>
                    Pipeline Status Breakdown
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Progressive distribution of all captured leads
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  backgroundColor: '#f1f5f9',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography variant="caption" sx={{ color: '#002147', fontWeight: 700, fontSize: '11px' }}>
                  {totalCount.toLocaleString()} Total
                </Typography>
              </Box>
            </Box>

            {/* Donut Container & Legend */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: 3,
                flex: 1,
                py: 1,
              }}
            >
              {/* Smooth Animated Donut SVG */}
              <Box
                sx={{
                  position: 'relative',
                  width: 184,
                  height: 184,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="184"
                  height="184"
                  viewBox="0 0 184 184"
                  style={{
                    transform: 'rotate(-90deg)',
                    filter: 'drop-shadow(0 6px 12px rgba(0, 33, 71, 0.06))',
                  }}
                >
                  <defs>
                    {donutSlices.map((slice) => (
                      <linearGradient key={slice.id} id={slice.id} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={slice.startColor} />
                        <stop offset="100%" stopColor={slice.endColor} />
                      </linearGradient>
                    ))}
                  </defs>

                  {/* Base Track */}
                  <circle
                    cx="92"
                    cy="92"
                    r={radius}
                    fill="none"
                    stroke="#f8fafc"
                    strokeWidth={strokeWidth}
                  />

                  {/* Animated Slices with Progressive Draw */}
                  {totalCount > 0 &&
                    donutSlices.map((slice) => (
                      <circle
                        key={slice.label}
                        cx="92"
                        cy="92"
                        r={radius}
                        fill="none"
                        stroke={`url(#${slice.id})`}
                        strokeWidth={hoveredSlice === slice.label ? strokeWidth + 4 : strokeWidth}
                        strokeDasharray={slice.strokeDasharray}
                        strokeDashoffset={slice.strokeDashoffset}
                        strokeLinecap="round"
                        style={{
                          transition:
                            'stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1), stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1), stroke-width 0.2s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={() => setHoveredSlice(slice.label)}
                        onMouseLeave={() => setHoveredSlice(null)}
                      />
                    ))}
                </svg>

                {/* Center Badge with Animated Counter */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      color: hoveredSlice
                        ? donutSlices.find((s) => s.label === hoveredSlice)?.color
                        : '#002147',
                      lineHeight: 1,
                      fontSize: '26px',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {hoveredSlice ? (
                      donutSlices.find((s) => s.label === hoveredSlice)?.count.toLocaleString()
                    ) : (
                      <AnimatedNumber value={totalCount} />
                    )}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontSize: '11px',
                      fontWeight: 600,
                      mt: 0.5,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {hoveredSlice ? `${hoveredSlice} Leads` : 'Total Pipeline'}
                  </Typography>
                </Box>
              </Box>

              {/* Status Breakdown Legend List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, minWidth: 200, flex: 1 }}>
                {donutSlices.map((item, idx) => (
                  <Box
                    key={item.label}
                    onMouseEnter={() => setHoveredSlice(item.label)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 1.5,
                      py: 1,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: hoveredSlice === item.label ? item.color : '#f1f5f9',
                      backgroundColor: hoveredSlice === item.label ? item.lightBg : '#fafafa',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: hoveredSlice === item.label ? 'translateX(4px)' : 'none',
                      animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '4px',
                          background: `linear-gradient(135deg, ${item.startColor}, ${item.endColor})`,
                          boxShadow: `0 2px 6px ${item.color}40`,
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>
                        {item.label}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#002147', fontSize: '13px' }}>
                        <AnimatedNumber value={item.count} />
                      </Typography>
                      <Box
                        sx={{
                          px: 0.8,
                          py: 0.2,
                          borderRadius: '6px',
                          backgroundColor: item.badgeBg,
                          color: item.badgeColor,
                          fontWeight: 700,
                          fontSize: '11px',
                        }}
                      >
                        {item.percent}%
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* 2. Progressive Smooth Filling Stage Volume Bars */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            className="portal-card"
            sx={{
              p: 3.5,
              height: '100%',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 20px rgba(0, 33, 71, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'fadeInUp 0.7s ease-out both',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #00509d 0%, #f1b000 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  <BarIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#002147', fontSize: '16px' }}>
                    Pipeline Stage Volume
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Comparative stage volume and conversion metrics
                  </Typography>
                </Box>
              </Box>

              <Button
                size="small"
                onClick={() => navigate('/leads')}
                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                sx={{
                  color: '#00509d',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '12px',
                  '&:hover': { backgroundColor: '#f0f7ff' },
                }}
              >
                View Leads Table
              </Button>
            </Box>

            {/* Progressive Stage Bars */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2, flex: 1, justifyContent: 'center' }}>
              {chartData.map((stage, idx) => {
                const percentage = totalCount > 0 ? (stage.count / totalCount) * 100 : 0;
                return (
                  <Box
                    key={stage.label}
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #eef2f6',
                      transition: 'all 0.25s ease',
                      animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
                      '&:hover': {
                        backgroundColor: stage.lightBg,
                        borderColor: stage.badgeBg,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>
                          {stage.label} Leads
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: stage.color, fontSize: '13px' }}>
                          <AnimatedNumber value={stage.count} />
                        </Typography>
                        <Box
                          sx={{
                            px: 0.8,
                            py: 0.2,
                            borderRadius: '6px',
                            backgroundColor: stage.badgeBg,
                            color: stage.badgeColor,
                            fontWeight: 700,
                            fontSize: '11px',
                          }}
                        >
                          {percentage.toFixed(1)}%
                        </Box>
                      </Box>
                    </Box>

                    {/* Progressive Animated Gradient Progress Bar */}
                    <Box
                      sx={{
                        width: '100%',
                        height: 10,
                        borderRadius: '6px',
                        backgroundColor: '#e2e8f0',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: isFilled ? `${percentage}%` : '0%',
                          height: '100%',
                          borderRadius: '6px',
                          background: `linear-gradient(90deg, ${stage.startColor} 0%, ${stage.endColor} 100%)`,
                          boxShadow: `0 2px 6px ${stage.color}50`,
                          transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.12}s`,
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Leads Table */}
      <Paper
        elevation={0}
        className="portal-card"
        sx={{
          p: 0,
          overflow: 'hidden',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 33, 71, 0.04)',
        }}
      >
        <Box
          sx={{
            p: 2.5,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#002147', fontSize: '16px' }}>
              Recent Inbound Leads
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Latest leads captured into the system
            </Typography>
          </Box>
          <Button
            onClick={() => navigate('/leads')}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              color: '#00509d',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '13px',
              '&:hover': { backgroundColor: '#f0f7ff' },
            }}
          >
            View All Leads
          </Button>
        </Box>

        <Table className="custom-table-container">
          <TableHead className="custom-table-head">
            <TableRow>
              <TableCell>Lead Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Loader colSpan={5} />
            ) : leads?.length > 0 ? (
              leads.slice(0, 5).map((lead) => (
                <TableRow
                  key={lead.id}
                  className="custom-table-row"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                >
                  <TableCell sx={{ fontWeight: 700, color: '#002147' }}>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>
                    <StatusChip status={lead.status} />
                  </TableCell>
                  <TableCell sx={{ color: '#64748b', fontSize: '13px' }}>
                    {formatDate(lead.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#64748b' }}>
                  No recent leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Dashboard;
