import nc from 'next-connect';
import Product from '../../../models/Product';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import { getError } from '../../../utils/error';
import { viewCloudinaryImage } from '../cloudinary/cloudinary-config';

const handler = nc();

/**
 * @method GET
 * @params request, response
 * @return products array
 * @description work with cloudinary image view
 */
handler.use(isAuth);
handler.get(async (req, res) => {
  // console.log('REQUEST BODY ==> ', req.body);
  try {
    await db.connect();
    const products = await Product.find({})
      .populate('categories', 'name')
      .sort([['createdAt', 'desc']])
      .exec();

    // Update the products array with images from cloudinary
    const udpatedProducts = await Promise.all(
      products.map(async product => {
        const cloudPromise = product.images.map(image => {
          const cloudImages = viewCloudinaryImage(image);
          return cloudImages;
        });

        const productImages = await Promise.all(cloudPromise);
        return { ...product.toObject(), images: productImages };
      })
    );

    console.log('UPDATED PRODUCTS ==> ', udpatedProducts);

    res.send(udpatedProducts);
    await db.disconnect();
  } catch (error) {
    res.send(getError(error));
  }
});

export default handler;
