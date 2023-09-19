import nc from 'next-connect';
// import CategoryModel from '../../models/Category';
// import Product from '../../models/Product';
// import SubCategoryModel from '../../models/SubCategory';
import UserModel from '../../models/User';
import data from '../../utils/data';
import db from '../../utils/db';

// create handler with next-connect NPM package
const handler = nc();

// handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  // Delete data from database
  // await UserModel.deleteMany();
  // await SubCategoryModel.deleteMany();
  // await CategoryModel.deleteMany();
  // await Product.deleteMany();

  // Insert data into database
  await UserModel.insertMany(data.users);
  // await CategoryModel.insertMany(data.category);
  // await SubCategoryModel.insertMany(data.subcategory);
  // await Product.insertMany(data.products);
  await db.disconnect();
  res.send({ message: 'Data inserted into database successfully' });
});

export default handler;
