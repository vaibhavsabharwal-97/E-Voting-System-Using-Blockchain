import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Upload, CheckCircle, Error, Download } from '@mui/icons-material';
import axios from 'axios';
import { serverLink } from '../Data/Variables';

const CSVCandidateUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [uploadResults, setUploadResults] = useState({ success: [], errors: [] });
  const [showResults, setShowResults] = useState(false);

  const validateCSVFormat = (headers) => {
    const requiredFields = ['username', 'firstName', 'lastName', 'dob', 'qualification', 'join', 'location', 'partyName'];
    const missingFields = requiredFields.filter(field => !headers.includes(field));
    
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setFile(file);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());

      if (!validateCSVFormat(headers)) {
        return;
      }

      const previewData = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(value => value.trim());
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {});
      });

      setPreview(previewData);
      setShowPreview(true);
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('csv', file);

    try {
      const response = await axios.post(serverLink + 'upload-candidates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadResults(response.data);
      setShowResults(true);
      if (response.data.success.length > 0) {
        onUploadSuccess?.();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Bulk Candidate Registration
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Upload a CSV file with the following columns: username, firstName, lastName, dob (DD-MM-YYYY), qualification, join (year), location, partyName, description (optional)
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Download />}
              onClick={() => window.open(serverLink + 'download-candidate-template', '_blank')}
            >
              Download Template
            </Button>

            <input
              accept=".csv"
              style={{ display: 'none' }}
              id="candidate-file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="candidate-file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<Upload />}
              >
                Select CSV File
              </Button>
            </label>
          </Box>
          
          {file && (
            <Typography variant="body2" color="text.secondary">
              Selected file: {file.name}
            </Typography>
          )}

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          {file && !error && (
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Upload Candidates'}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Preview Dialog */}
      <Dialog open={showPreview} maxWidth="md" fullWidth>
        <DialogTitle>
          Preview (First 5 rows)
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {preview[0] && Object.keys(preview[0]).map((header) => (
                    <TableCell key={header}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {preview.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value, i) => (
                      <TableCell key={i}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
          <Button variant="contained" onClick={handleUpload} disabled={loading}>
            Confirm Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={showResults} maxWidth="md" fullWidth>
        <DialogTitle>Upload Results</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle /> Successfully Added ({uploadResults.success.length})
            </Typography>
            {uploadResults.success.map((candidate, index) => (
              <Typography key={index} variant="body2" sx={{ ml: 4 }}>
                {candidate.username} - {candidate.name}
              </Typography>
            ))}
          </Box>
          
          {uploadResults.errors && uploadResults.errors.length > 0 && (
            <Box>
              <Typography variant="h6" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Error /> Errors ({uploadResults.errors.length})
              </Typography>
              {uploadResults.errors.map((error, index) => (
                <Typography key={index} variant="body2" color="error" sx={{ ml: 4 }}>
                  Row {error.row}: {error.error}
                </Typography>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowResults(false);
            setFile(null);
            setPreview([]);
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CSVCandidateUpload; 