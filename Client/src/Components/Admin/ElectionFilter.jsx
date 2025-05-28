import React from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Button, 
  useTheme, 
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TuneIcon from '@mui/icons-material/Tune';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import EditIcon from '@mui/icons-material/Edit';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { motion } from 'framer-motion';

const ElectionFilter = ({ currentFilter, onFilterChange, onRefresh, isLoading, stats }) => {
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    onFilterChange(newValue);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Tabs 
          value={currentFilter} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ 
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 'unset',
              px: 2
            }
          }}
        >
          <Tab 
            label={
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <AllInclusiveIcon sx={{ mr: 1, fontSize: 18 }} />
                All Elections
              </motion.div>
            } 
            value="all" 
          />
          <Tab 
            label={
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <EditIcon sx={{ mr: 1, fontSize: 18 }} />
                Initialization
              </motion.div>
            } 
            value="init" 
          />
          <Tab 
            label={
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <HowToVoteIcon sx={{ mr: 1, fontSize: 18 }} />
                Voting Active
              </motion.div>
            } 
            value="voting" 
          />
          <Tab 
            label={
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <AssessmentOutlinedIcon sx={{ mr: 1, fontSize: 18 }} />
                Results
              </motion.div>
            } 
            value="result" 
          />
        </Tabs>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}>
        <Tooltip title="Refresh elections">
          <IconButton onClick={onRefresh} disabled={isLoading}>
            <motion.div
              animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
            >
              <RefreshIcon fontSize="small" />
            </motion.div>
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ElectionFilter; 