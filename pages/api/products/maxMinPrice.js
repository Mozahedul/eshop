import nc from 'next-connect';
import Product from '../../../models/Product';

const handler = nc();

handler.get(async (req, res) => {
  try {
    const maxMin = await Product.aggregate([
      {
        $group: {
          _id: null,
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
        },
      },
    ]);

    // console.log('MAX PRICE ==> ', maxMin);
    if (res.statusCode >= 200 && res.statusCode <= 299) {
      res.send(maxMin);
    } else {
      res.send({ errMsg: 'Something went wrong on the server' });
    }
  } catch (error) {
    res.send(error);
  }
});

export default handler;
