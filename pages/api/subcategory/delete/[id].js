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
    if (deletedSubCat !== null) {
      res.send(deletedSubCat);
    } else {
      res.send({ errMessage: 'SubCategory cannot be deleted' });
    }
    await db.disconnect();
  } catch (err) {
    res.send(err);
  }
});

export default handler;
