import nc from 'next-connect';
// import sharp from 'sharp';
import fs from 'fs';
// import { v4 as uuidv4 } from 'uuid';
import { isAuth } from '../../../../utils/auth';
import upload from '../../cloudinary/multer-multi-files';

const handler = nc();

export const config = {
  api: {
    bodyParser: false,
  },
};

handler.use(isAuth);
handler.post(upload.array('subCatImages', 6), async (req, res) => {
  try {
    const images = [];
    // req.files.map(file => {
    //   const sharpImages = sharp(file.path)
    //     .resize(400, 400)
    //     .toFile(
    //       `./public/images/subcategories/${uuidv4()}.webp`,
    //       (err, info) => {
    //         if (err) {
    //           console.log(err);
    //         } else {
    //           console.log(info);
    //         }
    //       }
    //     );
    //   images.push(sharpImages.options.fileOut);
    //   return true;
    // });

    res.send(images);

    // Delete or remove multer formed images
    setTimeout(() => {
      req.files.map(item => fs.unlinkSync(item.path));
    }, 2000);
  } catch (err) {
    console.log(err);
  }
});

export default handler;
