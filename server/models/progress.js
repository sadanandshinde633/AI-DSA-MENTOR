import mongoose from "mongoose";

const progressSchema =
  new mongoose.Schema({
    userId: String,

    problemId: String,

    solved: {
      type: Boolean,
      default: false
    },

    hintLevel: Number,

    code: String,

    topics: [String]
  });

const Progress = mongoose.model(
  "Progress",
  progressSchema
);

export default Progress;