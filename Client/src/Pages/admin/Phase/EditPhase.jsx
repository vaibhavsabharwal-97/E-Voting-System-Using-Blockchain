import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Autocomplete,
  TextField,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import InputField from "../../../Components/Form/InputField";
import { ErrorMessage } from "../../../Components/Form/ErrorMessage";
import { serverLink } from "../../../Data/Variables";
import ContentHeader from "../../../Components/ContentHeader";
import InputTags from "../../../Components/Form/InputTags";
import { phases } from "../../../Data/Variables";

const EditPhase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [originalCandidates, setOriginalCandidates] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [candidatesChanged, setCandidatesChanged] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchElectionData() {
      setLoading(true);
      try {
        const response = await axios.get(`${serverLink}election/${id}`);
        if (response.data) {
          setElection(response.data);
          
          // Set candidates from the election data
          if (response.data.candidates) {
            setCandidates(response.data.candidates);
            setOriginalCandidates(response.data.candidates);
          }
        }
      } catch (error) {
        console.error("Error fetching election:", error);
        setErrorMessage("Failed to load election data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchElectionData();
  }, [id]);

  // Track candidate changes
  useEffect(() => {
    if (originalCandidates.length > 0) {
      // Check if candidates have changed
      const hasChanged = candidates.length !== originalCandidates.length || 
        candidates.some(c => !originalCandidates.includes(c)) ||
        originalCandidates.some(c => !candidates.includes(c));
      
      setCandidatesChanged(hasChanged);
    }
  }, [candidates, originalCandidates]);

  const validateForm = (formData) => {
    const newErrors = {};
    
    // Election name validation
    if (!formData.name.trim()) {
      newErrors.name = "Election name is required";
    }
    
    // Candidates validation
    if (!formData.candidates || formData.candidates.length === 0) {
      newErrors.candidates = "At least one candidate must be selected";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      name: e.target.name.value,
      currentPhase: e.target.currentPhase.value,
      candidates: candidates
    };
    
    // Validate form
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await axios.post(`${serverLink}phase/edit/${id}`, formData);
      
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Election phase updated successfully");
        // Reset candidates changed flag
        setCandidatesChanged(false);
        // Navigate back after short delay
        setTimeout(() => {
          navigate("/admin/elections");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating election:", error);
      setErrorMessage(error.response?.data || "Error updating election. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="admin__content">
        <ContentHeader title="Back to Elections" link="/admin/elections" />
        <div className="content" style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="admin__content">
        <ContentHeader title="Back to Elections" link="/admin/elections" />
        <div className="content">
          <Typography variant="h6" align="center">
            Election not found
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="admin__content">
      <ContentHeader title="Back to Elections" link="/admin/elections" />
      <div className="content">
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage("")}>
            {errorMessage}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage("")}>
            {successMessage}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} method="POST">
          <Paper elevation={3}>
            <Box px={3} py={2}>
              <Typography variant="h6" align="center" margin="dense">
                Edit Election Phase
              </Typography>
              <Grid container pt={3} spacing={3}>
                <Grid item xs={12}>
                  <InputField
                    label="Election Name"
                    name="name"
                    fullWidth={true}
                    value={election.name}
                  />
                  {errors.name && <ErrorMessage message={errors.name} />}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Candidates
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    You can add or remove candidates for this election.
                  </Typography>
                  <InputTags
                    setCandidates={(newCandidates) => {
                      setCandidates(newCandidates);
                      setCandidatesChanged(true);
                      // Clear any candidate-related errors
                      if (errors.candidates) {
                        setErrors({ ...errors, candidates: undefined });
                      }
                    }}
                    candidates={candidates}
                    readOnly={false}
                  />
                  {errors.candidates && <ErrorMessage message={errors.candidates} />}
                  {candidatesChanged && (
                    <Alert severity="info" sx={{ mt: 1, mb: 1 }}>
                      Candidate list has been modified. Click "Update Phase" to save changes.
                    </Alert>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Election Phase
                  </Typography>
                  <Autocomplete
                    id="phase-select"
                    options={phases}
                    defaultValue={election.currentPhase}
                    sx={{ width: '100%' }}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        name="currentPhase"
                        label="Phase"
                      />
                    )}
                  />
                </Grid>
              </Grid>
              
              <Box mt={3}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  fullWidth
                >
                  Update Phase
                </Button>
              </Box>
            </Box>
          </Paper>
        </form>
      </div>
    </div>
  );
};

export default EditPhase;
