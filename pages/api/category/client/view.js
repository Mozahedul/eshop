import nc from 'next-connect';
import db from '../../../../utils/db';
import Categories from '../../../../models/Category';

const handler = nc();
/**
 * This handler for getting categories with product count
 */
handler.get(async (req, res) => {
  try {
    await db.connect();
    const categories = await Categories.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'categories',
          as: 'products',
        },
      },
      {
        $addFields: {
          productCount: { $size: '$products' },
        },
      },
      {
        $match: { productCount: { $gt: 0 } },
      },
      { $sort: { productCount: -1 } },
    ]);

    console.log('CATEGORIES BACKEND ==> ', categories);

    res.send(categories);
    await db.disconnect();
  } catch (error) {
    res.send(error);
  }

  // try {
  //   await db.connect();
  //   const categories = await Categories.find({})
  //     .sort([['createdAt', 'desc']])
  //     .exec();
  //   res.send(categories);
  //   await db.disconnect();
  // } catch (error) {
  //   console.log(error);
  // }
});

export default handler;
