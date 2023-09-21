import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import db from '../../../utils/db';
import UserModel from '../../../models/User';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  try {
    await db.connect();
    const newUser = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
      isAdmin: false,
    });
    const user = await newUser.save();
    // await db.disconnect();

    const token = await signToken(user);
    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.send({
      message: 'Account has not been created. Check the details, & try again.',
    });
  }
});

export default handler;
