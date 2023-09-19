/* eslint-disable no-param-reassign */
const handleReviewSubmit = async (
  ratingData,
  product,
  axios,
  toast,
  userToken,
  dispatch
) => {
  const userRating = ratingData ? JSON.parse(JSON.stringify(ratingData)) : {};
  const source = axios.CancelToken.source();
  try {
    dispatch({ type: 'REVIEW_REQUEST' });
    const response = await axios.post(
      `/api/products/reviews/${product.slug}`,
      userRating,
      { headers: { authorization: `Bearer ${userToken.token}` } },
      { cancelToken: source.token }
    );

    if (response.data.errMsg) {
      toast.error(response.data.errMsg, {
        position: 'top-center',
        theme: 'colored',
        autoClose: 2000,
      });
    }

    if (response.status >= 200 && response.status <= 299) {
      product.totalRating = response.data.productReview.avgRating;
      product.numReviews = response.data.productReview.reviewNumbers;
      product.reviews.push(response.data.reviewData);
      dispatch({ type: 'REVIEW_SUCCESS' });

      toast.success(response.data.message, {
        position: 'top-center',
        theme: 'colored',
        autoClose: 2000,
      });
    } else {
      throw new Error(response.data.errMsg);
    }
  } catch (err) {
    dispatch({ type: 'REVIEW_FAIL' });
    toast.error(err, {
      position: 'top-center',
      theme: 'colored',
      autoClose: 2000,
    });
  }
  setTimeout(function () {
    source.cancel();
  }, 2000);
};

export default handleReviewSubmit;
