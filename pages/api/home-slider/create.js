import nc from 'next-connect';
import fs from 'fs';
import slugify from 'slugify';
import BannerModel from '../../../models/Banner';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import upload from '../cloudinary/multer-multi-files';
import uploadImage from '../cloudinary/cloudinary-config';

const handler = nc();

export const config = {
  api: {
    bodyParser: false,
  },
};

handler.use(isAuth);
handler.post(upload.single('avatar'), async (req, res) => {
  // console.log(req.file);
  try {
    await db.connect();
    // Upload images to cloudinary
    const cloudImage = await uploadImage(req.file.path);

    const banner = new BannerModel({
      user: req.user._id,
      title: req.body.title,
      slug: slugify(req.body.title),
      subtitle: req.body.subtitle,
      image: cloudImage,
    });

    const savedBanner = await banner.save();
    res.status(200).send(savedBanner);

    setTimeout(function () {
      if (res.statusCode === 200 && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      if (req.file.path && res.statusCode === 500) {
        fs.unlinkSync(req.file.path);
      }
    }, 1000);

    await db.disconnect();
  } catch (err) {
    res.send(err);
  }
});

export default handler;
