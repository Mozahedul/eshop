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
    res.send(order);
  } catch (err) {
    res.send(err);
  }
});

export default handler;
