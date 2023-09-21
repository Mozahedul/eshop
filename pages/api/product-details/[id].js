import nc from 'next-connect';
import db from '../../../utils/db';
import Product from '../../../models/Product';
import { viewCloudinaryImage } from '../cloudinary/cloudinary-config';

const handler = nc();
handler.get(async (req, res) => {
  // console.log(req.query);
  try {
    await db.connect();
    const products = await Product.find()
      .where({ categories: req.query.id })
      .exec();

    const productDetails = await Promise.all(
      products.map(async product => {
        const cloudPromise = product.images.map(async file => {
          const cloudImages = await viewCloudinaryImage(file);
          return cloudImages;
        });

        const fetchCloudImages = await Promise.all(cloudPromise);
        return { ...product.toObject(), images: fetchCloudImages };
      })
    );

    if (res.statusCode >= 200 && res.statusCode <= 299) {
      res.send(productDetails);
    } else {
      res.send({ errMsg: 'Something went wrong on the server' });
    }
    await db.disconnect();
  } catch (error) {
    res.send(error);
  }
});
export default handler;
