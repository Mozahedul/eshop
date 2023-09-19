import fs from 'fs';
import nc from 'next-connect';
import slugify from 'slugify';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';
import { getError } from '../../../../utils/error';
import {
  deleteCloudinaryImage,
  viewCloudinaryImage,
} from '../../cloudinary/cloudinary-config';

const handler = nc();

handler.get(async (req, res) => {
  // console.log('REQUEST QUERY ==> ', req.query.id);
  try {
    await db.connect();
    const product = await Product.findById({ _id: req.query.id })
      .populate('categories', 'name')
      .exec();

    // Fetch images from cloudinary using public_id
    const cloudinaryPromise = product.images.map(image => {
      const cloudImages = viewCloudinaryImage(image);
      return cloudImages;
    });

    const cloudinaryImages = await Promise.all(cloudinaryPromise);
    product.images = cloudinaryImages;

    res.send(product);
    await db.disconnect();
  } catch (error) {
    res.send({ errMessage: error });
  }
});

handler.put(async (req, res) => {
  try {
    await db.connect();
    const {
      title,
      shortDescription,
      description,
      categories,
      price,
      images,
      shipping,
      color,
      brand,
      size,
      numReviews,
      countInStock,
      sold,
      removeProductImg,
    } = req.body;

    // Delete images in cloudinary which have been deleted in client side
    removeProductImg.map(removeImg => {
      const imgArr = removeImg.split('/');
      const publicIdFromLink = imgArr[imgArr.length - 1];
      deleteCloudinaryImage(publicIdFromLink);
      return null;
    });

    Product.findByIdAndUpdate(
      { _id: req.query.id },
      {
        title,
        slug: slugify(title),
        shortDescription,
        description,
        categories,
        price,
        images,
        shipping,
        color,
        brand,
        size,
        numReviews,
        countInStock,
        sold,
      }
    ).exec(err => {
      if (!err) {
        res.send({ message: 'Product Updated Successfully' });
        if (removeProductImg && removeProductImg.length > 0) {
          removeProductImg.map(img => fs.unlinkSync(img.path));
        }
      } else {
        res.send({ errMessage: getError(err) });
        removeProductImg.map(img => fs.unlinkSync(img.path));
      }
    });
    await db.disconnect();
  } catch (err) {
    console.log(getError(err));
  }
});

export default handler;
