import React, { useContext, useEffect, useState } from "react";
import { TransactionContext } from "../../../context/TransactionContext";
import { Grid, Toolbar, Typography, Box, CircularProgress, Paper, Button, Alert, Container } from "@mui/material";
import ElectionResult from "../../../Components/Admin/ElectionResult";
import ContentHeader from "../../../Components/ContentHeader";
import BlockchainChecker from "../../../Components/BlockchainChecker";
import { getResult } from "../../../Data/Methods";
import axios from "axios";
import { serverLink } from "../../../Data/Variables";

const ViewResult = () => {
  const { getAllTransactions, connectWallet, currentAccount } = useContext(TransactionContext);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blockchainReady, setBlockchainReady] = useState(false);

  // This function will be called once blockchain connection is ready
  const handleBlockchainReady = () => {
    setBlockchainReady(true);
    fetchResultData();
  };

  // Separate function to fetch election results data
  const fetchResultData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get elections that are in the result phase
      const electionsResponse = await axios.get(serverLink + "result/elections");
      const resultElections = electionsResponse.data;
      
      console.log("Elections in result phase:", resultElections);
      
      if (!resultElections || resultElections.length === 0) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      try {
        // Get all blockchain transactions
        const transactions = await getAllTransactions();
        console.log("Blockchain transactions:", transactions);
        
        // Get all candidates for mapping purposes
        const candidatesResponse = await axios.get(serverLink + "candidates");
        const candidates = candidatesResponse.data;
        console.log("All candidates:", candidates);
        
        // Process transactions to get election results if there are transactions
        let electionResults = [];
        if (transactions && transactions.length > 0) {
          electionResults = await getResult(transactions);
          console.log("Election results from blockchain:", electionResults);
        }
        
        // Create a combined result set that includes:
        // 1. Elections with blockchain voting data
        // 2. Elections in result phase but without voting data (showing zero votes)
        const combinedResults = [];
        
        // First process elections with blockchain voting data
        for (const result of electionResults) {
          const matchingElection = resultElections.find(e => e.name === result.name);
          if (matchingElection) {
            combinedResults.push({
              ...result,
              _id: matchingElection._id
            });
          }
        }
        
        // Now add elections that are in result phase but don't have blockchain data
        for (const election of resultElections) {
          const alreadyAdded = combinedResults.some(r => r.name === election.name);
          if (!alreadyAdded) {
            // Create an empty result entry for this election
            const candidatesList = election.candidates || [];
            
            // Map candidate IDs to actual candidate objects
            const candidateNames = [];
            for (const candidateId of candidatesList) {
              const candidate = candidates.find(c => c._id === candidateId);
              if (candidate) {
                candidateNames.push(candidate.username);
              }
            }
            
            const emptyVotes = Array(candidateNames.length).fill(0);
            
            combinedResults.push({
              name: election.name,
              candidates: candidateNames,
              vote: emptyVotes,
              _id: election._id,
              noVotes: true
            });
          }
        }
        
        console.log("Combined results:", combinedResults);
        setResults(combinedResults);
      } catch (blockchainError) {
        console.error("Error processing blockchain data:", blockchainError);
        
        // Even if blockchain data fails, still show elections
        const fallbackResults = resultElections.map(election => {
          return {
            name: election.name,
            candidates: [],
            vote: [],
            _id: election._id,
            noVotes: true,
            blockchainError: true
          };
        });
        
        setResults(fallbackResults);
        setError("Failed to retrieve blockchain data. Please check your MetaMask connection.");
      }
    } catch (apiError) {
      console.error("API error:", apiError);
      setError("Failed to fetch election data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to connect wallet on component mount
    const attemptWalletConnection = async () => {
      try {
        if (!currentAccount) {
          await connectWallet();
        }
        setBlockchainReady(true);
        fetchResultData();
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        // Continue loading elections even if wallet connection fails
        setBlockchainReady(false);
        fetchResultData();
      }
    };
    
    attemptWalletConnection();
  }, []);

  const handleRetry = async () => {
    try {
      await connectWallet();
      setBlockchainReady(true);
      fetchResultData();
    } catch (error) {
      console.error("Error on retry:", error);
    }
  };

  return (
    <div className="admin__content">
      <ContentHeader title="Election Results" link="/admin/Result" />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Container maxWidth="md">
          <Alert 
            severity="warning" 
            sx={{ mt: 4, mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
          
          {results.length > 0 && (
            <div style={{ paddingBottom: 25 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Showing elections with limited data:
              </Typography>
              <Toolbar>
                <Grid container pt={3} spacing={2}>
                  {results.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <ElectionResult
                        index={index}
                        title={item.name}
                        candidates={item.candidates}
                        votes={item.vote}
                        info={item}
                        noVotes={item.noVotes}
                        link={`/admin/result/${encodeURIComponent(item.name)}`}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Toolbar>
            </div>
          )}
        </Container>
      ) : (
        <div style={{ paddingBottom: 25 }}>
          <Toolbar>
            <Grid container pt={3} spacing={2}>
              {results.length > 0 ? (
                results.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <ElectionResult
                      index={index}
                      title={item.name}
                      candidates={item.candidates}
                      votes={item.vote}
                      info={item}
                      noVotes={item.noVotes}
                      link={`/admin/result/${encodeURIComponent(item.name)}`}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      No Election Results Available
                    </Typography>
                    <Typography paragraph>
                      There are no election results to display at this time. This could be because:
                    </Typography>
                    <Box sx={{ textAlign: 'left', maxWidth: 500, mx: 'auto' }}>
                      <Typography component="ul" sx={{ pl: 2 }}>
                        <li>No elections are in the "result" phase yet</li>
                        <li>No votes have been cast in the blockchain for elections in the result phase</li>
                        <li>Your blockchain connection is not properly set up</li>
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Toolbar>
        </div>
      )}
    </div>
  );
};

export default ViewResult;
