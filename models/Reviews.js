import mongoose from 'mongoose';

// product: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'Product',
//   required: true,
// },
const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    reviewerName: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 40,
    },

    comment: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 200,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

const ReviewModel =
  mongoose.models.Review || mongoose.model('Review', ReviewSchema);

export default ReviewModel;
