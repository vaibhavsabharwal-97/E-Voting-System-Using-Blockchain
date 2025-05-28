import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  CircularProgress,
  Fade,
  Chip,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Styled card with modern design
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
  },
}));

const ElectionVoterStatsChart = ({
  electionStats = [],
  isLoading = false,
  height = 400,
}) => {
  const theme = useTheme();

  // Prepare data for Chart.js
  const chartData = {
    labels: electionStats.map(stat => stat.electionName),
    datasets: [
      {
        label: 'Registered Voters',
        data: electionStats.map(stat => stat.registeredVoters),
        backgroundColor: `${theme.palette.primary.main}CC`,
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Voters Who Cast Votes',
        data: electionStats.map(stat => stat.votersWhoCast),
        backgroundColor: `${theme.palette.success.main}CC`,
        borderColor: theme.palette.success.main,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            family: theme.typography.fontFamily,
          },
          color: theme.palette.text.primary,
        },
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          afterLabel: function(context) {
            const electionStat = electionStats[context.dataIndex];
            if (context.datasetIndex === 1) {
              return `Turnout: ${electionStat.turnoutPercentage}%`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11,
            family: theme.typography.fontFamily,
          },
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
          lineWidth: 1,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11,
            family: theme.typography.fontFamily,
          },
        },
      },
    },
  };

  // Calculate summary statistics
  const totalRegistered = electionStats.reduce((sum, stat) => sum + stat.registeredVoters, 0);
  const totalVoted = electionStats.reduce((sum, stat) => sum + stat.votersWhoCast, 0);
  const averageTurnout = electionStats.length > 0 
    ? (electionStats.reduce((sum, stat) => sum + parseFloat(stat.turnoutPercentage), 0) / electionStats.length).toFixed(1)
    : 0;

  const renderChart = () => {
    if (isLoading) {
      return (
        <Box
          sx={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      );
    }

    if (electionStats.length === 0) {
      return (
        <Box
          sx={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette.text.secondary,
          }}
        >
          <Typography variant="body1">No election data available</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ height, p: 2 }}>
        <Bar data={chartData} options={options} />
      </Box>
    );
  };

  return (
    <StyledCard>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 1 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Election Voter Statistics
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Comparison of registered voters vs actual voters who cast votes (blockchain data)
          </Typography>
          
          {/* Summary Statistics */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Chip
                  icon={<PeopleIcon />}
                  label={`${totalRegistered} Registered`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Chip
                  icon={<HowToVoteIcon />}
                  label={`${totalVoted} Voted`}
                  color="success"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Chip
                  icon={<TrendingUpIcon />}
                  label={`${averageTurnout}% Avg Turnout`}
                  color="info"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        <Fade in={true} timeout={800}>
          <Box>{renderChart()}</Box>
        </Fade>
      </CardContent>
    </StyledCard>
  );
};

export default ElectionVoterStatsChart; 