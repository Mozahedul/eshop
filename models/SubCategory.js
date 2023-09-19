import mongoose from 'mongoose';
import Categories from './Category';

const SubCategorySchema = new mongoose.Schema(
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
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categories',
    },
  },
  { timestamps: true }
);

const Subcategories =
  mongoose.models.Subcategories ||
  mongoose.model('Subcategories', SubCategorySchema);

export default Subcategories;
