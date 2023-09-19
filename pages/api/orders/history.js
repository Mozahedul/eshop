import nc from 'next-connect';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import { getError } from '../../../utils/error';
import OrderModel from '../../../models/Order';

const handler = nc();

handler.use(isAuth);
handler.get(async (req, res) => {
  try {
    await db.connect();
    const orders = await OrderModel.find({ user: req.user._id }).sort({
      field: 'desc',
    });
    await db.disconnect();
    res.send(orders);
  } catch (err) {
    res.status(404).send(getError(err));
  }
});

export default handler;
