import nc from 'next-connect';
import fs from 'fs';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import BannerModel from '../../../../models/Banner';
import { deleteCloudinaryImage } from '../../cloudinary/cloudinary-config';

const handler = nc();
handler.use(isAuth);
handler.delete(async (req, res) => {
  try {
    await db.connect();
    const bannerExist = await BannerModel.findById({ _id: req.query.id });
    if (bannerExist && 'title' in bannerExist) {
      const bannerDeleted = await BannerModel.findByIdAndRemove({
        _id: req.query.id,
      });

      // Delete image from cloudinary
      deleteCloudinaryImage(bannerExist.image);

      // console.log('BANNER DELETED ==> ', bannerExist);

      if (res.statusCode >= 200 && res.statusCode <= 299) {
        res.send({ message: 'Banner deleted successfully' });
        fs.unlinkSync(bannerDeleted.image);
      } else {
        res.send({ errMsg: 'Something went wrong on the server' });
      }
    } else {
      res.send({ errMessage: 'No Banner found' });
    }
    // await db.disconnect();
  } catch (error) {
    res.send(error);
  }
});

export default handler;
