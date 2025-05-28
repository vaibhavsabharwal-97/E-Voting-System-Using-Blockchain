import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'elections',
    required: true
  },
  voterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'candidates',
    required: true
  },
  voterAge: {
    type: Number,
    required: true,
    min: 18,
    validate: {
      validator: function(age) {
        return Number.isInteger(age) && age >= 18;
      },
      message: 'Voter age must be at least 18'
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'votes' // Explicitly set the collection name
});

// Add an index for faster age-based queries
VoteSchema.index({ electionId: 1, voterAge: 1 });

const Vote = mongoose.model("votes", VoteSchema);
export default Vote; 