import nc from 'next-connect';
import fs from 'fs';
// import sharp from 'sharp';
import slugify from 'slugify';
// import { v4 as uuidv4 } from 'uuid';
import Subcategories from '../../../models/SubCategory';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import { getError } from '../../../utils/error';
import upload from '../cloudinary/multer-multi-files';

const handler = nc();

export const config = {
  api: {
    bodyParser: false,
  },
};

handler.use(isAuth);
handler.post(upload.array('avatar', 3), async (req, res) => {
  // console.log('REQUEST BODY ==> ', req.body);
  // console.log('REQUEST FILES ==> ', req.files);
  try {
    await db.connect();
    // const images = [];
    // console.log('IMAGES BACKEND ==> ', images);
    // req.files.map(file => {
    //   const sharpImage = sharp(file.path)
    //     .resize(400, 400)
    //     .toFile(
    //       `./public/images/subcategories/${uuidv4()}.webp`,
    //       (err, info) => {
    //         if (!err) {
    //           console.log(info);
    //         } else {
    //           console.log(err);
    //         }
    //       }
    //     );
    //   images.push(sharpImage.options.fileOut);
    //   return true;
    // });
    const { category, description, subcategory } = req.body;
    // check the subcategory already exist or not
    const subcategoryExist = await Subcategories.findOne({
      slug: slugify(subcategory),
    });

    // console.log('SUBCATEGORY EXIST ==> ', subcategoryExist);
    if (subcategoryExist === null) {
      const categories = new Subcategories({
        name: subcategory,
        slug: slugify(subcategory),
        user: req.user._id,
        parentCategory: category,
        description,
        image: [],
        // image: images,
      });
      const saveCategory = await categories.save();
      // console.log('SAVE CATEGORY ==> ', saveCategory);
      if (saveCategory !== 'null' && 'name' in saveCategory) {
        res.send({ message: 'Subcategory added successfully' });
      }
    } else {
      res.send({ errMessage: 'Subcategory already exists' });
    }

    setTimeout(() => {
      req.files?.map(item => fs.unlinkSync(item.path));
    }, 2000);

    // await db.disconnect();
  } catch (err) {
    res.send(getError(err));
  }
});

export default handler;
