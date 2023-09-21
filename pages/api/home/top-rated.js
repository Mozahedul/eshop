import nc from 'next-connect';
import db from '../../../utils/db';
import Product from '../../../models/Product';
import { viewCloudinaryImage } from '../cloudinary/cloudinary-config';

const handle = nc();

handle.get(async (req, res) => {
  try {
    await db.connect();
    const products = await Product.find().sort({ numReviews: -1 }).limit(5);

    const updatedProducts = await Promise.all(
      products.map(async product => {
        const cloudPromise = product.images.map(image => {
          const cloudImages = viewCloudinaryImage(image);
          return cloudImages;
        });
        const productImages = await Promise.all(cloudPromise);
        return { ...product.toObject(), images: productImages };
      })
    );
    if (res.statusCode >= 200 && res.statusCode <= 299) {
      res.send(updatedProducts);
    } else {
      res.send({ errMsg: 'Something went wrong on the server' });
    }
    await db.disconnect();
  } catch (error) {
    res.send({ errMsg: error.message });
  }
});

export default handle;
