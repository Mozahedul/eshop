import nc from 'next-connect';
import Product from '../../../models/Product';
import db from '../../../utils/db';
import { viewCloudinaryImage } from '../cloudinary/cloudinary-config';

const handler = nc();

handler.get(async (req, res) => {
  try {
    await db.connect();
    const bestProducts = await Product.find().sort({ sold: -1 }).limit(5);

    const modifiedProducts = await Promise.all(
      bestProducts.map(async product => {
        const cloudPromise = product.images.map(async image => {
          const getCloudImages = await viewCloudinaryImage(image);
          return getCloudImages;
        });
        const cloudImages = await Promise.all(cloudPromise);
        return { ...product.toObject(), images: cloudImages };
      })
    );

    if (res.statusCode >= 200 && res.statusCode <= 299) {
      if (Array.isArray(bestProducts) && bestProducts?.length > 0) {
        res.status(200).send(modifiedProducts);
      } else {
        throw new Error('Product not found in database collection');
      }
    } else {
      throw new Error('Something went wrong in the server');
    }
    await db.disconnect();
  } catch (error) {
    res.send('Error in backend ==> ', error.message);
  }
});
export default handler;
