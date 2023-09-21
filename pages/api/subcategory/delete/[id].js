import nc from 'next-connect';
import Subcategory from '../../../../models/SubCategory';
import db from '../../../../utils/db';

const handler = nc();
handler.delete(async (req, res) => {
  try {
    await db.connect();
    const deletedSubCat = await Subcategory.findByIdAndRemove({
      _id: req.query.id,
    });
    if (res.statusCode >= 200 && res.statusCode <= 299) {
      res.send(deletedSubCat);
    } else {
      res.send({ errMsg: 'Something went wrong on the server' });
    }
    await db.disconnect();
  } catch (err) {
    res.send({ errMsg: err.message });
  }
});

export default handler;
