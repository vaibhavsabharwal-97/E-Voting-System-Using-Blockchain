// Utility functions for dashboard data processing

/**
 * Calculate age from date of birth
 * @param {string|Date} dob - Date of birth
 * @returns {number} - Age in years
 */
export const calculateAge = (dob) => {
  if (!dob) return 0;
  
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Group users by age categories
 * @param {Array} users - Array of user objects with dob field
 * @returns {Array} - Array of age group objects with label and value
 */
export const groupUsersByAge = (users) => {
  const ageGroups = {
    '18-30': 0,
    '31-40': 0,
    '41-60': 0,
    '61-80': 0,
    '81+': 0,
  };

  users.forEach(user => {
    if (user.dob) {
      const age = calculateAge(user.dob);
      
      if (age >= 18 && age <= 30) {
        ageGroups['18-30']++;
      } else if (age >= 31 && age <= 40) {
        ageGroups['31-40']++;
      } else if (age >= 41 && age <= 60) {
        ageGroups['41-60']++;
      } else if (age >= 61 && age <= 80) {
        ageGroups['61-80']++;
      } else if (age >= 81) {
        ageGroups['81+']++;
      }
    }
  });

  return Object.entries(ageGroups).map(([label, value]) => ({
    label,
    value,
  }));
};

/**
 * Calculate voter statistics for elections combining database and blockchain data
 * @param {Array} elections - Array of election objects from database
 * @param {Array} users - Array of user objects from database
 * @param {Array} transactions - Array of voting transactions from blockchain
 * @returns {Array} - Array of election voter stats
 */
export const calculateElectionVoterStats = (elections, users, transactions) => {
  const electionStats = elections.map(election => {
    // Total registered voters (all non-admin users)
    const registeredVoters = users.filter(user => !user.isAdmin).length;
    
    // Voters who cast votes (from blockchain transactions)
    const votesForElection = transactions.filter(
      transaction => transaction.election_id === election._id
    );
    const votersWhoCast = votesForElection.length;

    return {
      electionId: election._id,
      electionName: election.name || election.title || `Election ${election._id?.substring(0, 8)}`,
      registeredVoters,
      votersWhoCast,
      turnoutPercentage: registeredVoters > 0 ? ((votersWhoCast / registeredVoters) * 100).toFixed(1) : 0,
    };
  });

  return electionStats;
};

/**
 * Prepare bar chart data for election voter stats
 * @param {Array} electionStats - Election statistics from calculateElectionVoterStats
 * @returns {Object} - Chart.js compatible data structure
 */
export const prepareElectionVoterChartData = (electionStats) => {
  const labels = electionStats.map(stat => 
    stat.electionName.length > 15 
      ? stat.electionName.substring(0, 15) + '...' 
      : stat.electionName
  );

  return {
    labels,
    datasets: [
      {
        label: 'Registered Voters',
        data: electionStats.map(stat => stat.registeredVoters),
        backgroundColor: '#3B82F6CC',
        borderColor: '#3B82F6',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Voters Who Cast Votes',
        data: electionStats.map(stat => stat.votersWhoCast),
        backgroundColor: '#10B981CC',
        borderColor: '#10B981',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };
};

/**
 * Generate mock data for demonstration when actual blockchain data is unavailable
 * @param {Array} elections - Array of election objects
 * @param {Array} users - Array of user objects
 * @returns {Array} - Mock transaction data
 */
export const generateMockVotingData = (elections, users) => {
  const mockTransactions = [];
  const voterUsers = users.filter(user => !user.isAdmin);
  
  elections.forEach(election => {
    // Simulate 40-80% voter turnout
    const turnoutRate = 0.4 + Math.random() * 0.4;
    const numVoters = Math.floor(voterUsers.length * turnoutRate);
    
    // Randomly select voters
    const shuffledVoters = [...voterUsers].sort(() => 0.5 - Math.random());
    const selectedVoters = shuffledVoters.slice(0, numVoters);
    
    selectedVoters.forEach((voter, index) => {
      mockTransactions.push({
        user_id: voter._id,
        election_id: election._id,
        candidate_id: election.candidates?.[Math.floor(Math.random() * election.candidates.length)]?.id || 'candidate_1',
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random time in last 30 days
        addressFrom: `0x${Math.random().toString(16).substr(2, 40)}`, // Mock address
      });
    });
  });
  
  return mockTransactions;
};

/**
 * Format election data for display
 * @param {Object} election - Election object
 * @returns {string} - Formatted election name
 */
export const formatElectionName = (election) => {
  return election.name || election.title || `Election ${election._id?.substring(0, 8)}`;
};

/**
 * Calculate voting trends over time
 * @param {Array} transactions - Array of voting transactions
 * @returns {Array} - Time series data for charts
 */
export const calculateVotingTrends = (transactions) => {
  const trendData = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.timestamp).toISOString().split('T')[0];
    trendData[date] = (trendData[date] || 0) + 1;
  });
  
  const sortedDates = Object.keys(trendData).sort();
  
  return sortedDates.map(date => ({
    date,
    votes: trendData[date],
    label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));
}; 