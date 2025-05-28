import React from "react";
import { Button, Typography, Box, Grid, Paper } from "@mui/material";
import InputField from "../../../Components/Form/InputField";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage } from "../../../Components/Form/ErrorMessage";
import axios from "axios";
import ContentHeader from "../../../Components/ContentHeader";
import { serverLink } from "../../../Data/Variables";
import DatePicker from "../../../Components/Form/DatePicker";

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fname: "",
    lname: "",
    mobile: "",
    location: "",
    dob: "",
    voterID: "",
    fatherName: ""
  });
  const today = new Date();
  const maxDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  useEffect(() => {
    async function getData() {
      const link = serverLink + "user/" + id;
      const t = await axios.get(link);
      setData(t.data);
      // Set form data when user data is fetched
      setFormData({
        username: t.data.username || "",
        email: t.data.email || "",
        fname: t.data.fname || "",
        lname: t.data.lname || "",
        mobile: t.data.mobile || "",
        location: t.data.location || "",
        dob: t.data.dob ? new Date(t.data.dob).toISOString().split('T')[0] : "",
        voterID: t.data.voterID || "",
        fatherName: t.data.fatherName || ""
      });
      if (t.data.dob) {
        const calculatedAge = calculateAge(t.data.dob);
        setAge(calculatedAge);
      }
    }
    getData();
  }, [id]);

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

  const validateForm = (formData) => {
    const newErrors = {};
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Mobile validation - must be exactly 10 digits
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    // Voter ID validation - must be exactly 10 characters alphanumeric
    if (formData.voterID && !/^[A-Z0-9]{10}$/.test(formData.voterID)) {
      newErrors.voterID = "Voter ID must be exactly 10 characters (uppercase letters and numbers only)";
    }

    // Father's name validation
    if (formData.fatherName && formData.fatherName.length < 3) {
      newErrors.fatherName = "Father's name must be at least 3 characters";
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const userAge = calculateAge(formData.dob);
      if (userAge < 18) {
        newErrors.dob = "User must be at least 18 years old";
      }
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Calculate age if dob field changes
    if (name === "dob" && value) {
      const calculatedAge = calculateAge(value);
      setAge(calculatedAge);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const profile = e.target.profile.files[0];
    const sendData = new FormData();
    sendData.append("username", formData.username);
    sendData.append("fname", formData.fname);
    sendData.append("lname", formData.lname);
    sendData.append("email", formData.email);
    sendData.append("mobile", formData.mobile);
    sendData.append("location", formData.location);
    sendData.append("dob", formData.dob);
    sendData.append("voterID", formData.voterID);
    sendData.append("fatherName", formData.fatherName);
    if (profile) {
      sendData.append("profile", profile);
      sendData.append("avatar", formData.username + "." + profile.name.split(".").pop());
    }

    const link = serverLink + "user/edit/" + data._id;

    axios.post(link, sendData)
      .then((res) => {
        if (res.status === 201) {
          navigate("/admin/users");
        }
      })
      .catch((error) => {
        setErrors({ submit: error.response?.data || "Error updating user" });
      });
  };

  return (
    <div className="admin__content">
      <ContentHeader />
      {data && (
        <div className="content">
          <form onSubmit={handleSubmit} method="POST">
            <Paper elevation={3}>
              <Box px={3} py={2}>
                <Typography variant="h6" align="center" margin="dense">
                  Edit User
                </Typography>
                {errors.submit && (
                  <Typography color="error" align="center" sx={{ mt: 2 }}>
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
                    <input type="file" label="Upload Image" name="profile" />
                    {errors.profile && <ErrorMessage message={errors.profile} />}
                  </Grid>
                </Grid>
                <Box mt={3}>
                  <Button type="submit" variant="contained" color="primary">
                    Update User
                  </Button>
                </Box>
              </Box>
            </Paper>
          </form>
        </div>
      )}
    </div>
  );
};

export default ViewUser;
