import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  ButtonGroup, 
  Button, 
  useTheme,
  CircularProgress,
  Divider,
  Tooltip,
  IconButton,
  Fade,
  Zoom
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Animated components using framer-motion
const MotionBox = styled(motion.div)({
  width: '100%',
  height: '100%',
});

// Styled chart container
const ChartContainer = styled(Box)(({ theme }) => ({
  height: 300,
  marginTop: theme.spacing(2),
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

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

// Styled header for chart cards
const ChartHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

// Styled button group for chart type selection
const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  '& .MuiButton-root': {
    minWidth: '40px',
    padding: theme.spacing(0.5),
    borderColor: theme.palette.divider,
  },
  '& .MuiButton-root.active': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  }
}));

// Bar chart component
const BarChart = ({ data, colors }) => {
  const theme = useTheme();
  
  // Find the maximum value for scaling
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'flex-end', 
      justifyContent: 'space-around',
      height: '100%', 
      width: '100%', 
      px: 2,
      pt: 2
    }}>
      {data.map((item, index) => {
        const height = `${(item.value / maxValue) * 80}%`;
        return (
          <Tooltip 
            key={index} 
            title={`${item.label}: ${item.value}`}
            placement="top"
            arrow
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ duration: 0.8, delay: index * 0.1, type: "spring", stiffness: 100 }}
                style={{
                  width: '70%',
                  minWidth: 20,
                  maxWidth: 80,
                  background: `linear-gradient(to top, ${colors?.[index] || theme.palette.primary.main}, ${alpha(colors?.[index] || theme.palette.primary.main, 0.7)})`,
                  borderRadius: '8px 8px 0 0',
                  marginBottom: 8,
                  position: 'relative',
                  boxShadow: `0 4px 12px ${alpha(colors?.[index] || theme.palette.primary.main, 0.3)}`,
                }}
              >
                <Box sx={{ 
                  position: 'absolute', 
                  top: -24, 
                  left: 0, 
                  right: 0, 
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  color: theme.palette.text.primary,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}>
                  {item.value}
                </Box>
              </motion.div>
              <Typography variant="caption" sx={{ 
                fontSize: '0.75rem', 
                textAlign: 'center', 
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: 500,
                color: theme.palette.text.secondary
              }}>
                {item.label}
              </Typography>
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
};

// Pie chart component
const PieChart = ({ data, colors }) => {
  const theme = useTheme();
  
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate segments
  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const angle = total > 0 ? (item.value / total) * 360 : 0;
    const segment = {
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      percentage,
      color: colors?.[index] || theme.palette.primary.main,
      label: item.label,
      value: item.value
    };
    currentAngle += angle;
    return segment;
  });

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Box sx={{ 
        position: 'relative', 
        width: 200, 
        height: 200,
      }}>
        {segments.map((segment, index) => (
          <Tooltip
            key={index}
            title={`${segment.label}: ${segment.value} (${segment.percentage.toFixed(1)}%)`}
            placement="top"
            arrow
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                clipPath: `path('M 100 100 L 100 0 A 100 100 0 ${segment.endAngle - segment.startAngle > 180 ? 1 : 0} 1 ${100 + 100 * Math.sin(segment.endAngle * Math.PI / 180)} ${100 - 100 * Math.cos(segment.endAngle * Math.PI / 180)} L 100 100')`,
                transform: `rotate(${segment.startAngle}deg)`,
                background: `linear-gradient(135deg, ${segment.color}, ${alpha(segment.color, 0.7)})`,
                boxShadow: `0 0 15px ${alpha(segment.color, 0.5)}`,
                '&:hover': {
                  filter: 'brightness(1.1)',
                  transform: `rotate(${segment.startAngle}deg) scale(1.03)`,
                },
                transition: 'all 0.3s ease'
              }}
            />
          </Tooltip>
        ))}
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
          border: `4px solid ${theme.palette.background.default}`,
        }}>
          <Typography variant="h6" fontWeight="bold">
            {total}
          </Typography>
        </Box>
      </Box>
      
      {/* Legend */}
      <Box sx={{ 
        position: 'absolute', 
        right: 0, 
        top: '50%',
        transform: 'translateY(-50%)',
        maxWidth: 120,
        display: {xs: 'none', sm: 'block'}
      }}>
        {segments.map((segment, index) => (
          <Box key={index} sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 1,
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'translateX(3px)'
            }
          }}>
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                background: `linear-gradient(135deg, ${segment.color}, ${alpha(segment.color, 0.7)})`,
                borderRadius: '3px',
                mr: 1,
                boxShadow: `0 2px 4px ${alpha(segment.color, 0.3)}`,
              }} 
            />
            <Typography variant="caption" sx={{ 
              fontSize: '0.7rem',
              fontWeight: 500
            }}>
              {segment.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Line chart component
const LineChart = ({ data, colors }) => {
  const theme = useTheme();
  
  // Find min and max for scaling
  const allValues = data.reduce((acc, series) => [...acc, ...series.data.map(item => item.value)], []);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue;
  
  // Get all x labels
  const allLabels = [...new Set(
    data.reduce((acc, series) => [...acc, ...series.data.map(item => item.label)], [])
  )].sort();
  
  // Calculate paths
  const paths = data.map((series, seriesIndex) => {
    // Sort data points by label
    const sortedData = [...series.data].sort((a, b) => 
      allLabels.indexOf(a.label) - allLabels.indexOf(b.label)
    );
    
    // Create path
    let path = '';
    
    // Map points to SVG coordinates
    const points = sortedData.map((point, index) => {
      const x = (index / (sortedData.length - 1 || 1)) * 100;
      const y = 100 - ((point.value - minValue) / (range || 1)) * 80;
      return { x, y, ...point };
    });
    
    // Create SVG path
    if (points.length > 0) {
      path = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x} ${points[i].y}`;
      }
    }
    
    return {
      path,
      points,
      name: series.name,
      color: colors?.[seriesIndex] || theme.palette.primary.main
    };
  });
  
  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      p: 2
    }}>
      {/* X-axis labels */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        display: 'flex', 
        justifyContent: 'space-between',
        px: 2
      }}>
        {allLabels.filter((_, i) => i % Math.ceil(allLabels.length / 6) === 0).map((label, index) => (
          <Typography 
            key={index} 
            variant="caption" 
            sx={{ 
              fontSize: '0.7rem', 
              color: theme.palette.text.secondary,
              fontWeight: 500
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>
      
      {/* Y-axis labels */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        bottom: 20, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        width: 20,
        alignItems: 'flex-start'
      }}>
        {[0, 1, 2, 3, 4].map((_, index) => {
          const value = maxValue - (index * (range / 4));
          return (
            <Typography 
              key={index} 
              variant="caption" 
              sx={{ 
                fontSize: '0.7rem', 
                color: theme.palette.text.secondary,
                fontWeight: 500
              }}
            >
              {Math.round(value)}
            </Typography>
          );
        })}
      </Box>
      
      {/* Grid lines */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 20, 
        right: 0, 
        bottom: 20, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between'
      }}>
        {[0, 1, 2, 3, 4].map((_, index) => (
          <Box 
            key={index} 
            sx={{ 
              width: '100%', 
              height: 1, 
              backgroundColor: theme.palette.divider,
              opacity: 0.5
            }} 
          />
        ))}
      </Box>
      
      {/* Chart SVG */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 20, 
        right: 0, 
        bottom: 20, 
        overflow: 'visible'
      }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Paths */}
          {paths.map((pathData, index) => (
            <g key={index}>
              {/* Area under the line */}
              <motion.path
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 0.2, pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                d={`${pathData.path} L ${pathData.points[pathData.points.length - 1]?.x || 0} 100 L ${pathData.points[0]?.x || 0} 100 Z`}
                fill={pathData.color}
                opacity="0.2"
              />
              
              {/* Line */}
              <motion.path
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 1.5 }}
                d={pathData.path}
                fill="none"
                stroke={pathData.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Points */}
              {pathData.points.map((point, pointIndex) => (
                <motion.circle
                  key={pointIndex}
                  initial={{ opacity: 0, r: 0 }}
                  animate={{ opacity: 1, r: 3 }}
                  transition={{ duration: 0.5, delay: 0.5 + pointIndex * 0.1 }}
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill={theme.palette.background.paper}
                  stroke={pathData.color}
                  strokeWidth="2"
                />
              ))}
            </g>
          ))}
        </svg>
      </Box>
      
      {/* Legend */}
      <Box sx={{ 
        position: 'absolute', 
        top: 10, 
        right: 10, 
        display: 'flex', 
        flexDirection: 'column',
        gap: 1
      }}>
        {paths.map((pathData, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                width: 12, 
                height: 4, 
                backgroundColor: pathData.color,
                borderRadius: 1
              }} 
            />
            <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
              {pathData.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const AnalyticsChart = ({ 
  title, 
  description,
  data = [],
  seriesData = [],
  colors,
  defaultType = 'bar',
  isLoading = false,
  showFullscreen = true,
  height = 400,
}) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState(defaultType);
  
  // Handle chart type change
  const handleChartTypeChange = (type) => {
    setChartType(type);
  };
  
  // Render the appropriate chart based on the selected type
  const renderChart = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress size={40} />
        </Box>
      );
    }
    
    if (chartType === 'pie' && data.length > 0) {
      return <PieChart data={data} colors={colors} />;
    }
    
    if (chartType === 'line' && seriesData.length > 0) {
      return <LineChart data={seriesData} colors={colors} />;
    }
    
    // Default to bar chart
    if (data.length > 0) {
      return <BarChart data={data} colors={colors} />;
    }
    
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  };
  
  return (
    <StyledCard>
      <ChartHeader>
        <Box>
          <Typography variant="h6" fontWeight="600">
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1, fontSize: '0.75rem' }}>
              {description}
            </Typography>
            <Tooltip title={description} arrow placement="top">
              <InfoIcon fontSize="small" sx={{ color: theme.palette.text.disabled, fontSize: '1rem' }} />
            </Tooltip>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StyledButtonGroup size="small" aria-label="chart type">
            <Button 
              className={chartType === 'bar' ? 'active' : ''} 
              onClick={() => handleChartTypeChange('bar')}
              disabled={data.length === 0}
            >
              <Tooltip title="Bar Chart" arrow>
                <BarChartIcon fontSize="small" />
              </Tooltip>
            </Button>
            <Button 
              className={chartType === 'pie' ? 'active' : ''} 
              onClick={() => handleChartTypeChange('pie')}
              disabled={data.length === 0}
            >
              <Tooltip title="Pie Chart" arrow>
                <PieChartIcon fontSize="small" />
              </Tooltip>
            </Button>
            <Button 
              className={chartType === 'line' ? 'active' : ''} 
              onClick={() => handleChartTypeChange('line')}
              disabled={seriesData.length === 0}
            >
              <Tooltip title="Line Chart" arrow>
                <TimelineIcon fontSize="small" />
              </Tooltip>
            </Button>
          </StyledButtonGroup>
          
          {showFullscreen && (
            <Tooltip title="Fullscreen" arrow>
              <IconButton size="small">
                <FullscreenIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </ChartHeader>
      
      <CardContent sx={{ 
        height: height, 
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Fade in={!isLoading} timeout={500}>
          <Box sx={{ width: '100%', height: '100%' }}>
            {renderChart()}
          </Box>
        </Fade>
      </CardContent>
    </StyledCard>
  );
};

export default AnalyticsChart; 