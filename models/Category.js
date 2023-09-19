import mongoose from 'mongoose';
// eslint-disable-next-line import/no-cycle, no-unused-vars
import Product from './Product';

const CategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    image: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 200,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Categories =
  mongoose?.models?.Categories || mongoose?.model('Categories', CategorySchema);

export default Categories;
