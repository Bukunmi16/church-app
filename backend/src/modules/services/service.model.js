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
        "Interactive Study",
        "Holy Ghost",
        "Thanksgiving",
        "Prayer",
        "Pulpit Exchange",
        "Healing and Communion",
        "Other",
      ],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "Behind Lautech College of Health Sciences, Ogbomoso-Ilorin Expressway, Ogbomoso",
    },

    day: {
      type: String,
      required: true,
      enum: ["Sunday", "Wednesday", "Friday", "Saturday"],
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