import mongoose from "mongoose";

const teachingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    preacher: {
      type: String,
      required: true,
      trim: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },

    series: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeachingSeries",
      default: null,
    },

    videoUrl: {
      type: String,
      default: null,
      trim: true,
    },

    audioUrl: {
      type: String,
      default: null,
      trim: true,
    },

    thumbnail: {
      url: {
        type: String,
        default: null
      },
      publicId: {
        type: String,
        default: null
      }
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Teaching = mongoose.model("Teaching", teachingSchema);

export default Teaching;    