import nc from 'next-connect';
import db from '../../../utils/db';
import { getError } from '../../../utils/error';
import Product from '../../../models/Product';
import { viewCloudinaryImage } from '../cloudinary/cloudinary-config';

const handler = nc();

/**
 * @method GET
 * @param {request, response}
 * @return newly arrived products
 */
handler.get(async (req, res) => {
  try {
    db.connect();
    const newArrivals = await Product.find({})
      .sort([['createdAt', 'desc']])
      .limit(10)
      .exec();

    const newArrivalsUpdated = await Promise.all(
      newArrivals.map(async arrival => {
        const cloudPromise = arrival.images.map(async file => {
          const cloudImages = await viewCloudinaryImage(file);
          return cloudImages;
        });
        const cloudImages = await Promise.all(cloudPromise);
        return { ...arrival.toObject(), images: cloudImages };
      })
    );

    if (res.statusCode >= 200 && res.statusCode <= 299) {
      res.send(newArrivalsUpdated);
    } else {
      res.send({ errMsg: 'Something went wrong on the server' });
    }
    db.disconnect();
  } catch (error) {
    res.send(getError(error));
  }
});

export default handler;
