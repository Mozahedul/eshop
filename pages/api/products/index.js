import nc from 'next-connect';
import Product from '../../../models/Product';
import db from '../../../utils/db';
import { viewCloudinaryImage } from '../cloudinary/cloudinary-config';

// create handler with next-connect NPM package
const handler = nc();

handler.get(async (req, res) => {
  try {
    await db.connect();
    const products = await Product.find({});
    await db.disconnect();

    // Fetch images from cloudinary
    const updatedProducts = await Promise.all(
      products.map(async product => {
        const cloudImages = product.images.map(async image => {
          const cloudPromise = await viewCloudinaryImage(image);
          return cloudPromise;
        });

        const transoformedCloudImages = await Promise.all(cloudImages);
        return { ...product.toObject(), images: transoformedCloudImages };
      })
    );
    res.status(201).send(updatedProducts);
  } catch (error) {
    res.send({ message: error });
  }
});

export default handler;
