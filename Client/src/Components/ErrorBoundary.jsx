import React from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ 
      error: error,
      errorInfo: errorInfo
    });
    
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error}
        resetErrorBoundary={() => {
          this.setState({ 
            hasError: false,
            error: null,
            errorInfo: null
          });
        }}
      />;
    }

    return this.props.children; 
  }
}

// A separate component for the error UI
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the previous location from the URL if available
  const getReturnPath = () => {
    // Check if we came from an admin page
    if (location.pathname.includes('/admin')) {
      return '/admin/dashboard';
    }
    return '/';
  };

  // Determine if this was likely caused by an election save operation
  const isElectionSaveError = () => {
    return location.pathname.includes('/election') && 
           (location.pathname.includes('/add') || location.pathname.includes('/edit'));
  };

  // Show a more specific message for election form errors
  const getErrorMessage = () => {
    if (isElectionSaveError()) {
      return "We couldn't save your election. This might be due to a temporary issue with our blockchain connection or server.";
    }
    
    return "The page you tried to access encountered an error. This might be because it was removed, had its name changed, or is temporarily unavailable.";
  };

  // Get the appropriate action text
  const getActionText = () => {
    if (isElectionSaveError()) {
      return "Back to Elections";
    }
    return "Back to Home";
  };
  
  const handleReturn = () => {
    resetErrorBoundary();
    if (isElectionSaveError()) {
      navigate('/admin/elections');
    } else {
      navigate(getReturnPath());
    }
  };

  // Auto-redirect after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleReturn();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            sx={{ 
              p: 5, 
              borderRadius: 4,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background animated pattern */}
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, #4dabf5, #7c4dff, #ff9800, #4dabf5)',
              backgroundSize: '400% 400%',
              animation: 'gradient 3s ease infinite',
              '@keyframes gradient': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' }
              }
            }} />
            
            <motion.div
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <ErrorOutlineIcon 
                sx={{ 
                  fontSize: 100, 
                  color: '#ff9800',
                  mb: 2
                }} 
              />
            </motion.div>
            
            <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
              404
            </Typography>
            
            <Typography variant="h4" color="textSecondary" sx={{ mb: 2 }}>
              Page Not Found
            </Typography>
            
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              {getErrorMessage()}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                <HourglassEmptyIcon sx={{ color: 'text.secondary', mr: 1 }} />
              </motion.div>
              <Typography variant="body2" color="text.secondary">
                Redirecting you in a few seconds...
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={handleReturn}
              sx={{ px: 4, py: 1.5 }}
            >
              {getActionText()}
            </Button>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default ErrorBoundary; 