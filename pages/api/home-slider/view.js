import nc from 'next-connect';
import db from '../../../utils/db';
import BannerModel from '../../../models/Banner';
import { isAuth } from '../../../utils/auth';
import { viewCloudinaryImage } from '../cloudinary/cloudinary-config';

const handler = nc();

handler.use(isAuth);
handler.get(async (req, res) => {
  try {
    await db.connect();
    const banners = await BannerModel.find({});
    // Load image from cloudinary
    const updatedBanner = banners.map(banner => {
      const cloudImage = viewCloudinaryImage(banner.image);
      return {
        ...banner.toObject(),
        image: cloudImage,
        publicId: banner.image,
      };
    });

    res.send(updatedBanner);
    await db.disconnect();
  } catch (error) {
    res.send(error);
  }
});

export default handler;
