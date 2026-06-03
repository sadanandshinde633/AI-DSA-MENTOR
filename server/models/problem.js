import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema(
  {
    input: {
      type: String
    },

    output: {
      type: String
    }
  },
  {
    _id: false
  }
);

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    difficulty: {
      type: String,
      required: true,

      enum: [
        "Easy",
        "Medium",
        "Hard"
      ]
    },

    topic: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    constraints: [
      {
        type: String
      }
    ],

    examples: [
      exampleSchema
    ],

    starterCode: {
      type: String,
      default: ""
    },

    solved: {
      type: Boolean,
      default: false
    },

    attempts: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Problem = mongoose.model(
  "Problem",
  problemSchema
);

export default Problem;