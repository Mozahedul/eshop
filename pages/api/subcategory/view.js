import nc from 'next-connect';
import Subcategories from '../../../models/SubCategory';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';

const handler = nc();
handler.use(isAuth);
handler.get(async (req, res) => {
  try {
    await db.connect();
    // Here populate("category");
    // category is a collection name
    // TODO: Method - 1 of exec method execution
    const subcategories = await Subcategories.find({})
      .populate('parentCategory', 'name')
      .sort([['createdAt', 'desc']])
      .exec();

    res.send(subcategories);
    // TODO:Method - 2 of exec() method execution
    // .exec((err, info) => {
    //   if (!err) {
    //     console.log('SUBCATEGORY ==> ', info);
    //     res.send(info);
    //   } else {
    //     console.log(err);
    //   }
    // });
    // console.log('SUBCATEGORY BACKEND ==> ', subcategories);

    await db.disconnect();
    // res.send(subcategories);
  } catch (err) {
    console.log(err);
  }
});

export default handler;
