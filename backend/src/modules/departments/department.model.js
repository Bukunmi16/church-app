import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema (
    {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: null,
    },

    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assistants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    workers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Department = mongoose.model("Department", DepartmentSchema)

export default Department