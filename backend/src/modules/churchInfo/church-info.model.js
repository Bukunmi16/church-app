import mongoose from "mongoose";

const ChurchInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    motto: {
      type: String,
      trim: true,
    },

    logo: {
      url: {
        type: String,
        trim: true,
      },
      publicId: {
        type: String,
        trim: true,
      },
    },

    address: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    website: {
      type: String,
      trim: true,
    },

    socialLinks: {
      facebook: {
        type: String,
        trim: true,
      },

      instagram: {
        type: String,
        trim: true,
      },

      youtube: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const ChurchInformation = mongoose.model("ChurchInformation", ChurchInfoSchema);

export default ChurchInformation;