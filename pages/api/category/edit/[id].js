import nc from 'next-connect';
import slugify from 'slugify';
import Categories from '../../../../models/Category';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { getError } from '../../../../utils/error';
import {
  deleteCloudinaryImage,
  viewCloudinaryImage,
} from '../../cloudinary/cloudinary-config';

const handler = nc();

handler.use(isAuth);

handler.get(async (req, res) => {
  try {
    db.connect();
    const category = await Categories.findById({ _id: req.query.id });

    // Fetch images from cloudinary
    const updatedImages = category.image.map(file => viewCloudinaryImage(file));

    const cloudinaryImages = await Promise.all(updatedImages);
    category.image = cloudinaryImages;

    res.send(category);
    db.disconnect();
  } catch (err) {
    res.status(404).send(getError(err));
  }
});

handler.put(async (req, res) => {
  try {
    await db.connect();
    const { removedCatImage } = req.body;

    console.log(req.file);

    // Remove images from cloudinary
    removedCatImage.map(removeImg => {
      const removeImageArr = removeImg.split('/');
      const publicId = removeImageArr[removeImageArr.length - 1];
      deleteCloudinaryImage(publicId);
      return null;
    });

    const updateCategory = await Categories.findByIdAndUpdate(
      {
        _id: req.query.id,
      },
      {
        name: req.body.category,
        slug: slugify(req.body.category),
        description: req.body.description,
        image: req.body.image,
      }
    ).exec();

    res.send({
      data: updateCategory,
      message: 'Category Updated Successfully',
    });
    await db.disconnect();
  } catch (err) {
    res.status(404).send(err);
  }
});

export default handler;
