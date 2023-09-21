import nc from 'next-connect';
import slugify from 'slugify';
import fs from 'fs';
import Subcategories from '../../../../models/SubCategory';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { getError } from '../../../../utils/error';

const handler = nc();

handler.use(isAuth);
// To view the single subcategory with id
handler.get(async (req, res) => {
  // console.log('REQUEST BODY ==> ', req.body);
  try {
    await db.connect();
    const subcategory = Subcategories.findById({ _id: req.query.id })
      .populate('parentCategory', 'name')
      .exec();

    if (res.statusCode >= 200 && res.statusCode <= 299) {
      res.send(subcategory);
    } else {
      res.send({ errMsg: 'Something went wrong on the server' });
    }

    // await db.disconnect();
  } catch (err) {
    console.log(err);
  }
});

// Update the subcategory
handler.put(async (req, res) => {
  // console.log('REQUEST BODY ==> ', req.body);
  const { name, parentCategory, description, image, removedSubCatImage } =
    req.body;
  const updateSubCat = {
    name,
    slug: slugify(name),
    parentCategory,
    description,
    image,
  };
  try {
    await db.connect();
    const subCat = await Subcategories.findByIdAndUpdate(
      { _id: req.query.id },
      updateSubCat
    ).exec();

    res.send(subCat);

    // console.log('SUBCAT ==> ', subCat);

    setTimeout(() => {
      removedSubCatImage.map(item => fs.unlinkSync(item));
    }, 2000);

    // await db.disconnect();
  } catch (err) {
    res.send(getError(err));
  }
});

export default handler;
