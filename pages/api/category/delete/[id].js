import nc from 'next-connect';
import Categories from '../../../../models/Category';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { getError } from '../../../../utils/error';
import { deleteCloudinaryImage } from '../../cloudinary/cloudinary-config';

const handler = nc();

handler.use(isAuth);

/**
 * @params {request, response}
 * @return Category delete confirmaton message
 * @description Delete images from cloudinary & from database
 */
handler.delete(async (req, res) => {
  try {
    await db.connect();
    const categoryExist = await Categories.findById({
      _id: req.query.id,
    });

    if (categoryExist) {
      const delCategory = await Categories.findByIdAndRemove({
        _id: req.query.id,
      }).exec();

      // console.log('DELETE CATEGORY ==> ', delCategory);
      // console.log('RESPONSE CATEGORY => ', res);
      // Delete images from cloudinary
      categoryExist.image.length > 0 &&
        categoryExist.image.map(file => deleteCloudinaryImage(file));

      if (res.statusCode >= 200 && res.statusCode <= 299) {
        res.send(delCategory);
      } else {
        res.send({ errMsg: 'Something went wrong on the server' });
      }

      db.disconnect();
    } else {
      res.send({ message: 'Category not found' });
    }
    // await db.disconnect();
  } catch (err) {
    res.send(getError(err));
  }
});

export default handler;
