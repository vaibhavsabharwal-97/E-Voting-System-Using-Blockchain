import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Switch, 
  FormControlLabel,
  Button,
  Divider
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SaveIcon from '@mui/icons-material/Save';

const Settings = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 2, pb: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Admin Settings
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Configure your E-Voting platform settings
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SettingsIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    General Settings
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Enable Public Results"
                  />
                  <Typography variant="caption" color="textSecondary" display="block">
                    Allow users to see election results after voting closes
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Enable User Registration"
                  />
                  <Typography variant="caption" color="textSecondary" display="block">
                    Allow new users to register on the platform
                  </Typography>
                </Box>
                
                <Box>
                  <FormControlLabel
                    control={<Switch />}
                    label="Maintenance Mode"
                  />
                  <Typography variant="caption" color="textSecondary" display="block">
                    Put the platform in maintenance mode
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Security Settings
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Two-Factor Authentication"
                  />
                  <Typography variant="caption" color="textSecondary" display="block">
                    Require 2FA for admin accounts
                  </Typography>
                </Box>
                
                <Box>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Face Recognition"
                  />
                  <Typography variant="caption" color="textSecondary" display="block">
                    Enable face recognition for voting authentication
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <NotificationsIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Notification Settings
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Email Notifications"
                  />
                  <Typography variant="caption" color="textSecondary" display="block">
                    Send email notifications for important events
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, textAlign: 'right' }}>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />}
            size="large"
          >
            Save Settings
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Settings; 