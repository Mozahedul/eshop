import nc from 'next-connect';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import OrderModel from '../../../../models/Order';
import { getError } from '../../../../utils/error';

const handler = nc();

handler.use(isAuth);

handler.put(async (req, res) => {
  try {
    await db.connect();
    const order = await OrderModel.findById(req.query.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        name: req.body.payer.name.given_name,
        surname: req.body.payer.name.surname,
        status: req.body.status,
        email_address: req.body.payer.email_address,
      };

      const newOrder = await order.save();
      await db.disconnect();
      res.send({ message: 'Order paid', data: newOrder });
    } else {
      db.disconnect();
      res.status(404).send({ errMessage: 'Order not created' });
    }
  } catch (err) {
    res.send('Order not found!! ' + getError(err));
  }
});

export default handler;
