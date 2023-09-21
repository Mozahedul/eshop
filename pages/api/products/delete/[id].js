import nc from 'next-connect';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import Product from '../../../../models/Product';
import { deleteCloudinaryImage } from '../../cloudinary/cloudinary-config';

const handler = nc();

handler.use(isAuth);

/**
 * @param {request, response}
 * @returns deleted message
 */
handler.delete(async (req, res) => {
  // console.log(req.query.id);
  try {
    await db.connect();
    // Check the product existence in database
    const productExist = await Product.findById({ _id: req.query.id });
    console.log('PRODUCT EXISTS ==> ', productExist);
    if (productExist) {
      const productDeleted = await Product.findByIdAndRemove({
        _id: req.query.id,
      }).exec();

      // Delete images in cloudinary
      productExist.images.map(image => deleteCloudinaryImage(image));

      if (res.statusCode >= 200 && res.statusCode <= 299) {
        res.send(productDeleted);
      } else {
        res.send({ errMsg: 'Something went wrong on the server' });
      }
    } else {
      res.send({ message: 'No product found' });
    }
    // setTimeout(() => {
    //   productExist.images.map(file => fs.unlinkSync(file));
    // }, 2000);
    // await db.disconnect();
  } catch (error) {
    console.log(error);
  }
});

export default handler;
