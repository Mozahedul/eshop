import nc from 'next-connect';
import db from '../../../utils/db';
import Product from '../../../models/Product';

const handler = nc();
handler.get(async (req, res) => {
  try {
    await db.connect();
    const brandCounts = await Product.aggregate([
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      {
        $project: { brand: '$_id', count: 1, _id: 0 },
      },
      { $sort: { count: -1 } },
    ]);

    res.send(brandCounts);
    await db.disconnect();
  } catch (error) {
    res.send(error);
  }
});

export default handler;
