import nc from 'next-connect';
import db from '../../../utils/db';
import OrderModel from '../../../models/Order';
import { onError } from '../../../utils/error';
import { isAuth } from '../../../utils/auth';

const handler = nc({
  onError,
});

handler.use(isAuth);

handler.post(async (req, res) => {
  try {
    await db.connect();
    const newOrder = new OrderModel({
      ...req.body,
      user: req.user._id,
    });
    const order = await newOrder.save();

    if (res.statusCode >= 200 && res.statusCode <= 299) {
      res.send(order);
    } else {
      res.send({ errMsg: 'Something went wrong on the server' });
    }
    // await db.disconnect();
  } catch (err) {
    res.send({ errMsge: err.message });
  }
});

export default handler;
