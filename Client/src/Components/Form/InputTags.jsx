import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useState, useEffect } from "react";
import axios from "axios";
import { serverLink } from "../../Data/Variables";
import { CircularProgress, Typography } from "@mui/material";

export default function InputTags(props) {
  const { candidates, setCandidates, readOnly } = props;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
        width: 250,
      },
    },
  };
  
  const [candidateList, setCandidateList] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [candidateMap, setCandidateMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all candidates and set up the mapping between IDs, usernames, and display names
  useEffect(() => {
    async function fetchCandidates() {
      try {
        setLoading(true);
        const response = await axios.get(serverLink + "candidates");
        const candidates = response.data;
        setCandidateList(candidates);
        
        // Create a mapping of username to full candidate info
        const mapping = {};
        candidates.forEach(candidate => {
          // Format full name
          const displayName = `${candidate.firstName} ${candidate.lastName || ''}`.trim();
          
          // Map by username
          mapping[candidate.username] = {
            id: candidate._id,
            username: candidate.username,
            displayName: displayName
          };
          
          // Also map by ID for cases where we receive IDs instead of usernames
          mapping[candidate._id] = {
            id: candidate._id,
            username: candidate.username,
            displayName: displayName
          };
        });
        setCandidateMap(mapping);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCandidates();
  }, []);

  // Update selected candidates when props change
  useEffect(() => {
    if (candidates && candidates.length > 0) {
      setSelectedCandidates(candidates);
    } else {
      setSelectedCandidates([]);
    }
  }, [candidates]);

  const theme = useTheme();

  const handleChange = (event) => {
    const selectedValues = event.target.value;
    setSelectedCandidates(selectedValues);
    
    if (setCandidates) {
      setCandidates(selectedValues);
    }
  };

  // Get the display name for a candidate (either username or ID)
  const getDisplayName = (candidateIdentifier) => {
    if (!candidateIdentifier) return "Unknown Candidate";
    
    return candidateMap[candidateIdentifier]?.displayName || 
           (candidateIdentifier.length > 20 ? "Loading..." : candidateIdentifier);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '56px' }}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        Loading candidates...
      </Box>
    );
  }

  return (
    <div>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id="candidates-select-label">Select Candidates</InputLabel>
        <Select
          disabled={readOnly}
          labelId="candidates-select-label"
          id="candidates-select"
          multiple
          value={selectedCandidates}
          onChange={handleChange}
          input={<OutlinedInput label="Select Candidates" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((candidateIdentifier) => (
                <Chip 
                  key={candidateIdentifier} 
                  label={getDisplayName(candidateIdentifier)} 
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {candidateList.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2">No candidates available</Typography>
            </MenuItem>
          ) : (
            candidateList.map((candidate) => (
              <MenuItem
                key={candidate._id}
                value={candidate.username}
                style={{
                  fontWeight:
                    selectedCandidates.indexOf(candidate.username) === -1
                      ? theme.typography.fontWeightRegular
                      : theme.typography.fontWeightMedium,
                }}
              >
                {`${candidate.firstName} ${candidate.lastName || ''} (${candidate.username})`}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </div>
  );
}
