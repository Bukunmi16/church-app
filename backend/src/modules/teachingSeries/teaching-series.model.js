import mongoose from "mongoose";

const TeachingSeriesSchema = new mongoose.Schema(
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

    thumbnail: {
      url: {
        type: String,
        default: 'https://res.cloudinary.com/jkjwwa8p/image/upload/v1788384142/rhema-logo.jpg'
      },
      publicId: {
        type: String,
        default: null
      }
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true
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

const TeachingSeries = mongoose.model( "TeachingSeries", TeachingSeriesSchema);

export default TeachingSeries;