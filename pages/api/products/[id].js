import nc from 'next-connect';
import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  try {
    await db.connect();
    const product = await Product.findById({ _id: req.query.id });

    if (res.statusCode >= 200 && res.statusCode <= 299) {
      res.send(product);
    } else {
      res.send({ errMsg: 'Something went wrong on the server' });
    }
    // await db.disconnect();
  } catch (error) {
    res.send(error);
  }
});

export default handler;
