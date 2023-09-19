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
    res.send(maxMin);
  } catch (error) {
    res.send(error);
  }
});

export default handler;
