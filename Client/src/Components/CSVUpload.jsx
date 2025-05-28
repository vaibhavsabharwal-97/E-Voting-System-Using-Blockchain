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
  Tabs,
  Tab,
} from '@mui/material';
import { Upload, CheckCircle, Error, Download } from '@mui/icons-material';
import axios from 'axios';
import { serverLink } from '../Data/Variables';

const CSVUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [uploadResults, setUploadResults] = useState({ success: [], errors: [] });
  const [showResults, setShowResults] = useState(false);
  const [uploadType, setUploadType] = useState('csv'); // 'csv' or 'zip'

  const validateCSVFormat = (headers) => {
    const requiredFields = ['username', 'fname', 'lname', 'email', 'mobile', 'voterID', 'fatherName', 'dob', 'location'];
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

    const fileType = uploadType === 'csv' ? 'text/csv' : 'application/zip';
    const fileExtension = uploadType === 'csv' ? '.csv' : '.zip';

    if (file.type !== fileType && !file.name.endsWith(fileExtension)) {
      setError(`Please upload a ${uploadType.toUpperCase()} file`);
      return;
    }

    setFile(file);
    setError('');

    if (uploadType === 'csv') {
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
    } else {
      // For ZIP files, we'll show a different kind of preview or message
      setShowPreview(true);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    const formData = new FormData();
    
    if (uploadType === 'csv') {
      formData.append('csv', file);
    } else {
      formData.append('zip', file);
    }

    try {
      const response = await axios.post(serverLink + 'upload-users', formData, {
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
          Bulk User Registration
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Upload a CSV file with the following columns: username, fname, lname, email, mobile, voterID, fatherName, dob (DD-MM-YYYY), location
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Tabs
            value={uploadType}
            onChange={(e, newValue) => {
              setUploadType(newValue);
              setFile(null);
              setError('');
              setShowPreview(false);
            }}
          >
            <Tab value="csv" label="CSV Only" />
            <Tab value="zip" label="ZIP with Images" />
          </Tabs>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            {uploadType === 'csv' ? (
              'Upload a CSV file with user details'
            ) : (
              <>
                Upload a ZIP file containing:<br />
                1. A CSV file with user details<br />
                2. Image files named exactly as usernames (e.g., john_doe.jpg)
              </>
            )}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Download />}
              onClick={() => window.open(serverLink + 'download-template', '_blank')}
            >
              Download Template
            </Button>

            <input
              accept={uploadType === 'csv' ? '.csv' : '.zip'}
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<Upload />}
              >
                Select {uploadType.toUpperCase()} File
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
              {loading ? <CircularProgress size={24} /> : 'Upload Users'}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Preview Dialog */}
      <Dialog open={showPreview} maxWidth="md" fullWidth>
        <DialogTitle>
          {uploadType === 'csv' ? 'Preview (First 5 rows)' : 'ZIP File Contents'}
        </DialogTitle>
        <DialogContent>
          {uploadType === 'csv' ? (
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
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" gutterBottom>
                Selected ZIP file: {file?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The ZIP file should contain:
              </Typography>
              <ul>
                <li>A CSV file with user details</li>
                <li>Image files for each user (jpg, jpeg, or png)</li>
                <li>Image filenames should match usernames in the CSV</li>
              </ul>
            </Box>
          )}
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
            {uploadResults.success.map((user, index) => (
              <Typography key={index} variant="body2" sx={{ ml: 4 }}>
                {user.username} - {user.email}
              </Typography>
            ))}
          </Box>
          
          {uploadResults.errors.length > 0 && (
            <Box>
              <Typography variant="h6" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Error /> Errors ({uploadResults.errors.length})
              </Typography>
              {uploadResults.errors.map((error, index) => (
                <Typography key={index} variant="body2" color="error" sx={{ ml: 4 }}>
                  Row {error.row}: {error.message}
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

export default CSVUpload; 