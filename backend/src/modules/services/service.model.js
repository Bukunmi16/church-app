import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    theme: {
      type: String,
      required: true,
      trim: true,
    },
    preacher: {
      type: String,
      required: true,
      trim: true,
    },

    serviceImage: {
      url: {
        type: String,
        default: null
      },
      publicId: {
        type: String,
        default: null
      }
    },
    
    serviceType: {
      type: String,
      required: true,
      enum: [
        "Teaching",
        "Celebration",
        "Holy Ghost",
        "Thanksgiving",
        "Prayer",
        "Pulpit Exchange",
        "Holy Communion",
        "Other",
      ],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    day: {
      type: String,
      required: true,
      enum: ["Sunday", "Wednesday", "Friday"],
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;