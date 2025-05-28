import express from 'express';
import Election from '../Models/Election.js';
import Vote from '../models/Vote.js';
import User from '../Models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// Record a vote and update age demographics
router.post('/:id/record-vote', async (req, res) => {
  try {
    const electionId = req.params.id;
    const { voterId } = req.body;

    // Get voter's age from User model
    const voter = await User.findById(voterId);
    if (!voter || !voter.dob) {
      return res.status(400).json({ message: 'Voter information not found' });
    }

    // Calculate voter's age
    const age = calculateAge(voter.dob);
    
    // Update vote count and age demographics
    await Vote.create({
      electionId: new mongoose.Types.ObjectId(electionId),
      voterId: new mongoose.Types.ObjectId(voterId),
      candidateId: new mongoose.Types.ObjectId(req.body.candidateId),
      voterAge: age
    });

    res.json({ message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ message: 'Error recording vote', error: error.message });
  }
});

// Get voter demographics for an election
router.get('/:id/voter-demographics', async (req, res) => {
  try {
    const electionId = req.params.id;
    console.log('Fetching demographics for election:', electionId);
    
    // Get all votes for this election
    const votes = await Vote.find({ 
      electionId: new mongoose.Types.ObjectId(electionId) 
    }).lean(); // Use lean() for better performance

    console.log('Total votes found:', votes.length);
    console.log('Sample vote:', votes[0]); // Log a sample vote for debugging

    // Initialize age distribution object
    const ageDistribution = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56+': 0
    };

    // Use the stored voterAge to update distribution
    votes.forEach(vote => {
      const age = vote.voterAge;
      console.log('Processing vote with age:', age);
      
      if (age >= 18 && age <= 25) ageDistribution['18-25']++;
      else if (age <= 35) ageDistribution['26-35']++;
      else if (age <= 45) ageDistribution['36-45']++;
      else if (age <= 55) ageDistribution['46-55']++;
      else if (age >= 56) ageDistribution['56+']++;
    });

    console.log('Final age distribution:', ageDistribution);
    res.json({ ageDistribution });
  } catch (error) {
    console.error('Error fetching voter demographics:', error);
    res.status(500).json({ 
      message: 'Error fetching voter demographics', 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Get voter statistics for an election
router.get('/:id/voter-stats', async (req, res) => {
  try {
    const electionId = req.params.id;
    
    // Get total registered users (all users are potential voters)
    const totalRegisteredVoters = await User.countDocuments();
    
    // Get total votes cast for this election from the database
    const dbVotesCast = await Vote.countDocuments({
      electionId: new mongoose.Types.ObjectId(electionId)
    });

    // Get the election details to match with blockchain data
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    res.json({
      totalRegisteredVoters,
      totalVotesCast: dbVotesCast
    });
  } catch (error) {
    console.error('Error fetching voter statistics:', error);
    res.status(500).json({ 
      message: 'Error fetching voter statistics', 
      error: error.message 
    });
  }
});

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

export default router; 