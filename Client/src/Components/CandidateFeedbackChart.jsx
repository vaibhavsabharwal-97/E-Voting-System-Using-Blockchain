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
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

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
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, rgba(50,50,50,0.9) 0%, rgba(40,40,40,0.9) 100%)'
    : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 10px 30px rgba(0,0,0,0.3)'
    : '0 10px 30px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 15px 35px rgba(0,0,0,0.4)'
      : '0 15px 35px rgba(0,0,0,0.15)',
  },
}));

const StatBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  background: theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.05)'
    : 'rgba(0,0,0,0.03)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
}));

const CandidateFeedbackChart = ({
  candidates = [],
  isLoading = false,
  height = 400,
}) => {
  const theme = useTheme();

  // Prepare data for Chart.js
  const chartData = {
    labels: candidates.map(candidate => `${candidate.firstName} ${candidate.lastName}`),
    datasets: [
      {
        label: 'Likes',
        data: candidates.map(candidate => candidate.likes || 0),
        backgroundColor: `${theme.palette.success.main}CC`,
        borderColor: theme.palette.success.main,
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 20,
      },
      {
        label: 'Dislikes',
        data: candidates.map(candidate => candidate.dislikes || 0),
        backgroundColor: `${theme.palette.error.main}CC`,
        borderColor: theme.palette.error.main,
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  // Chart options
  const options = {
    indexAxis: 'y', // This makes the bars horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            family: theme.typography.fontFamily,
            weight: '600',
          },
          color: theme.palette.text.primary,
        },
      },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(0,0,0,0.9)'
          : 'rgba(255,255,255,0.9)',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        boxPadding: 6,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.x;
            return ` ${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
          lineWidth: 0.5,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11,
            family: theme.typography.fontFamily,
            weight: '500',
          },
          padding: 8,
        },
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.primary,
          font: {
            size: 12,
            family: theme.typography.fontFamily,
            weight: '500',
          },
          padding: 12,
          callback: function(value) {
            const label = this.getLabelForValue(value);
            if (label.length > 25) {
              return label.substring(0, 22) + '...';
            }
            return label;
          }
        },
      },
    },
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <Box
          sx={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <CircularProgress 
            size={60} 
            thickness={4} 
            sx={{
              color: theme.palette.primary.main,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Loading feedback data...
          </Typography>
        </Box>
      );
    }

    if (candidates.length === 0) {
      return (
        <Box
          sx={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            color: theme.palette.text.secondary,
          }}
        >
          <Typography variant="h6">No Data Available</Typography>
          <Typography variant="body2">
            No candidate feedback data has been recorded yet.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ height, p: 2 }}>
        <Bar data={chartData} options={options} />
      </Box>
    );
  };

  // Calculate total likes and dislikes
  const totalLikes = candidates.reduce((sum, candidate) => sum + (candidate.likes || 0), 0);
  const totalDislikes = candidates.reduce((sum, candidate) => sum + (candidate.dislikes || 0), 0);

  return (
    <StyledCard>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Typography 
            variant="h6" 
            fontWeight="700" 
            sx={{ 
              mb: 1,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)'
                : 'linear-gradient(45deg, #2c3e50 30%, #34495e 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Candidate Feedback Analysis
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              opacity: 0.8,
            }}
          >
            Real-time comparison of likes and dislikes received by each candidate
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 3,
            flexWrap: 'wrap'
          }}>
            <StatBox>
              <ThumbUpIcon sx={{ color: theme.palette.success.main }} />
              <Box>
                <Typography variant="h6" color="success.main" fontWeight="600">
                  {totalLikes}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Likes
                </Typography>
              </Box>
            </StatBox>
            
            <StatBox>
              <ThumbDownIcon sx={{ color: theme.palette.error.main }} />
              <Box>
                <Typography variant="h6" color="error.main" fontWeight="600">
                  {totalDislikes}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Dislikes
                </Typography>
              </Box>
            </StatBox>
          </Box>
        </Box>
        
        <Divider sx={{ 
          opacity: 0.5,
          my: 1,
          borderColor: theme.palette.mode === 'dark' 
            ? 'rgba(255,255,255,0.1)' 
            : 'rgba(0,0,0,0.1)',
        }} />
        
        <Fade in={true} timeout={800}>
          <Box>{renderChart()}</Box>
        </Fade>
      </CardContent>
    </StyledCard>
  );
};

export default CandidateFeedbackChart; 