import nc from 'next-connect';
import db from '../../../../utils/db';
import BannerModel from '../../../../models/Banner';
import { viewCloudinaryImage } from '../../cloudinary/cloudinary-config';

const handler = nc();

handler.get(async (req, res) => {
  try {
    await db.connect();
    const banners = await BannerModel.find({});

    // Fetch images from cloudinary
    const updatedBanners = banners.map(banner => {
      const cloudImage = viewCloudinaryImage(banner.image);
      return { ...banner.toObject(), image: cloudImage };
    });

    res.send(updatedBanners);
    await db.disconnect();
  } catch (error) {
    res.send(error);
  }
});

export default handler;
