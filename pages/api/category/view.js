import nc from 'next-connect';
import Categories from '../../../models/Category';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import { getError } from '../../../utils/error';
import { viewCloudinaryImage } from '../cloudinary/cloudinary-config';

const handler = nc();

handler.use(isAuth);
handler.get(async (req, res) => {
  try {
    await db.connect();
    const categories = await Categories.find({})
      .sort([['createdAt', 'desc']])
      .exec();
    await db.disconnect();

    // Fetch category images from cloudinary
    const updateCategories = await Promise.all(
      categories.map(async category => {
        const cloudPromise = category.image.map(file => {
          const cloudImageUrl = viewCloudinaryImage(file);
          return cloudImageUrl;
        });

        const cloudinaryImages = await Promise.all(cloudPromise);
        return { ...category.toObject(), image: cloudinaryImages };
      })
    );

    if (res.statusCode >= 200 && res.statusCode <= 299) {
      res.send(updateCategories);
    } else {
      res.send({ errMsg: 'Something went wrong on the server' });
    }
  } catch (err) {
    res.status(404).send(getError(err));
  }
});

export default handler;
