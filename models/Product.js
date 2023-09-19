import mongoose from 'mongoose';
// eslint-disable-next-line no-unused-vars, import/no-cycle
import Categories from './Category';

// const { ObjectId } = mongoose.Schema;
function countWords(str) {
  const regex = new RegExp(/<([^>]+)>/, 'gi');
  const replacedString = str.replace(regex, '');
  return replacedString.trim().split(/\s+/).length;
}

// create a Mongoose Schema
const ProductSchema = new mongoose.Schema(
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
      minLength: 5,
      maxLength: 124,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxLength: 200,
      text: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 5,
      // maxLength: 10000,
      validate: [
        {
          validator(val) {
            return countWords(val) <= 1000;
          },
          message: 'Description can not exceed 1000 words',
        },
      ],
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxLength: 32,
    },
    categories: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categories',
      required: true,
    },
    subcategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true,
      },
    ],
    images: { type: Array, required: true },
    shipping: { type: String, enum: ['Yes', 'No'] },
    color: { type: String, required: true },
    brand: { type: String, required: true },
    numReviews: { type: Number },
    totalRating: { type: Number },
    reviews: [
      {
        name: { type: String, required: true, minLength: 5, maxLength: 40 },
        comment: { type: String, required: true, minLength: 5, maxLength: 200 },
        rating: { type: Number, required: true, min: 1, max: 5 },
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
        postedDate: { type: Date, default: Date.now },
      },
    ],
    size: { type: String, required: true },
    countInStock: { type: Number, required: true },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// create a mongoose model
const Product =
  mongoose?.models?.Product || mongoose?.model('Product', ProductSchema);

export default Product;
