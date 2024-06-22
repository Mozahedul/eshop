import fs from 'fs';
import nc from 'next-connect';
// import sharp from 'sharp';
import slugify from 'slugify';
// import { v4 as uuidv4 } from 'uuid';
import Product from '../../../models/Product';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
// import { getError } from '../../../utils/error';
import upload from '../cloudinary/multer-multi-files';
import uploadImage from '../cloudinary/cloudinary-config';

const handler = nc();
export const config = {
  api: {
    bodyParser: false,
  },
};

handler.use(isAuth);
handler.post(upload.array('avatar', 10), async function (req, res) {
  try {
    await db.connect();
    const {
      title,
      shortDescription,
      description,
      category,
      brand,
      color,
      countInStock,
      price,
      shipping,
      productShipping,
      size,
      sold,
    } = req.body;
    // console.log(req.body);
    // check the product in database; exist or not
    const existProduct = await Product.findOne({
      slug: slugify(title),
    });

    if (!existProduct) {
      const uploadPromises = req.files.map(async file => {
        try {
          // Send multer processed images to uploadImage function
          // for sending to cloudinary
          const publicId = await uploadImage(file.path.toString());
          return publicId;
        } catch (error) {
          console.log(error);
          return null;
        }
      });

      // console.log('UPLOAD PROMISES ==> ', uploadPromises);

      // Images returned from cloudinary with public_id
      const cloudImages = await Promise.all(uploadPromises);
      // console.log(cloudImages);

      const product = new Product({
        title,
        description,
        shortDescription,
        brand,
        color,
        countInStock,
        shipping,
        price,
        productShipping,
        size,
        sold,
        categories: category,
        images: cloudImages,
        user: req.user._id,
        slug: slugify(title),
      });

      // Save to database
      await product.save();
      if (res.statusCode >= 200 && res.statusCode <= 299) {
        res.send({ message: 'Product has been added successfully' });
      } else {
        res.send({ errMsg: 'Something went wrong on the server' });
      }

      // Delete the files from local images folder
      req.files.map(file => fs.unlinkSync(file.path));
    } else {
      for (const file of req.files) {
        fs.unlinkSync(file.path);
      }
      res.status(200).send({
        errMessage: 'Product already exist: duplicate entry attempts failed',
      });
    }
    // await db.disconnect();
  } catch (error) {
    setTimeout(() => {
      req.files.forEach(imageFile => fs.unlinkSync(imageFile));
    }, 1000);
    res.send({ errMessage: error.message });
  }
});

export default handler;
