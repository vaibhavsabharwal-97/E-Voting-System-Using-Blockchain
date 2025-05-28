import express from 'express';
import Candidate from '../Models/Candidate.js';
import Feedback from '../Models/Feedback.js';
import User from '../Models/User.js';
import Election from '../Models/Election.js';
import mongoose from 'mongoose';

const router = express.Router();

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// POST /feedback/like - Add like feedback for a candidate
router.post('/like', async (req, res) => {
  try {
    const { candidateId, userId, electionId } = req.body;

    // Validate required fields
    if (!candidateId || !isValidObjectId(candidateId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid candidate ID is required' 
      });
    }

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid user ID is required' 
      });
    }

    if (!electionId || !isValidObjectId(electionId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid election ID is required' 
      });
    }

    // Verify candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ 
        success: false, 
        message: 'Candidate not found' 
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Verify election exists
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ 
        success: false, 
        message: 'Election not found' 
      });
    }

    // Check if user has already given feedback for this candidate in this election
    const existingFeedback = await Feedback.findOne({
      candidateId,
      userId,
      electionId
    });

    if (existingFeedback) {
      return res.status(400).json({ 
        success: false, 
        message: `You have already given ${existingFeedback.feedbackType} feedback for this candidate in this election` 
      });
    }

    // Create new feedback record
    const feedback = new Feedback({
      candidateId,
      userId,
      electionId,
      feedbackType: 'like'
    });

    await feedback.save();

    // Update candidate's like count
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    res.json({ 
      success: true, 
      message: 'Like added successfully',
      likes: updatedCandidate.likes,
      candidateName: `${candidate.firstName} ${candidate.lastName || ''}`.trim()
    });
  } catch (error) {
    console.error('Error adding like:', error);
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ 
        success: false, 
        message: 'You have already given feedback for this candidate in this election' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// POST /feedback/dislike - Add dislike feedback for a candidate
router.post('/dislike', async (req, res) => {
  try {
    const { candidateId, userId, electionId } = req.body;

    // Validate required fields
    if (!candidateId || !isValidObjectId(candidateId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid candidate ID is required' 
      });
    }

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid user ID is required' 
      });
    }

    if (!electionId || !isValidObjectId(electionId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid election ID is required' 
      });
    }

    // Verify candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ 
        success: false, 
        message: 'Candidate not found' 
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Verify election exists
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ 
        success: false, 
        message: 'Election not found' 
      });
    }

    // Check if user has already given feedback for this candidate in this election
    const existingFeedback = await Feedback.findOne({
      candidateId,
      userId,
      electionId
    });

    if (existingFeedback) {
      return res.status(400).json({ 
        success: false, 
        message: `You have already given ${existingFeedback.feedbackType} feedback for this candidate in this election` 
      });
    }

    // Create new feedback record
    const feedback = new Feedback({
      candidateId,
      userId,
      electionId,
      feedbackType: 'dislike'
    });

    await feedback.save();

    // Update candidate's dislike count
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { $inc: { dislikes: 1 } },
      { new: true }
    );

    res.json({ 
      success: true, 
      message: 'Dislike added successfully',
      dislikes: updatedCandidate.dislikes,
      candidateName: `${candidate.firstName} ${candidate.lastName || ''}`.trim()
    });
  } catch (error) {
    console.error('Error adding dislike:', error);
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ 
        success: false, 
        message: 'You have already given feedback for this candidate in this election' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// GET /feedback/stats/:candidateId - Get feedback stats for a candidate
router.get('/stats/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Validate candidateId
    if (!candidateId || !isValidObjectId(candidateId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid candidate ID is required' 
      });
    }

    // Find the candidate
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ 
        success: false, 
        message: 'Candidate not found' 
      });
    }

    res.json({ 
      success: true, 
      candidateId: candidate._id,
      candidateName: `${candidate.firstName} ${candidate.lastName || ''}`.trim(),
      likes: candidate.likes || 0,
      dislikes: candidate.dislikes || 0,
      totalFeedback: (candidate.likes || 0) + (candidate.dislikes || 0)
    });
  } catch (error) {
    console.error('Error getting feedback stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// GET /feedback/user/:userId/election/:electionId - Get user's feedback for an election
router.get('/user/:userId/election/:electionId', async (req, res) => {
  try {
    const { userId, electionId } = req.params;

    // Validate IDs
    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid user ID is required' 
      });
    }

    if (!electionId || !isValidObjectId(electionId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid election ID is required' 
      });
    }

    // Get all feedback from this user for this election
    const userFeedback = await Feedback.find({
      userId,
      electionId
    }).populate('candidateId', 'firstName lastName');

    res.json({ 
      success: true, 
      feedback: userFeedback
    });
  } catch (error) {
    console.error('Error getting user feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

export default router; 