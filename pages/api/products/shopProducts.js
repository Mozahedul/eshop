import nc from 'next-connect';
import db from '../../../utils/db';
import Product from '../../../models/Product';
import { viewCloudinaryImage } from '../cloudinary/cloudinary-config';

const handler = nc();

handler.get(async (req, res) => {
  try {
    db.connect();
    const strToArray = req.query.priceArr.split(',');
    const strArrToNumb = strToArray.map(item => parseInt(item, 10));
    const products = await Product.find({
      price: { $gte: strArrToNumb[0], $lte: strArrToNumb[1] },
    });

    // Fetch products from cloudinary
    const modifiedProducts = await Promise.all(
      products.map(async product => {
        const cloudPromise = product.images.map(async image => {
          const cloudImage = viewCloudinaryImage(image);
          return cloudImage;
        });

        const cloudinaryImages = await Promise.all(cloudPromise);
        return { ...product.toObject(), images: cloudinaryImages };
      })
    );

    // db.disconnect();

    if (res.statusCode >= 200 && res.statusCode <= 299) {
      res.send(modifiedProducts);
    } else {
      res.send({ errMsg: 'Something went wrong on the server' });
    }
  } catch (error) {
    res.send(error);
  }
});

export default handler;
