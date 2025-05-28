import React from "react";
import { Button, Typography, Box, Grid, Paper, Alert, Divider } from "@mui/material";
import InputField from "../../../Components/Form/InputField";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../../Components/Form/ErrorMessage";
import axios from "axios";
import ContentHeader from "../../../Components/ContentHeader";
import { serverLink } from "../../../Data/Variables";
import DatePicker from "../../../Components/Form/DatePicker";
import CSVUpload from "../../../Components/CSVUpload";

const AddUser = () => {
  const navigate = useNavigate();
  const [locationData, setLocation] = useState({});
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(null);
  const today = new Date();
  const maxDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  
  const [formData, setFormData] = useState({
    username: "",
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    voterID: "",
    fatherName: "",
    dob: "",
    location: "",
  });

  const calculateAge = (birthDate) => {
    const dob = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Calculate age when date of birth changes
    if (name === "dob") {
      const calculatedAge = calculateAge(value);
      setAge(calculatedAge);
      // Clear DOB error when date is selected
      if (errors.dob) {
        setErrors({
          ...errors,
          dob: ""
        });
      }
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = async () => {
    let tempErrors = {};
    let isValid = true;
    
    // Mobile validation - must be exactly 10 digits
    if (!/^\d{10}$/.test(formData.mobile)) {
      tempErrors.mobile = "Mobile number must be exactly 10 digits";
      isValid = false;
    }
    
    // Voter ID validation - must be exactly 10 characters alphanumeric
    if (!/^[A-Z0-9]{10}$/.test(formData.voterID)) {
      tempErrors.voterID = "Voter ID must be exactly 10 characters (uppercase letters and numbers only)";
      isValid = false;
    }
    
    // Email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    // Father's name validation
    if (!formData.fatherName.trim() || formData.fatherName.length < 3) {
      tempErrors.fatherName = "Father's name must be at least 3 characters";
      isValid = false;
    }

    // Location validation
    if (!formData.location.trim()) {
      tempErrors.location = "Location is required";
      isValid = false;
    }

    // Date of birth validation
    if (!formData.dob) {
      tempErrors.dob = "Date of birth is required";
      isValid = false;
    } else {
      const userAge = calculateAge(formData.dob);
      if (userAge < 18) {
        tempErrors.dob = "User must be at least 18 years old";
        isValid = false;
      }
    }
    
    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!(await validateForm())) {
      return;
    }
    
    const profile = e.target.profile.files[0];
    if (!profile) {
      setErrors({...errors, profile: "Profile image is required"});
      return;
    }
    
    const sendData = new FormData();
    sendData.append("username", formData.username);
    sendData.append("fname", formData.fname);
    sendData.append("lname", formData.lname);
    sendData.append("email", formData.email);
    sendData.append("mobile", formData.mobile);
    sendData.append("voterID", formData.voterID);
    sendData.append("fatherName", formData.fatherName);
    sendData.append("location", formData.location);
    sendData.append("dob", formData.dob);
    sendData.append("profile", profile);
    sendData.append("avatar", formData.username + "." + profile.name.split(".").pop());

    try {
      const response = await axios.post(serverLink + "register", sendData);
      if (response.status === 201) {
        navigate("/admin/users");
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data) {
        setErrors({...errors, submit: err.response.data});
      } else {
        setErrors({...errors, submit: "Registration failed. Please try again."});
      }
    }
  };

  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get("https://geolocation-db.com/json/");
          setLocation(res.data);
      } catch (err) {
          console.log(err);
      }
    }
    getData();
  }, []);

  return (
    <div className="admin__content">
      <ContentHeader />
      <div className="content">
        <Typography variant="h6" gutterBottom>
          Add Users
        </Typography>
        
        {/* CSV Upload Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Bulk Upload Users
          </Typography>
          <CSVUpload onUploadSuccess={() => navigate('/admin/users')} />
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Add Single User
        </Typography>

        <form onSubmit={handleSubmit} method="POST">
          <Paper elevation={3}>
            <Box px={3} py={2}>
              <Typography variant="h6" align="center" margin="dense">
                Add User
              </Typography>
              {errors.submit && (
                <Typography color="error" align="center">
                  {errors.submit}
                </Typography>
              )}
              <Grid container pt={3} spacing={3}>
                <Grid item xs={12} sm={12}>
                  <InputField
                    label="Username"
                    name="username"
                    fullWidth={true}
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {errors.username && <ErrorMessage message={errors.username} />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    label="First Name"
                    name="fname"
                    fullWidth={true}
                    value={formData.fname}
                    onChange={handleChange}
                  />
                  {errors.fname && <ErrorMessage message={errors.fname} />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField 
                    label="Last Name" 
                    name="lname" 
                    fullWidth={true}
                    value={formData.lname}
                    onChange={handleChange}
                  />
                  {errors.lname && <ErrorMessage message={errors.lname} />}
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Box>
                    <DatePicker 
                      name="dob" 
                      title="Date of Birth" 
                      max={maxDate}
                      value={formData.dob}
                      onChange={handleChange}
                    />
                    {age !== null && (
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                        Age: {age} years old
                      </Typography>
                    )}
                    {errors.dob && <ErrorMessage message={errors.dob} />}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputField 
                    label="E-mail" 
                    name="email" 
                    fullWidth={true}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <ErrorMessage message={errors.email} />}
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputField 
                    label="Mobile" 
                    name="mobile" 
                    fullWidth={true}
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                  {errors.mobile && <ErrorMessage message={errors.mobile} />}
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputField 
                    label="Voter ID" 
                    name="voterID" 
                    fullWidth={true}
                    value={formData.voterID}
                    onChange={handleChange}
                    placeholder="Enter 10-character Voter ID"
                  />
                  {errors.voterID && <ErrorMessage message={errors.voterID} />}
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputField 
                    label="Father's Name" 
                    name="fatherName" 
                    fullWidth={true}
                    value={formData.fatherName}
                    onChange={handleChange}
                    placeholder="Enter your father's full name"
                  />
                  {errors.fatherName && <ErrorMessage message={errors.fatherName} />}
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputField 
                    label="Location" 
                    name="location" 
                    fullWidth={true}
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter your city or area"
                  />
                  {errors.location && <ErrorMessage message={errors.location} />}
                </Grid>
                <Grid item xs={12} sm={12}>
                  <input
                    type="file"
                    label="Upload Image"
                    name="profile"
                    fullWidth={true}
                  />
                  {errors.profile && <ErrorMessage message={errors.profile} />}
                </Grid>
              </Grid>
              <Box mt={3}>
                <Button type="submit" variant="contained" color="primary">
                  Add User
                </Button>
              </Box>
            </Box>
          </Paper>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
