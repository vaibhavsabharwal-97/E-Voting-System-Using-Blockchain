import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Button,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  HowToVote as HowToVoteIcon,
  AssessmentOutlined as AssessmentIcon,
  CalendarToday as CalendarIcon,
  AutorenewOutlined as PhaseIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { alpha, styled } from '@mui/material/styles';
import axios from 'axios';
import { serverLink } from '../../Data/Variables';

// Styled components
const StatusChip = styled(Chip)(({ theme, phase }) => {
  const getColor = () => {
    switch (phase) {
      case 'init':
        return theme.palette.info.main;
      case 'voting':
        return theme.palette.success.main;
      case 'result':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  return {
    backgroundColor: alpha(getColor(), 0.1),
    color: getColor(),
    fontWeight: 'bold',
    borderRadius: '4px',
    '& .MuiChip-label': {
      padding: '0 8px'
    }
  };
});

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  height: '100%',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
  }
}));

const ElectionTypeHeader = styled(Box)(({ theme }) => ({
  padding: '16px 16px 0 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const ElectionCard = ({ election, onRefresh }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const menuOpen = Boolean(anchorEl);
  
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };
  
  const handleView = (event) => {
    event.stopPropagation();
    navigate(`/admin/elections/${election._id}`);
    handleMenuClose();
  };
  
  const handleEdit = (event) => {
    event.stopPropagation();
    navigate(`/admin/elections/${election._id}/edit`);
    handleMenuClose();
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    setConfirmDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteCancel = (event) => {
    if (event) event.stopPropagation();
    setConfirmDialogOpen(false);
  };

  const handleDeleteConfirm = async (event) => {
    if (event) event.stopPropagation();
    setIsDeleting(true);
    
    try {
      await axios.get(`${serverLink}election/delete/${election._id}`);
      setConfirmDialogOpen(false);
      setAlert({
        open: true,
        message: 'Election deleted successfully',
        severity: 'success'
      });
      
      // Refresh the elections list after a short delay
      setTimeout(() => {
        if (onRefresh) onRefresh();
      }, 1000);
    } catch (error) {
      console.error('Error deleting election:', error);
      setAlert({
        open: true,
        message: 'Failed to delete election. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert({ ...alert, open: false });
  };
  
  // Format date to show only the date part
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get appropriate label for the phase
  const getPhaseLabel = (phase) => {
    switch (phase) {
      case 'init':
        return 'Initialization';
      case 'voting':
        return 'Voting Active';
      case 'result':
        return 'Results Published';
      default:
        return phase;
    }
  };
  
  const getCardAction = () => {
    switch (election.currentPhase) {
      case 'init':
        return (
          <ButtonGroup fullWidth variant="outlined" size="small">
            <Button 
              startIcon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/elections/${election._id}/edit`);
              }}
              sx={{ flexGrow: 1 }}
            >
              Manage Election
            </Button>
          </ButtonGroup>
        );
      case 'voting':
        return (
          <ButtonGroup fullWidth variant="outlined" size="small">
            <Button 
              color="success"
              startIcon={<HowToVoteIcon />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/elections/${election._id}`);
              }}
              sx={{ flexGrow: 1 }}
            >
              View Voting
            </Button>
            <Button
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/elections/${election._id}/edit`);
              }}
              title="Manage Phase"
            >
              <PhaseIcon fontSize="small" />
            </Button>
          </ButtonGroup>
        );
      case 'result':
        return (
          <ButtonGroup fullWidth variant="outlined" size="small">
            <Button 
              color="warning"
              startIcon={<AssessmentIcon />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/result/${election._id}`);
              }}
              sx={{ flexGrow: 1 }}
            >
              See Results
            </Button>
            <Button
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/elections/${election._id}/edit`);
              }}
              title="Manage Phase"
            >
              <PhaseIcon fontSize="small" />
            </Button>
          </ButtonGroup>
        );
      default:
        return null;
    }
  };
  
  return (
    <>
      <StyledCard
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ElectionTypeHeader>
          <StatusChip 
            label={getPhaseLabel(election.currentPhase)}
            phase={election.currentPhase}
            size="small"
          />
          <IconButton
            aria-label="more options"
            aria-controls="election-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
            size="small"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu
            id="election-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleView}>
              <ListItemIcon>
                <VisibilityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <PhaseIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Manage Phase</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Delete Election</ListItemText>
            </MenuItem>
          </Menu>
        </ElectionTypeHeader>
        
        <CardContent sx={{ pt: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="h6" 
            component="h2"
            sx={{ 
              fontWeight: 'bold',
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
              minHeight: '64px'
            }}
            onClick={() => navigate(`/admin/elections/${election._id}`)}
          >
            {election.title || election.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Created: {formatDate(election.createdAt)}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Candidates: {election.candidates?.length || 0}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 'auto' }}>
            <Divider sx={{ mb: 2 }} />
            {getCardAction()}
          </Box>
        </CardContent>
      </StyledCard>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleDeleteCancel}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{ 
          sx: { 
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Delete Election
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the election "{election.title || election.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleDeleteCancel} 
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <DeleteIcon />
            </motion.div> : <DeleteIcon />}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleAlertClose} 
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ElectionCard; 