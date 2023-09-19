import nc from 'next-connect';
import db from '../../../utils/db';
import Product from '../../../models/Product';
import { viewCloudinaryImage } from '../cloudinary/cloudinary-config';

const handler = nc();

handler.get(async (req, res) => {
  const { category, value } = req.query;
  try {
    db.connect();
    const products = await Product.find({
      categories: category,
      title: { $regex: value, $options: 'i' },
    }).exec();

    // Fetch products from cloudinary with search form
    const updatedProducts = await Promise.all(
      products.map(async product => {
        const cloudPromise = product.images.map(image => {
          const cloudImages = viewCloudinaryImage(image);
          return cloudImages;
        });

        const getCloudImages = await Promise.all(cloudPromise);
        return { ...product.toObject(), images: getCloudImages };
      })
    );

    res.send(updatedProducts);
    db.disconnect();
  } catch (error) {
    console.log(error);
  }
});

export default handler;
