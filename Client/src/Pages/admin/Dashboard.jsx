import React, { useState, useEffect, useCallback } from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  Container, 
  useTheme, 
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link,
  Fade
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import axios from 'axios';
import { serverLink } from '../../Data/Variables';
import { TransactionContext } from '../../context/TransactionContext';
import DashboardCard from '../../Components/DashboardCard';
import EnhancedAnalyticsChart from '../../Components/EnhancedAnalyticsChart';
import ElectionVoterStatsChart from '../../Components/ElectionVoterStatsChart';
import { 
  groupUsersByAge, 
  calculateElectionVoterStats, 
  generateMockVotingData 
} from '../../utils/dashboardUtils';

const Dashboard = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { getAllTransactions } = React.useContext(TransactionContext);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersRes, candidatesRes, electionsRes] = await Promise.all([
        axios.get(serverLink + 'users'),
        axios.get(serverLink + 'candidates'),
        axios.get(serverLink + 'elections'),
      ]);
      
      const userData = usersRes.data;
      const candidateData = candidatesRes.data;
      const electionData = electionsRes.data;
      
      console.log('Fetched Data:', {
        users: userData,
        candidates: candidateData,
        elections: electionData
      });

      setUsers(userData);
      setCandidates(candidateData);
      setElections(electionData);
      
      const trans = await getAllTransactions();
      console.log('Blockchain Transactions:', trans);
      
      // If no transactions are available, generate mock data for testing
      const finalTransactions = trans?.length > 0 ? trans : generateMockVotingData(electionData, userData);
      setTransactions(finalTransactions);

      // Log processed data
      console.log('Age Groups:', groupUsersByAge(userData));
      console.log('Election Stats:', calculateElectionVoterStats(electionData, userData, finalTransactions));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [getAllTransactions]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box sx={{ 
      bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)',
      minHeight: '100vh',
      pb: 6
    }}>
      {/* Dashboard Header */}
      <AppBar position="static" elevation={0} sx={{ 
        bgcolor: theme.palette.background.paper, 
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DashboardIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
            <Typography variant="h5" fontWeight="bold">
              E-Voting Dashboard
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} sx={{ 
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Breadcrumbs */}
      <Container maxWidth="lg" sx={{ mt: 3, mb: 2 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link 
            underline="hover" 
            sx={{ display: 'flex', alignItems: 'center' }} 
            color="inherit" 
            href="/"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Dashboard
          </Typography>
        </Breadcrumbs>
      </Container>

      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Fade in={true} timeout={800}>
            <Grid container spacing={3}>
              {/* Stats Cards */}
              <Grid item xs={12} sm={6} md={3}>
                <DashboardCard 
                  title="Total Users" 
                  data={users.length} 
                  trend={5}
                  type="users"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DashboardCard 
                  title="Total Candidates" 
                  data={candidates.length} 
                  trend={12}
                  type="candidates"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DashboardCard 
                  title="Total Elections" 
                  data={elections.length} 
                  trend={0}
                  type="elections"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DashboardCard 
                  title="Total Votes" 
                  data={transactions.length} 
                  trend={8}
                  type="results"
                />
              </Grid>

              {/* New Enhanced Charts */}
              <Grid item xs={12} md={6}>
                <EnhancedAnalyticsChart 
                  title="Voters by Age Group" 
                  description="Distribution of registered voters by age categories" 
                  data={groupUsersByAge(users)}
                  type="pie"
                  isLoading={isLoading}
                  colors={[
                    theme.palette.primary.main,
                    theme.palette.success.main,
                    theme.palette.warning.main,
                    theme.palette.error.main,
                    theme.palette.info.main,
                  ]}
                />
              </Grid>

              <Grid item xs={12}>
                <ElectionVoterStatsChart 
                  electionStats={calculateElectionVoterStats(elections, users, transactions)}
                  isLoading={isLoading}
                />
              </Grid>
            </Grid>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard; 