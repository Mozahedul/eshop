import nc from 'next-connect';
import fs from 'fs';
import BannerModel from '../../../../models/Banner';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import upload from '../../cloudinary/multer-multi-files';
import uploadImage, {
  deleteCloudinaryImage,
  viewCloudinaryImage,
} from '../../cloudinary/cloudinary-config';

const handler = nc();
export const config = {
  api: {
    bodyParser: false,
  },
};

handler.use(isAuth);

/**
 * @param {request, respons}
 * @return banner object
 * @CDN image processed with cloudinary
 * @description for showing banner data as an object
 */
handler.get(async (req, res) => {
  try {
    await db.connect();
    const banner = await BannerModel.findById({ _id: req.query.id }).exec();

    // Fetch image from cloudinary
    const cloudImage = viewCloudinaryImage(banner.image);
    banner.image = cloudImage;

    res.send(banner);
    await db.disconnect();
  } catch (err) {
    res.send(err);
  }
});

// for updating the database
handler.put(upload.single('avatar'), async (req, res) => {
  try {
    await db.connect();
    const bannerExist = await BannerModel.findById({ _id: req.query.id });

    const bannerData = {
      title: req.body.title,
      subtitle: req.body.subtitle,
    };

    if (req.file && req.file.path) {
      // Uplaod image to cloudinary
      const publicId = await uploadImage(req.file.path);
      bannerData.image = publicId;

      // Delete image from cloudinary
      bannerExist && deleteCloudinaryImage(bannerExist.image);
    }

    if (bannerExist && 'title' in bannerExist) {
      const banners = await BannerModel.findByIdAndUpdate(
        { _id: req.query.id },
        bannerData
      ).exec();
      res.send(banners);
      if (res.statusCode === 200 && req.file.path) {
        // fs.unlinkSync(bannerExist.image);
        fs.unlinkSync(req.file.path);
      }
    } else {
      res.send('No banner found');
    }

    await db.disconnect();
  } catch (error) {
    res.send(error);
  }
});

export default handler;
