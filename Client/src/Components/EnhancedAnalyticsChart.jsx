import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  CircularProgress,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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

const EnhancedAnalyticsChart = ({
  title,
  description,
  data = [],
  type = 'bar', // 'bar' or 'pie'
  isLoading = false,
  height = 400,
  colors = [],
}) => {
  const theme = useTheme();

  // Default color palette
  const defaultColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#EC4899', // Pink
  ];

  const chartColors = colors.length > 0 ? colors : defaultColors;

  // Prepare data for Chart.js
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: title,
        data: data.map(item => item.value),
        backgroundColor: chartColors.map(color => `${color}CC`), // Add transparency
        borderColor: chartColors,
        borderWidth: 2,
        borderRadius: type === 'bar' ? 8 : 0,
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
        position: type === 'pie' ? 'bottom' : 'top',
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
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
    scales: type === 'bar' ? {
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
    } : {},
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
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      );
    }

    if (data.length === 0) {
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
          <Typography variant="body1">No data available</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ height, p: 2 }}>
        {type === 'pie' ? (
          <Pie data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </Box>
    );
  };

  return (
    <StyledCard>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 1 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {description}
            </Typography>
          )}
        </Box>
        <Fade in={true} timeout={800}>
          <Box>{renderChart()}</Box>
        </Fade>
      </CardContent>
    </StyledCard>
  );
};

export default EnhancedAnalyticsChart; 