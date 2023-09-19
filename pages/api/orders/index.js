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
    await db.disconnect();
    res.status(201).send(order);
  } catch (err) {
    res.send(err);
  }
});

export default handler;
