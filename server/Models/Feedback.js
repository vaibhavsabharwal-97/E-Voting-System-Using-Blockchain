import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  feedbackType: {
    type: String,
    enum: ['like', 'dislike'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index to ensure one feedback per user per candidate per election
feedbackSchema.index({ candidateId: 1, userId: 1, electionId: 1 }, { unique: true });

export default mongoose.model("Feedback", feedbackSchema); 