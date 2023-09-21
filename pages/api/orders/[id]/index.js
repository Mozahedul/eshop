import nc from 'next-connect';
import db from '../../../../utils/db';
import OrderModel from '../../../../models/Order';
import { isAuth } from '../../../../utils/auth';

const handler = nc();

handler.use(isAuth);
handler.get(async (req, res) => {
  try {
    await db.connect();
    const order = await OrderModel.findById(req.query.id);
    await db.disconnect();

    if (res.statusCode >= 200 && res.statusCode <= 299) {
      res.send(order);
    } else {
      res.send({ errMsg: 'Something went wrong on the server' });
    }
  } catch (err) {
    res.send(err);
  }
});

export default handler;
