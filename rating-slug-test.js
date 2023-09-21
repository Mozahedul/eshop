import nc from 'next-connect';
import Product from './models/Product';
import { isAuth } from './utils/auth';
import db from './utils/db';

const handler = nc();

// to view the rating of a specific product
handler.get(async (req, res) => {
  try {
    await db.connect();
    const getRatings = await Product.findOne({
      slug: req.query.slug,
    })
      .sort([['createdAt', 'desc']])
      .exec();

    // console.log('GET RATINGS ==> ', getRatings);
    res.send(getRatings.reviews);
    // await db.disconnect();
  } catch (error) {
    res.send(error);
  }
});

handler.use(isAuth);
// for inserting rating to product
handler.patch(async (req, res) => {
  const { reviewName, comment, ratingStar } = req.body;
  // console.log(reviewName, comment, ratingStar);
  // console.log('REQUEST USER ==> ', req.user);
  const reviewObj = {
    name: reviewName,
    comment,
    rating: ratingStar,
    postedDate: Date.now(),
    postedBy: req.user._id,
  };

  // console.log('REVIEW OBJECT ==> ', reviewObj);
  try {
    await db.connect();
    // Check the review comment existence in the database
    const productRated = await Product.findOne({
      slug: req.query.slug,
    });

    // console.log('PRODUCT RATED ==> ', productRated);

    // find out the total product rating of the product
    const totalRating = productRated.reviews.reduce(
      (acc, curr) => acc + curr.rating,
      0
    );

    // console.log('TOTAL RATING ==> ', totalRating);

    // The product is reviewed by the user or not
    const isReviewed = productRated.reviews.find(
      item => item.postedBy.toString() === req.user._id
    );

    // console.log('is REVIEWED', isReviewed);

    // show the message if the product is already
    // reviewed by the user or not
    if (isReviewed && isReviewed.comment) {
      res.send({ errMessage: 'You have already reviewed for this product' });
    } else {
      const productReviews = await Product.findOneAndUpdate(
        {
          slug: req.query.slug,
        },
        { $push: { reviews: reviewObj, ratings: totalRating } },
        { new: true }
      ).exec();

      // console.log('PRODUCT REVIEWS ==> ', productReviews.reviews);

      const matchedRating = productReviews.reviews.find(
        item => item.postedBy.toString() === req.user._id
      );

      // console.log('MATCHED REVIEW ==> ', matchedRating);

      // if (matchedRating && matchedRating.comment) {
      res.send({
        message: 'Review added successfully',
        productReview: matchedRating,
      });
      // }
    }

    // console.log('REVIEW BACKEND ==> ', reviews);
    // await db.disconnect();
  } catch (error) {
    res.send(error);
  }
});

export default handler;
