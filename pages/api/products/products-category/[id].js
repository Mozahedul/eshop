import nc from 'next-connect';
import db from '../../../../utils/db';
import Product from '../../../../models/Product';
import { viewCloudinaryImage } from '../../cloudinary/cloudinary-config';

const handler = nc();

handler.get(async (req, res) => {
  try {
    const categoryId = req.query.id;
    // console.log('CATEGORY ID ==> ', categoryId);
    db.connect();
    const products = await Product.find({ categories: categoryId });
    db.disconnect();

    // Fetch images from cloudinary
    const updatedProducts = await Promise.all(
      products.map(async product => {
        const cloudImages = product.images.map(async image => {
          const cloudPromise = await viewCloudinaryImage(image);
          return cloudPromise;
        });

        const imagesFromCloudinary = await Promise.all(cloudImages);
        return { ...product.toObject(), images: imagesFromCloudinary };
      })
    );
    res.send(updatedProducts);
  } catch (error) {
    console.log(error);
  }
});

export default handler;
