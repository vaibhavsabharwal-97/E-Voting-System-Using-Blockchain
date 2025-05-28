import React, { useState, useEffect, useContext } from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { TransactionContext } from '../context/TransactionContext';

const BlockchainChecker = ({ onReady }) => {
  const { connectWallet, currentAccount } = useContext(TransactionContext);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState(null);
  const [metamaskInstalled, setMetamaskInstalled] = useState(true);

  useEffect(() => {
    async function checkBlockchainSetup() {
      setIsChecking(true);
      setError(null);

      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        setMetamaskInstalled(false);
        setIsChecking(false);
        setError('MetaMask is not installed');
        return;
      }

      // Check if wallet is connected
      if (!currentAccount) {
        try {
          await connectWallet();
        } catch (error) {
          console.error('Error connecting wallet:', error);
          setError('Could not connect to your wallet. Please connect manually.');
          setIsChecking(false);
          return;
        }
      }

      // If we get here, blockchain setup is ready
      setIsChecking(false);
      if (onReady) {
        onReady();
      }
    }

    checkBlockchainSetup();
  }, [connectWallet, currentAccount, onReady]);

  const handleConnectClick = async () => {
    setIsChecking(true);
    setError(null);

    try {
      await connectWallet();
      if (onReady) {
        onReady();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  // Still checking, show loading
  if (isChecking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // MetaMask not installed
  if (!metamaskInstalled) {
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          MetaMask Extension Required
        </Typography>
        <Typography paragraph>
          This application requires the MetaMask browser extension to access blockchain data.
          Please install MetaMask and refresh the page.
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          component="a" 
          href="https://metamask.io/download/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Download MetaMask
        </Button>
      </Paper>
    );
  }

  // Error connecting wallet
  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Wallet Connection Required
        </Typography>
        <Typography paragraph>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleConnectClick}
        >
          Connect Wallet
        </Button>
      </Paper>
    );
  }

  // Blockchain ready, render nothing
  return null;
};

export default BlockchainChecker; 