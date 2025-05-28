import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    dob: {
      type: Date,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    join: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    partySymbol: {
      type: String, // URL to the party symbol image
    },
    partyName: {
      type: String, // Name of the political party
    },
    profileImage: {
      type: String, // URL to the candidate's profile image
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", CandidateSchema);
export default Candidate;
