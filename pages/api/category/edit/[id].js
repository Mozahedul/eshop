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

/**
 * @method GET
 * @param {request, response}
 * @return fetch category and send to the client
 */
handler.get(async (req, res) => {
  try {
    db.connect();
    const category = await Categories.findById({ _id: req.query.id });

    // Fetch images from cloudinary
    const updatedImages = category.image.map(file => viewCloudinaryImage(file));

    const cloudinaryImages = await Promise.all(updatedImages);
    category.image = cloudinaryImages;

    // Send category to client
    if (res.statusCode >= 200 && res.statusCode <= 299) {
      res.send(category);
    } else {
      res.send({ errMsg: 'Something went wrong on the server' });
    }
    db.disconnect();
  } catch (err) {
    res.send({ errMsg: err.message });
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

    if (res.statusCode >= 200 && res.statusCode <= 299) {
      res.send({
        data: updateCategory,
        message: 'Category Updated Successfully',
      });
    } else {
      res.send({ errMsg: 'Something went wrong on the server' });
    }
    await db.disconnect();
  } catch (err) {
    res.status(404).send(err);
  }
});

export default handler;
