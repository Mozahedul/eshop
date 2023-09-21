import nc from 'next-connect';
import Product from '../../../models/Product';
import db from '../../../utils/db';
import { viewCloudinaryImage } from '../cloudinary/cloudinary-config';

const handler = nc();

handler.get(async (req, res) => {
  // console.log('BRANDS ==> ', typeof req.query.brand);
  const brandsArr = req.query.brand.split(',');
  // console.log('BRANDS ARRAY ==> ', brandsArr);

  try {
    await db.connect();
    if (req.query.brand) {
      const products = await Product.find({ brand: { $in: brandsArr } });
      const updatedProducts = await Promise.all(
        products.map(async product => {
          const cloudPromise = product.images.map(async image => {
            const cloudImage = viewCloudinaryImage(image);
            return cloudImage;
          });

          const cloudinaryImages = await Promise.all(cloudPromise);
          return { ...product.toObject(), images: cloudinaryImages };
        })
      );
      res.send(updatedProducts);
    } else {
      const products = await Product.find({});
      const updatedProducts = await Promise.all(
        products.map(async product => {
          const cloudPromise = product.images.map(async image => {
            const cloudImage = viewCloudinaryImage(image);
            return cloudImage;
          });

          const cloudinaryImages = await Promise.all(cloudPromise);
          return { ...product.toObject(), images: cloudinaryImages };
        })
      );

      if (res.statusCode >= 200 && res.statusCode <= 299) {
        res.send(updatedProducts);
      } else {
        res.send({ errMsg: 'Something went wrong on the server' });
      }
    }

    // await db.disconnect();
  } catch (error) {
    res.send(error);
  }
});

export default handler;
