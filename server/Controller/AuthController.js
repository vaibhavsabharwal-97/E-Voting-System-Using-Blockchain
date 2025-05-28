import { PythonShell } from "python-shell";
import fs from "fs";
import path from "path";
import User from "../Models/User.js";
import Election from "../Models/Election.js";
import Candidate from "../Models/Candidate.js";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import { parse } from 'csv-parse';
import { Readable } from 'stream';
import AdmZip from 'adm-zip';

// http://localhost:5000/api/auth/register
//
// {
//     "username":"prnv",
//     "email":"abc@gmail.com",
//     "mobile":"1111111111",
//     "location":"120",
//     "password":"123"
//     }

export const register = {
  validator: async (req, res, next) => {
    // Validate voterID format
    if (!req.body.voterID || !/^[A-Z0-9]{10}$/.test(req.body.voterID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Voter ID format. Must be 10 characters long and contain only uppercase letters and numbers."
      });
    }
    next();
  },
  controller: async (req, res) => {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { username: req.body.username },
          { email: req.body.email },
          { mobile: req.body.mobile },
          { voterID: req.body.voterID }
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this username, email, mobile, or Voter ID"
        });
      }

      let avatar = null;
      if (req.files && req.files.profile) {
        const profileImage = req.files.profile;
        const facesDir = path.join(process.cwd(), "Faces");
        
        // Ensure the directory exists
        if (!fs.existsSync(facesDir)) {
          fs.mkdirSync(facesDir, { recursive: true });
        }

        // Generate filename using username and original extension
        const fileExt = path.extname(profileImage.name);
        const filename = req.body.username + fileExt;
        const uploadPath = path.join(facesDir, filename);

        // Move the uploaded file
        await profileImage.mv(uploadPath);
        avatar = filename;
      }

      // Create new user
      const newUser = await User.create({
        ...req.body,
        avatar: avatar
      });

      const mailContent = "Thank You For Joining the Voting System";
      const mailSubject = "Welcome Mail";

      if (sendMail(mailContent, mailSubject, newUser)) {
        return res.status(201).json({
          success: true,
          message: "Registration successful and email sent"
        });
      } else {
        return res.status(201).json({
          success: true,
          message: "Registration successful but email sending failed"
        });
      }
    } catch (e) {
      console.error("Registration error:", e);
      return res.status(500).json({
        success: false,
        message: "Registration failed",
        error: e.message
      });
    }
  },
};

export const login = {
  validator: async (req, res, next) => {
    next();
  },
  controller: async (req, res) => {
    try {
      // Validate request body
      if (!req.body.username || !req.body.fatherName) {
        return res.status(400).send("Username and Father's Name are required");
      }

      const findUser = await User.findOne({
        username: req.body.username,
      });

      if (!findUser) {
        return res.status(400).send("Invalid Username");
      }

      // Validate that fatherName exists in user data
      if (!findUser.fatherName) {
        return res.status(400).send("User's Father's Name not found in records");
      }

      // Case-insensitive comparison for father's name
      if (findUser.fatherName.toLowerCase() !== req.body.fatherName.toLowerCase()) {
        return res.status(400).send("Invalid Father's Name");
      }

      return res.status(201).json(findUser);
    } catch (e) {
      console.error("Login error:", e);
      return res.status(500).send("Server Error");
    }
  },
};

export const users = {
  deleteUserProfile: (user) => {
    // Skip deletion if it's the default avatar URL
    if (!user.avatar || user.avatar.startsWith('https://')) {
      return true;
    }

    const filePath = path.join(process.cwd(), "Faces", user.avatar);
    console.log("Attempting to delete image:", filePath);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Successfully deleted image:", filePath);
      } else {
        console.log("Image file not found:", filePath);
      }
      return true;
    } catch (err) {
      console.error("Error deleting profile image:", err);
      return false;
    }
  },
  getUsers: async (req, res) => {
    try {
      const tmp = await User.find();
      return res.status(201).send(tmp);
    } catch (e) {
      return res.status(500).send("Error");
    }
  },
  getUser: async (req, res) => {
    try {
      const tmp = await User.findById(req.params.id);
      return res.status(201).send(tmp);
    } catch (e) {
      console.log(e);
      return res.status(500).send("Error!");
    }
  },
  getUserByName: async (req, res) => {
    try {
      const tmp = await User.find({ username: req.params.id });
      return res.status(201).send(tmp);
    } catch (e) {
      console.log(e);
      return res.status(500).send("Error!");
    }
  },
  delete: async (req, res) => {
    try {
      const tmp = await User.findByIdAndDelete(req.params.id);
      const isPhotoDeleted = users.deleteUserProfile(tmp);
      if (isPhotoDeleted) {
        return res
          .status(201)
          .send("Election and photo file deleted successfully");
      } else {
        return res.status(500).send("Error deleting photo file");
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send("Error!");
    }
  },

  edit: async (req, res) => {
    try {
      const tmp = await User.findById(req.params.id);
      if (!tmp) {
        return res.status(404).send("User not found");
      }

      // Only delete the old profile if a new one is being uploaded
      if (req.files && req.files.profile) {
        const isPhotoDeleted = users.deleteUserProfile(tmp);
        if (!isPhotoDeleted) {
          return res.status(500).send("Error updating User: Could not delete old profile image");
        }

        const profileImage = req.files.profile;
        const facesDir = path.join(process.cwd(), "Faces");
        
        // Ensure the directory exists
        if (!fs.existsSync(facesDir)) {
          fs.mkdirSync(facesDir, { recursive: true });
        }

        // Generate filename using username and original extension
        const fileExt = path.extname(profileImage.name);
        const filename = req.body.username + fileExt;
        const uploadPath = path.join(facesDir, filename);

        // Move the uploaded file
        await profileImage.mv(uploadPath);

        // Update user data with new avatar
        const user = {
          username: req.body.username,
          email: req.body.email,
          mobile: req.body.mobile,
          fname: req.body.fname,
          lname: req.body.lname,
          location: req.body.location,
          dob: req.body.dob,
          voterID: req.body.voterID,
          fatherName: req.body.fatherName,
          avatar: filename
        };

        const updatedUser = await User.findByIdAndUpdate(req.params.id, user, { new: true });
        return res.status(201).json({
          success: true,
          message: "User Updated Successfully",
          user: updatedUser
        });
      } else {
        // Update user without changing avatar
        const user = {
          username: req.body.username,
          email: req.body.email,
          mobile: req.body.mobile,
          fname: req.body.fname,
          lname: req.body.lname,
          location: req.body.location,
          dob: req.body.dob,
          voterID: req.body.voterID,
          fatherName: req.body.fatherName
        };

        const updatedUser = await User.findByIdAndUpdate(req.params.id, user, { new: true });
        return res.status(201).json({
          success: true,
          message: "User Updated Successfully",
          user: updatedUser
        });
      }
    } catch (e) {
      console.error("Error in edit function:", e);
      return res.status(500).json({
        success: false,
        message: "Error processing request",
        error: e.message
      });
    }
  },
};

//Candidate
export const candidateRegister = {
  validator: async (req, res, next) => {
    next();
  },
  controller: async (req, res) => {
    try {
      const candidateData = {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob,
        qualification: req.body.qualification,
        join: req.body.join,
        location: req.body.location,
        description: req.body.description,
        partyName: req.body.partyName
      };

      // Handle file uploads if present
      if (req.files) {
        // Handle profile image
        if (req.files.profileImage) {
          const profileImage = req.files.profileImage;
          const candidateImagesDir = path.join(process.cwd(), "CandidateImages");
          
          // Ensure directory exists
          if (!fs.existsSync(candidateImagesDir)) {
            fs.mkdirSync(candidateImagesDir, { recursive: true });
          }

          const profileImageName = `profile-${Date.now()}${path.extname(profileImage.name)}`;
          await profileImage.mv(path.join(candidateImagesDir, profileImageName));
          candidateData.profileImage = `/CandidateImages/${profileImageName}`;
        }

        // Handle party symbol
        if (req.files.partySymbol) {
          const partySymbol = req.files.partySymbol;
          const partySymbolsDir = path.join(process.cwd(), "PartySymbols");
          
          // Ensure directory exists
          if (!fs.existsSync(partySymbolsDir)) {
            fs.mkdirSync(partySymbolsDir, { recursive: true });
          }

          const partySymbolName = `symbol-${Date.now()}${path.extname(partySymbol.name)}`;
          await partySymbol.mv(path.join(partySymbolsDir, partySymbolName));
          candidateData.partySymbol = `/PartySymbols/${partySymbolName}`;
        }
      }

      const candidate = await Candidate.create(candidateData);
      return res.status(201).json({
        message: "Candidate Added Successfully",
        candidate: candidate
      });
    } catch (error) {
      console.error("Error creating candidate:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};

export const candidates = {
  getCandidates: async (req, res) => {
    const data = await Candidate.find();
    return res.status(201).send(data);
  },
  register: async (req, res) => {
    try {
      // Create base candidate data
      const candidateData = {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob,
        qualification: req.body.qualification,
        join: parseInt(req.body.join),
        location: req.body.location,
        description: req.body.description,
        partyName: req.body.partyName
      };

      // Check if username already exists
      const existingCandidate = await Candidate.findOne({ username: candidateData.username });
      if (existingCandidate) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Handle file uploads if present
      if (req.files) {
        console.log('Files received:', Object.keys(req.files));
        
        // Handle profile image
        if (req.files.profileImage) {
          const profileImage = req.files.profileImage;
          const candidateImagesDir = path.join(process.cwd(), "public", "CandidateImages");
          
          // Ensure directory exists
          if (!fs.existsSync(candidateImagesDir)) {
            fs.mkdirSync(candidateImagesDir, { recursive: true });
          }

          const profileImageName = `profile-${Date.now()}${path.extname(profileImage.name)}`;
          const profileImagePath = path.join(candidateImagesDir, profileImageName);
          
          // Move the uploaded file
          try {
            await profileImage.mv(profileImagePath);
            console.log('Profile image saved to:', profileImagePath);
            candidateData.profileImage = `/CandidateImages/${profileImageName}`;
          } catch (error) {
            console.error('Error saving profile image:', error);
            throw new Error('Failed to save profile image');
          }
        }

        // Handle party symbol
        if (req.files.partySymbol) {
          const partySymbol = req.files.partySymbol;
          const partySymbolsDir = path.join(process.cwd(), "public", "PartySymbols");
          
          // Ensure directory exists
          if (!fs.existsSync(partySymbolsDir)) {
            fs.mkdirSync(partySymbolsDir, { recursive: true });
          }

          const partySymbolName = `symbol-${Date.now()}${path.extname(partySymbol.name)}`;
          const partySymbolPath = path.join(partySymbolsDir, partySymbolName);
          
          // Move the uploaded file
          try {
            await partySymbol.mv(partySymbolPath);
            console.log('Party symbol saved to:', partySymbolPath);
            candidateData.partySymbol = `/PartySymbols/${partySymbolName}`;
          } catch (error) {
            console.error('Error saving party symbol:', error);
            throw new Error('Failed to save party symbol');
          }
        }
      }

      console.log('Creating candidate with data:', candidateData);
      const candidate = await Candidate.create(candidateData);
      
      return res.status(201).json({
        success: true,
        message: "Candidate Added Successfully",
        candidate: candidate
      });
    } catch (error) {
      console.error("Error creating candidate:", error);
      return res.status(500).json({ 
        success: false,
        error: error.message || 'Error creating candidate' 
      });
    }
  },
  edit: async (req, res) => {
    try {
      const candidateData = {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob,
        qualification: req.body.qualification,
        join: req.body.join,
        location: req.body.location,
        description: req.body.description,
        partyName: req.body.partyName
      };

      // Get the existing candidate to handle image updates
      const existingCandidate = await Candidate.findById(req.params.id);
      if (!existingCandidate) {
        return res.status(404).send("Candidate not found");
      }

      // Handle file uploads if present
      if (req.files) {
        // Handle profile image
        if (req.files.profileImage) {
          const profileImage = req.files.profileImage;
          const candidateImagesDir = path.join(process.cwd(), "public", "CandidateImages");
          
          // Ensure directory exists
          if (!fs.existsSync(candidateImagesDir)) {
            fs.mkdirSync(candidateImagesDir, { recursive: true });
          }

          // Delete old profile image if it exists
          if (existingCandidate.profileImage) {
            const oldImagePath = path.join(process.cwd(), "public", existingCandidate.profileImage);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          }

          const profileImageName = `profile-${Date.now()}${path.extname(profileImage.name)}`;
          await profileImage.mv(path.join(candidateImagesDir, profileImageName));
          candidateData.profileImage = `/CandidateImages/${profileImageName}`;
        }

        // Handle party symbol
        if (req.files.partySymbol) {
          const partySymbol = req.files.partySymbol;
          const partySymbolsDir = path.join(process.cwd(), "public", "PartySymbols");
          
          // Ensure directory exists
          if (!fs.existsSync(partySymbolsDir)) {
            fs.mkdirSync(partySymbolsDir, { recursive: true });
          }

          // Delete old party symbol if it exists
          if (existingCandidate.partySymbol) {
            const oldSymbolPath = path.join(process.cwd(), "public", existingCandidate.partySymbol);
            if (fs.existsSync(oldSymbolPath)) {
              fs.unlinkSync(oldSymbolPath);
            }
          }

          const partySymbolName = `symbol-${Date.now()}${path.extname(partySymbol.name)}`;
          await partySymbol.mv(path.join(partySymbolsDir, partySymbolName));
          candidateData.partySymbol = `/PartySymbols/${partySymbolName}`;
        }
      }
      
      const updatedCandidate = await Candidate.findByIdAndUpdate(
        req.params.id,
        candidateData,
        { new: true }
      );
      
      return res.status(200).send(updatedCandidate);
    } catch (error) {
      console.error("Error updating candidate:", error);
      return res.status(500).send("Error updating candidate: " + error.message);
    }
  },
  getCandidate: async (req, res) => {
    const data = await Candidate.findOne({ username: req.params.username });
    if (data == null) {
      return res.status(500).send("Candidate Not Found");
    }
    return res.status(201).send(data);
  },
  getCandidateById: async (req, res) => {
    try {
      const data = await Candidate.findById(req.params.id);
      if (data == null) {
        return res.status(404).send("Candidate Not Found");
      }
      return res.status(200).send(data);
    } catch (e) {
      return res.status(500).send("Error: " + e.message);
    }
  },
  delete: async (req, res) => {
    try {
      // First find the candidate to get image paths
      const candidate = await Candidate.findById(req.params.id);
      if (!candidate) {
        return res.status(404).send("Candidate not found");
      }

      // Delete profile image if exists
      if (candidate.profileImage) {
        const profileImagePath = path.join(process.cwd(), "public", candidate.profileImage);
        if (fs.existsSync(profileImagePath)) {
          fs.unlinkSync(profileImagePath);
        }
      }

      // Delete party symbol if exists
      if (candidate.partySymbol) {
        const partySymbolPath = path.join(process.cwd(), "public", candidate.partySymbol);
        if (fs.existsSync(partySymbolPath)) {
          fs.unlinkSync(partySymbolPath);
        }
      }

      // Delete the candidate from database
      await Candidate.findByIdAndDelete(req.params.id);
      
      return res.status(200).send("Candidate and associated images deleted successfully");
    } catch (error) {
      console.error("Error deleting candidate:", error);
      return res.status(500).send("Error deleting candidate: " + error.message);
    }
  },
};

export const phase = {
  controller: async (req, res) => {
    try {
      // Create update object with all the fields from the request
      const updateData = {
        currentPhase: req.body.currentPhase
      };
      
      // Add name to update if provided
      if (req.body.name) {
        updateData.name = req.body.name;
      }
      
      // Add candidates to update if provided
      if (req.body.candidates) {
        updateData.candidates = req.body.candidates;
      }
      
      // Update the election with all the provided fields
      const updatedElection = await Election.findByIdAndUpdate(
        req.params.id, 
        updateData,
        { new: true }
      );
      
      if (!updatedElection) {
        return res.status(404).send("Election not found");
      }
      
      return res.status(200).send(updatedElection);
    } catch (error) {
      console.error("Error updating election phase:", error);
      return res.status(500).send("Error updating election: " + error.message);
    }
  },
};

//Election

export const elections = {
  controller: async (req, res) => {
    try {
      const tmp = await Election.find();
      return res.status(201).send(tmp);
    } catch (e) {
      return res.status(500).send("Error");
    }
  },
  register: async (req, res) => {
    try {
      const newElection = await Election.create({
        name: req.body.name,
        candidates: req.body.candidates,
        location: req.body.location,
      });
      return res.status(201).send("Election Successfully Added");
    } catch (e) {
      return res.status(500).send("Internal Error" + e);
    }
  },
  getElection: async (req, res) => {
    try {
      const data = await Election.findById(req.params.id);
      return res.status(201).send(data);
    } catch (e) {
      return res.status(500).send("Error");
    }
  },
  voting: async (req, res) => {
    try {
      const tmp = await Election.find({ currentPhase: "voting" });
      return res.status(201).send(tmp);
    } catch (e) {
      return res.status(500).send("Error");
    }
  },
  result: async (req, res) => {
    try {
      const tmp = await Election.find({ currentPhase: "result" });
      return res.status(201).send(tmp);
    } catch (e) {
      return res.status(500).send("Error");
    }
  },
  delete: async (req, res) => {
    try {
      const tmp = await Election.findByIdAndDelete(req.params.id);
      return res.status(201).send("Election Deleted Successfully");
    } catch (e) {
      return res.status(500).send("Error");
    }
  },
};

const sendMail = async (mailContent, mailSubject, user) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAILPASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: mailSubject,
    text: mailContent,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
};

export const a = {
  sc: async (req, res) => {
    const filePath = path.resolve(process.cwd(), "Controller", "fr.py");
    
    try {
      // Check if the Faces directory exists and has files
      const facesDir = path.resolve(process.cwd(), "Faces");
      if (!fs.existsSync(facesDir) || fs.readdirSync(facesDir).length === 0) {
        return res.status(400).send("No face data available. Please add user profile images first.");
      }
      
      // Set options for Python shell
      const options = {
        mode: 'text',
        pythonPath: 'python', // Make sure this matches your Python executable
        pythonOptions: ['-u'], // unbuffered output
      };
      
      PythonShell.run(filePath, options, function (err, result) {
        console.log("Python result:", result);
        console.log("Python error:", err);
        
        if (err) {
          console.error("Error running facial recognition:", err);
          
          // Check for specific error messages
          if (err.message && err.message.includes("Could not open camera")) {
            return res.status(500).send("Could not access camera. Please check your camera connection.");
          } else if (err.message && err.message.includes("No face detected")) {
            return res.status(400).send("No face detected. Please position yourself properly in front of the camera.");
          } else if (err.message && err.message.includes("No matching face found")) {
            return res.status(400).send("Your face doesn't match any registered user.");
          } else {
            return res.status(500).send("Error while running facial recognition: " + err.message);
          }
        }

        if (result && result.length > 0) {
          // Filter out warning messages and find the actual result
          const actualResult = result.filter(line => !line.startsWith("Warning:") && !line.startsWith("Loaded"));
          
          if (actualResult.length > 0) {
                          // Parse the enhanced results (format: "username|confidence|status")
            try {
              const [username, confidenceStr, status] = actualResult[0].split('|');
              const confidence = parseFloat(confidenceStr);
              
              // Create metadata while keeping backward compatibility
              const metadata = {
                username,
                confidence,
                status,
                verified: status === "verified"
              };
              
              console.log("Face recognition result:", metadata);
              
              // Always return successful result with username regardless of status
              return res.status(201).send(username);
            } catch (parseError) {
              // Fallback to old behavior if parsing fails
              return res.status(201).send(actualResult);
            }
          } else {
            return res.status(400).send("Face recognition completed but no match was found.");
          }
        } else {
          return res.status(400).send("No face detected or matched. Please check your camera and try again.");
        }
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).send("Unexpected error: " + error.message);
    }
  },
};

//Voting Mail

export const votingMail = {
  send: async (req, res) => {
    const mailContent =
      "Thank You For The Voting but if it's not you contact admin@votingsystem.com";

    const mailSubject = "Voting Success";

    const findUser = await User.findOne({ _id: req.body.id });

    if (sendMail(mailContent, mailSubject, findUser)) {
      return res.status(201).send("Email Sent");
    } else {
      return res.status(301).send("Email Sending Failed");
    }
  },
};

const processCSVData = (csvData) => {
  return new Promise((resolve, reject) => {
    const records = [];
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    parser.on('readable', function() {
      let record;
      while ((record = parser.read()) !== null) {
        // Remove any extra spaces from strings
        Object.keys(record).forEach(key => {
          if (typeof record[key] === 'string') {
            record[key] = record[key].trim();
          }
        });

        // Convert DD-MM-YYYY to Date object
        if (record.dob) {
          try {
            const [day, month, year] = record.dob.split('-').map(num => parseInt(num, 10));
            record.dob = new Date(year, month - 1, day);
          } catch (error) {
            console.error('Date parsing error:', error);
            record.dob = record.dob;
          }
        }

        records.push(record);
      }
    });

    parser.on('error', function(err) {
      reject(err);
    });

    parser.on('end', function() {
      resolve(records);
    });

    // Write data to the parser
    parser.write(csvData);
    parser.end();
  });
};

export const downloadUserTemplate = {
  controller: async (req, res) => {
    try {
      // Fix the path to go up one level from the server directory to the project root
      const templatePath = path.join(process.cwd(), '..', 'template', 'voter_data.csv');
      
      // Set headers to force download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=voter_template.csv');

      // Send the file
      res.sendFile(templatePath, (err) => {
        if (err) {
          console.error('Error sending template file:', err);
          res.status(500).json({ message: 'Error downloading template' });
        }
      });
    } catch (error) {
      console.error('Error downloading template:', error);
      res.status(500).json({ message: 'Error downloading template' });
    }
  }
};

export const downloadCandidateTemplate = {
  controller: async (req, res) => {
    try {
      // Path to the candidate template file
      const templatePath = path.join(process.cwd(), '..', 'template', 'candidate_data.csv');
      
      // Set headers to force download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=candidate_template.csv');

      // Send the file
      res.sendFile(templatePath, (err) => {
        if (err) {
          console.error('Error sending candidate template file:', err);
          res.status(500).json({ message: 'Error downloading candidate template' });
        }
      });
    } catch (error) {
      console.error('Error downloading candidate template:', error);
      res.status(500).json({ message: 'Error downloading candidate template' });
    }
  }
};

export const uploadCandidates = {
  controller: async (req, res) => {
    if (!req.files || !req.files.csv) {
      return res.status(400).json({ message: 'No CSV file uploaded' });
    }

    const results = {
      success: [],
      errors: []
    };

    try {
      // Process CSV data
      const csvData = req.files.csv.data.toString('utf8');
      const records = await processCSVData(csvData);

      // Process each record
      for (const record of records) {
        try {
          // Validate required fields
          const requiredFields = ['username', 'firstName', 'lastName', 'dob', 'qualification', 'join', 'location', 'partyName'];
          const missingFields = requiredFields.filter(field => !record[field]);
          
          if (missingFields.length > 0) {
            results.errors.push({ 
              row: records.indexOf(record) + 2, 
              error: `Missing required fields: ${missingFields.join(', ')}`,
              data: record
            });
            continue;
          }

          // Create candidate if all validations pass
          const candidateData = {
            username: record.username,
            firstName: record.firstName,
            lastName: record.lastName,
            dob: record.dob,
            qualification: record.qualification,
            join: parseInt(record.join) || new Date().getFullYear(),
            location: record.location,
            description: record.description || '',
            partyName: record.partyName
          };

          // Check if candidate username already exists
          const existingCandidate = await Candidate.findOne({ username: candidateData.username });
          if (existingCandidate) {
            results.errors.push({
              row: records.indexOf(record) + 2,
              error: 'Candidate with this username already exists',
              data: record
            });
            continue;
          }

          const candidate = await Candidate.create(candidateData);
          results.success.push({
            username: candidate.username,
            name: `${candidate.firstName} ${candidate.lastName}`
          });
        } catch (error) {
          console.error('Error saving candidate:', error);
          results.errors.push({
            row: records.indexOf(record) + 2,
            error: error.message,
            data: record
          });
        }
      }

      return res.status(200).json(results);
    } catch (error) {
      console.error('Error processing candidate upload:', error);
      return res.status(500).json({ message: 'Error processing candidate upload', error: error.message });
    }
  }
};

export const uploadUsers = {
  controller: async (req, res) => {
    if (!req.files || (!req.files.zip && !req.files.csv)) {
      return res.status(400).json({ message: 'No ZIP or CSV file uploaded' });
    }

    const results = {
      success: [],
      errors: []
    };

    try {
      let records = [];
      let imageFiles = {};

      // Handle ZIP file if present
      if (req.files.zip) {
        const zip = new AdmZip(req.files.zip.data);
        const zipEntries = zip.getEntries();

        // Find and process CSV file first
        const csvEntry = zipEntries.find(entry => entry.entryName.toLowerCase().endsWith('.csv'));
        if (!csvEntry) {
          return res.status(400).json({ message: 'No CSV file found in ZIP' });
        }

        const csvData = csvEntry.getData().toString('utf8');
        records = await processCSVData(csvData);

        // Process images
        console.log("Processing ZIP entries:", zipEntries.map(e => e.entryName));
        zipEntries.forEach(entry => {
          if (entry.entryName.match(/\.(jpg|jpeg|png)$/i)) {
            const username = path.basename(entry.entryName).split('.')[0].toLowerCase();
            console.log("Found image for username:", username);
            imageFiles[username] = entry.getData();
          }
        });
        console.log("Processed image files for usernames:", Object.keys(imageFiles));
      } else if (req.files.csv) {
        const csvData = req.files.csv.data.toString('utf8');
        records = await processCSVData(csvData);
      }

      // Process each record
      for (const record of records) {
        try {
          // Validate required fields
          const requiredFields = ['username', 'fname', 'lname', 'email', 'mobile', 'voterID', 'fatherName', 'dob', 'location'];
          const missingFields = requiredFields.filter(field => !record[field]);
          
          if (missingFields.length > 0) {
            results.errors.push({ 
              row: records.indexOf(record) + 2, 
              error: `Missing required fields: ${missingFields.join(', ')}`,
              data: record
            });
            continue;
          }

          // Validate voterID format (alphanumeric, 10 characters)
          if (!/^[A-Z0-9]{10}$/.test(record.voterID)) {
            results.errors.push({ 
              row: records.indexOf(record) + 2, 
              error: `Invalid Voter ID format. Must be 10 characters long and contain only uppercase letters and numbers.`,
              data: record
            });
            continue;
          }

          // Create user if all validations pass
          const user = new User({
            username: record.username,
            fname: record.fname,
            lname: record.lname,
            email: record.email,
            mobile: record.mobile,
            voterID: record.voterID,
            fatherName: record.fatherName,
            dob: record.dob,
            location: record.location
          });
          
          // If we have an image for this user
          if (imageFiles[record.username]) {
            const facesDir = path.join(process.cwd(), "Faces");
            console.log("Processing image for user:", record.username);
            console.log("Available image files:", Object.keys(imageFiles));
            
            if (!fs.existsSync(facesDir)) {
              fs.mkdirSync(facesDir, { recursive: true });
            }
            
            const fileName = `${record.username}.jpg`;
            const imagePath = path.join(facesDir, fileName);
            console.log("Saving image to:", imagePath);
            
            try {
              fs.writeFileSync(imagePath, imageFiles[record.username]);
              user.avatar = fileName;
              console.log("Successfully saved image for:", record.username);
            } catch (error) {
              console.error("Error saving image:", error);
              results.errors.push({
                row: records.indexOf(record) + 2,
                error: `Error saving image: ${error.message}`,
                data: record
              });
            }
          }

          await user.save();
          results.success.push(record.username);
        } catch (error) {
          console.error('Error saving user:', error);
          // Enhance error message based on the type of error
          let errorMessage = error.message;
          if (error.code === 11000) {
            errorMessage = 'Duplicate entry found. Username, email, mobile, or Voter ID already exists.';
          }
          
          results.errors.push({
            row: records.indexOf(record) + 2,
            error: errorMessage,
            data: record
          });
        }
      }

      return res.status(200).json(results);
    } catch (error) {
      console.error('Error processing upload:', error);
      return res.status(500).json({ message: 'Error processing upload', error: error.message });
    }
  }
};
