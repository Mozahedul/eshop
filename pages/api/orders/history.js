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

    if (res.statusCode >= 200 && res.statusCode <= 299) {
      res.send(orders);
    } else {
      res.send({ errMsg: 'Something went wrong on the server' });
    }
    await db.disconnect();
  } catch (err) {
    res.status(404).send(getError(err));
  }
});

export default handler;
