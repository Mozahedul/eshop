import nc from 'next-connect';
import Product from '../../../../models/Product';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';

const handler = nc();

// @description - to view the reviews
// @route - /api/products/reviews
// @access - /public/user
handler.get(async (req, res) => {
  try {
    await db.connect();
    const getRatings = await Product.findOne({
      slug: req.query.slug,
    })
      .sort([['createdAt', 'desc']])
      .exec();

    // console.log('GET RATINGS ==> ', getRatings.reviews);
    res.send(getRatings.reviews);
    await db.disconnect();
  } catch (error) {
    res.send(error);
  }
});

// @description - to insert review
// @route - /api/products/reviews
// @access - /public/user
handler.use(isAuth);
// for inserting rating to product
handler.post(async (req, res) => {
  const { reviewName, comment, ratingStar } = req.body;
  // console.log(reviewName, comment, ratingStar);
  // console.log('REQUEST USER ==> ', req.user);

  try {
    await db.connect();
    const product = await Product.findOne({ slug: req.query.slug });

    if (typeof product !== 'undefined' && 'title' in product) {
      // console.log('INSIDE PRODUCT ==> ', product);
      const alreadyReviewed = product.reviews.find(
        reviewer => reviewer.postedBy.toString() === req.user._id.toString()
      );

      // console.log('ALREADY REVIEWS ==> ', alreadyReviewed);

      if (
        typeof alreadyReviewed !== 'undefined' &&
        'comment' in alreadyReviewed
      ) {
        // res.status(400);
        // console.log('already reviewed');
        res.send({ errMsg: 'You have already reviewed for this product' });
        // throw new Error('You have already reviewed for this product');
      } else {
        const review = {
          name: reviewName,
          comment,
          rating: ratingStar,
          postedBy: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;
        product.totalRating =
          product.reviews.reduce((acc, curr) => curr.rating + acc, 0) /
          product.reviews.length;

        const productSaved = await product.save();
        // console.log('PRODUCT SAVED ==> ', productSaved);
        res.status(201).send({
          message: 'Review added successfully',
          productReview: {
            avgRating: productSaved?.totalRating,
            reviewNumbers: productSaved?.numReviews,
          },
          reviewData: productSaved?.reviews?.slice(-1)[0],
        });
      }
    } else {
      // res.status(404);
      throw new Error('Product not found');
    }
    await db.disconnect();
  } catch (error) {
    // console.log('Error in review: ==> ', error.message);
    res.send({ errMsg: error.message });
  }
});

export default handler;
