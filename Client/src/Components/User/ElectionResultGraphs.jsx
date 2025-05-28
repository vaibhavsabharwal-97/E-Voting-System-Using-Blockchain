import React from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  alpha,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ElectionResultGraphs = ({ 
  candidateResults, 
  loading 
}) => {
  const theme = useTheme();

  // Prepare data for vote distribution chart
  const voteDistributionData = {
    labels: candidateResults.map(c => c.username),
    datasets: [{
      label: 'Votes',
      data: candidateResults.map(c => c.votes),
      backgroundColor: [
        alpha(theme.palette.primary.main, 0.6),
        alpha(theme.palette.secondary.main, 0.6),
        alpha(theme.palette.success.main, 0.6),
        alpha(theme.palette.info.main, 0.6),
        alpha(theme.palette.warning.main, 0.6),
      ],
      borderColor: [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.info.main,
        theme.palette.warning.main,
      ],
      borderWidth: 2,
    }]
  };

  const voteDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: theme.palette.text.primary,
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: theme.palette.text.secondary,
        },
        grid: {
          color: alpha(theme.palette.divider, 0.1),
        },
      },
      x: {
        ticks: {
          color: theme.palette.text.secondary,
        },
        grid: {
          color: alpha(theme.palette.divider, 0.1),
        },
      },
    },
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Vote Distribution Chart */}
        <Paper 
          elevation={0}
          sx={{ 
            flex: '1 1 400px',
            p: 3,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Vote Distribution
          </Typography>
          <Box sx={{ height: 300 }}>
            <Bar data={voteDistributionData} options={voteDistributionOptions} />
          </Box>
        </Paper>
      </Box>

      {/* Summary Statistics */}
      <Paper
        elevation={0}
        sx={{ 
          mt: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {candidateResults.reduce((sum, c) => sum + c.votes, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Votes
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ElectionResultGraphs; 