import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import db from '../../../utils/db';
import { signToken } from '../../../utils/auth';
import UserModel from '../../../models/User';

const handler = nc();

handler.post(async (req, res) => {
  try {
    await db.connect();
    const user = await UserModel.findOne({ email: req.body.email });
    await db.disconnect();
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = await signToken(user);
      res.send({
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(401).send({
        message: `We couldn't find an account with that email or password.`,
      });
    }
  } catch (error) {
    res.send({ message: error });
  }
});

export default handler;
