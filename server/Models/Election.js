import mongoose from "mongoose";

const ElectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  candidates: {
    type: Array,
    required: true,
  },
  location: {
    type: String,
    default: "",
  },
  currentPhase: {
    type: String,
    default: "init", //init, registration, voting, result
  },
}, {
  timestamps: true // Add timestamps option
});

const Election = mongoose.model("Election", ElectionSchema);
export default Election;
