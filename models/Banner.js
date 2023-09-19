import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
      maxLength: 60,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    subtitle: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
      maxLength: 100,
    },

    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BannerModel =
  mongoose.models.Banner || mongoose.model('Banner', BannerSchema);

export default BannerModel;
