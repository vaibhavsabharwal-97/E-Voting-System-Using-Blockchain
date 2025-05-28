import express from 'express';
import Vote from '../models/Vote.js';
import User from '../Models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// Helper function to ensure ObjectId
function toObjectId(id) {
  try {
    return mongoose.Types.ObjectId.isValid(id) ? 
      (id instanceof mongoose.Types.ObjectId ? id : new mongoose.Types.ObjectId(id)) 
      : null;
  } catch (error) {
    console.error('Error converting to ObjectId:', error);
    return null;
  }
}

// Helper function to calculate age from DOB
function calculateAge(dob) {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Save a vote
router.post('/', async (req, res) => {
  try {
    const { electionId, voterId, candidateId } = req.body;
    console.log('Received vote data:', { electionId, voterId, candidateId });

    // Convert IDs to ObjectId
    const electionObjId = toObjectId(electionId);
    const voterObjId = toObjectId(voterId);
    const candidateObjId = toObjectId(candidateId);

    if (!electionObjId || !voterObjId || !candidateObjId) {
      console.error('Invalid ID format:', { electionId, voterId, candidateId });
      return res.status(400).json({ message: 'Invalid ID format provided' });
    }

    // Get voter's age from User model
    const voter = await User.findById(voterObjId);
    if (!voter || !voter.dob) {
      console.error('Voter not found or missing DOB:', voterId);
      return res.status(400).json({ message: 'Voter information not found or incomplete' });
    }

    // Calculate voter's age
    const voterAge = calculateAge(voter.dob);
    console.log('Calculated voter age:', voterAge);
    
    // Check if vote already exists
    const existingVote = await Vote.findOne({
      electionId: electionObjId,
      voterId: voterObjId
    });

    if (existingVote) {
      console.log('Vote already exists for this voter in this election');
      return res.status(400).json({ message: 'User has already voted in this election' });
    }
    
    // Create new vote with age
    const vote = new Vote({
      electionId: electionObjId,
      voterId: voterObjId,
      candidateId: candidateObjId,
      voterAge
    });
    
    console.log('Attempting to save vote:', vote);
    
    try {
      // Save vote to database
      const savedVote = await vote.save();
      console.log('Vote saved successfully:', savedVote);
      
      // Verify the vote was saved by fetching it back
      const verifiedVote = await Vote.findById(savedVote._id);
      if (!verifiedVote) {
        throw new Error('Vote was not found after saving');
      }
      console.log('Vote verified in database:', verifiedVote);
      
      res.status(201).json({ 
        message: 'Vote saved successfully',
        vote: {
          id: savedVote._id,
          voterAge: savedVote.voterAge
        }
      });
    } catch (error) {
      console.error('Error during vote save operation:', error);
      if (error.name === 'ValidationError') {
        console.error('Validation error details:', error.errors);
        res.status(400).json({
          message: 'Invalid vote data',
          errors: Object.values(error.errors).map(err => err.message)
        });
      } else {
        console.error('Database error details:', error);
        res.status(500).json({ 
          message: 'Error saving vote',
          error: error.message,
          stack: error.stack
        });
      }
    }
  } catch (error) {
    console.error('Error in vote route:', error);
    res.status(500).json({ 
      message: 'Error processing vote',
      error: error.message,
      stack: error.stack
    });
  }
});

// Add a route to verify votes for debugging
router.get('/verify/:voterId/:electionId', async (req, res) => {
  try {
    const { voterId, electionId } = req.params;
    const voterObjId = toObjectId(voterId);
    const electionObjId = toObjectId(electionId);
    
    if (!voterObjId || !electionObjId) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const vote = await Vote.findOne({
      voterId: voterObjId,
      electionId: electionObjId
    });
    
    res.json({
      voteFound: !!vote,
      vote: vote
    });
  } catch (error) {
    console.error('Error verifying vote:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 