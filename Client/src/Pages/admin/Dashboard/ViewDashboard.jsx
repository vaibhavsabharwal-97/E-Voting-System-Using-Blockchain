import React, { useState, useEffect, useContext } from "react";
import ContentHeader from "../../../Components/ContentHeader";
import axios from "axios";
import DashboardCard from "../../../Components/DashboardCard";
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Fade, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Tooltip,
  useTheme,
  Paper,
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EnhancedAnalyticsChart from "../../../Components/EnhancedAnalyticsChart";
import ElectionVoterStatsChart from "../../../Components/ElectionVoterStatsChart";
import CandidateFeedbackChart from "../../../Components/CandidateFeedbackChart";
import { TransactionContext } from "../../../context/TransactionContext";
import { 
  groupUsersByAge, 
  calculateElectionVoterStats, 
  generateMockVotingData 
} from '../../../utils/dashboardUtils';

const ViewDashboard = () => {
  const [users, setUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { getAllTransactions } = useContext(TransactionContext);
  const theme = useTheme();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, candidatesRes, electionsRes] = await Promise.all([
        axios.get("http://localhost:1322/api/auth/users"),
        axios.get("http://localhost:1322/api/auth/candidates"),
        axios.get("http://localhost:1322/api/auth/elections")
      ]);
      
      const userData = usersRes.data;
      const candidateData = candidatesRes.data;
      const electionData = electionsRes.data;

      setUsers(userData);
      setCandidates(candidateData);
      setElections(electionData);

      const trans = await getAllTransactions();
      console.log('Blockchain Transactions:', trans);
      
      const finalTransactions = trans?.length > 0 ? trans : generateMockVotingData(electionData, userData);
      setTransactions(finalTransactions);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(145deg, rgba(30,30,30,0.9) 0%, rgba(20,20,20,0.9) 100%)'
        : 'linear-gradient(145deg, rgba(240,240,240,0.9) 0%, rgba(250,250,250,0.9) 100%)',
      pb: 6,
    }}>
      {/* Dashboard Header */}
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          background: theme.palette.mode === 'dark'
            ? 'rgba(30,30,30,0.8)'
            : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(255,255,255,0.1)' 
            : 'rgba(0,0,0,0.1)'}`,
        }}
      >
        <Toolbar>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)'
              : 'linear-gradient(45deg, #2c3e50 30%, #34495e 90%)',
            padding: '8px 16px',
            borderRadius: '12px',
          }}>
            <DashboardIcon sx={{ 
              mr: 2,
              color: theme.palette.mode === 'dark' ? '#2c3e50' : '#fff',
            }} />
            <Typography 
              variant="h5" 
              fontWeight="bold"
              sx={{
                color: theme.palette.mode === 'dark' ? '#2c3e50' : '#fff',
              }}
            >
              E-Voting Dashboard
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={handleRefresh} 
              sx={{ 
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                },
                background: theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.05)',
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.1)',
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <ContentHeader />
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Fade in={true} timeout={800}>
          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} sm={4}>
              <Fade in={true} timeout={800} style={{ transitionDelay: '100ms' }}>
                <div>
                  <DashboardCard 
                    title="Users" 
                    data={users.length} 
                    trend={5}
                    type="users"
                    description="Total registered users in the system"
                  />
                </div>
              </Fade>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Fade in={true} timeout={800} style={{ transitionDelay: '200ms' }}>
                <div>
                  <DashboardCard 
                    title="Candidates" 
                    data={candidates.length} 
                    trend={12}
                    type="candidates"
                    description="Total candidates across all elections"
                  />
                </div>
              </Fade>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Fade in={true} timeout={800} style={{ transitionDelay: '300ms' }}>
                <div>
                  <DashboardCard 
                    title="Elections" 
                    data={elections.length} 
                    trend={0}
                    type="elections"
                    description="Active and completed elections"
                  />
                </div>
              </Fade>
            </Grid>

            {/* Charts Section */}
            <Grid item xs={12}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  textAlign: 'center',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)'
                    : 'linear-gradient(45deg, #2c3e50 30%, #34495e 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Analytics & Insights
              </Typography>
            </Grid>

            {/* Enhanced Analytics Charts */}
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={800} style={{ transitionDelay: '400ms' }}>
                <div>
                  <EnhancedAnalyticsChart 
                    title="Voters by Age Group" 
                    description="Distribution of registered voters by age categories" 
                    data={groupUsersByAge(users)}
                    type="pie"
                    isLoading={isLoading}
                    colors={[
                      '#3B82F6', // Blue
                      '#10B981', // Green
                      '#F59E0B', // Yellow
                      '#EF4444', // Red
                      '#8B5CF6', // Purple
                    ]}
                  />
                </div>
              </Fade>
            </Grid>

            {/* Candidate Feedback Chart */}
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={800} style={{ transitionDelay: '500ms' }}>
                <div>
                  <CandidateFeedbackChart 
                    candidates={candidates}
                    isLoading={isLoading}
                    height={400}
                  />
                </div>
              </Fade>
            </Grid>

            <Grid item xs={12}>
              <Fade in={true} timeout={800} style={{ transitionDelay: '600ms' }}>
                <div>
                  <ElectionVoterStatsChart 
                    electionStats={calculateElectionVoterStats(elections, users, transactions)}
                    isLoading={isLoading}
                  />
                </div>
              </Fade>
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
};

export default ViewDashboard;
