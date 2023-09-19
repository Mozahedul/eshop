import nc from 'next-connect';
import slugify from 'slugify';
import Categories from './models/Category';
import { isAuth } from './utils/auth';
import db from './utils/db';
import { getError } from './utils/error';

const handler = nc();
handler.use(isAuth);

// handler.post(async (req, res) => {
export async function categoryCreate(req, res, filesCloudinary) {
  // console.log('FILES CLOUDINARY ==> ', filesCloudinary);
  try {
    await db.connect();
    // Check the category already exists or not
    const categoryExist = await Categories.findOne({
      slug: slugify(req.body.category),
    });

    // console.log('CATEGORY EXIST ==> ', categoryExist);

    if (!categoryExist) {
      // console.log('CREATE CATEGORY ==> ', filesCloudinary);
      // console.log('REQUEST BODY ==> ', req.body);

      const categoryInstance = new Categories({
        name: req.body.category,
        slug: slugify(req.body.category),
        user: req.user._id,
        description: req.body.description,
        image: filesCloudinary,
      });
      const categoryData = await categoryInstance.save();
      await db.disconnect();

      if (categoryData) {
        res.status(201).send({
          category: categoryData,
          message: 'Category added successfully',
        });
      } else {
        res.status(404).send({ errMessage: 'Category not inserted' });
      }
    } else {
      res.send({ errMessage: 'Category already exists' });
    }
  } catch (err) {
    res.send(getError(err));
  }
}

// });

export default handler;
