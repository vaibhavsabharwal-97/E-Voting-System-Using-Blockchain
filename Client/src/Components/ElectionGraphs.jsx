import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ElectionGraphs = ({ candidateResults, electionInfo }) => {
  // Get display names if available, otherwise fall back to username
  const displayNames = electionInfo?.candidateDisplayNames || candidateResults.map(c => c.displayName || c.username);

  // Prepare data for vote distribution chart
  const voteDistributionData = {
    labels: displayNames,
    datasets: [
      {
        label: 'Number of Votes',
        data: candidateResults.map(c => c.votes),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options for vote distribution chart
  const voteDistributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Vote Distribution Among Candidates',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Election Analytics
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
        {/* Vote Distribution Chart */}
        <Paper elevation={2} sx={{ p: 3, flex: '1 1 400px', maxWidth: '600px' }}>
          <Bar data={voteDistributionData} options={voteDistributionOptions} />
        </Paper>
      </Box>
    </Box>
  );
};

export default ElectionGraphs; 