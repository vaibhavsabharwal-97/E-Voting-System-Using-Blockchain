import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { CircularProgress, Box, Avatar } from "@mui/material";
import axios from "axios";
import { serverLink } from "../../Data/Variables";
import HowToVoteIcon from '@mui/icons-material/HowToVote';

export default function CardLayout(props) {
  const [candidateNames, setCandidateNames] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Use the linkPrefix prop if provided, otherwise default to /result/
  const linkPrefix = props.linkPrefix || '/result/';
  const link = `${linkPrefix}${props.link}`;

  useEffect(() => {
    async function fetchCandidateNames() {
      try {
        setLoading(true);
        
        if (!props.candidates || props.candidates.length === 0) {
          setLoading(false);
          return;
        }
        
        console.log("Candidates to fetch in CardLayout:", props.candidates);
        
        const namesMap = {};
        
        // Fetch each candidate one by one using the ID endpoint
        for (const candidateId of props.candidates) {
          try {
            console.log("Fetching candidate by ID:", candidateId);
            const response = await axios.get(`${serverLink}candidate/id/${candidateId}`);
            if (response.data) {
              const { _id, firstName, lastName } = response.data;
              namesMap[_id] = `${firstName || ''} ${lastName || ''}`.trim();
              console.log(`Fetched candidate ${_id}: ${namesMap[_id]}`);
            }
          } catch (error) {
            console.error(`Error fetching candidate ${candidateId}:`, error);
            namesMap[candidateId] = candidateId;
          }
        }
        
        setCandidateNames(namesMap);
      } catch (error) {
        console.error("Error fetching candidate names:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCandidateNames();
  }, [props.candidates]);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: 'primary.main', 
          color: 'white',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar 
          sx={{ 
            bgcolor: 'white', 
            color: 'primary.main', 
            width: 60, 
            height: 60,
            mb: 1
          }}
        >
          <HowToVoteIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {props.title}
        </Typography>
      </Box>
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 1 }}>
          <strong>Candidates:</strong>
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2">Loading candidates...</Typography>
          </Box>
        ) : props.candidates && props.candidates.length > 0 ? (
          props.candidates.map((candidateId, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
              {index + 1}. {candidateNames[candidateId] || candidateId}
            </Typography>
          ))
        ) : (
          <Typography variant="body2">No candidates available</Typography>
        )}
      </CardContent>
      
      <CardActions sx={{ mt: 'auto' }}>
        <Link to={link} state={{ info: props.info }} style={{ textDecoration: 'none', width: '100%' }}>
          <Button size="small" variant="contained" color="primary" fullWidth>
            View Details
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
