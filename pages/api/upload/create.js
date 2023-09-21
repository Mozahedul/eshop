import fs from 'fs';
import nc from 'next-connect';
import slugify from 'slugify';
import Category from '../../../models/Category';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import { getError } from '../../../utils/error';
import upload from '../cloudinary/multer-multi-files';
import uploadImage from '../cloudinary/cloudinary-config';

const handler = nc();

export const config = {
  api: {
    bodyParser: false,
  },
};

handler.use(isAuth);
handler.post(upload.array('avatar', 6), async function (req, res) {
  try {
    await db.connect();
    // Check the category already exists or not
    const categoryExist = await Category.findOne({
      slug: slugify(req.body.category),
    });

    if (!categoryExist) {
      const cloudPromise =
        Array.isArray(req.files) &&
        req?.files?.map(async file => {
          console.log('FILE INSIDE MAP ==> ', file);
          const publicId = await uploadImage(file.path);
          return publicId;
        });

      const updatedCloudImages = await Promise.all(cloudPromise);

      const categoryInstance = new Category({
        name: req.body.category,
        slug: slugify(req.body.category),
        user: req.user._id,
        description: req.body.description,
        image: updatedCloudImages,
      });
      const categoryData = await categoryInstance.save();

      // send success message to frontend
      if (res.statusCode >= 200 && res.statusCode <= 299) {
        res.send({
          data: categoryData,
          message: 'Category added successfully',
        });
        setTimeout(() => {
          req.files.map(file => fs.unlinkSync(file.path));
        }, 2000);
      } else {
        res.send({ errMsg: 'Category not inserted' });
        setTimeout(() => {
          req.files.map(file => fs.unlinkSync(file.path));
        }, 2000);
      }
    } else {
      for (const catImage of req.files) {
        fs.unlinkSync(catImage.path);
      }
      res.status(200).send({
        errMessage: 'Category already exist: duplicate entry attempts failed',
      });
    }
    // await db.disconnect();
  } catch (errors) {
    res.send({ errMessage: `Error from image upload, ${getError(errors)}` });
  }
});

export default handler;
