import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
});

/**
 *
 * @param {*} imagePath
 * @returns public_id of cloudinary images
 * @description upload images to cloudinary
 */
const uploadImage = async imagePath => {
  // use the upload's file name as the asset's public id, and
  // allow overwriting the assets with new version.
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  const result = await cloudinary.uploader.upload(imagePath, options);
  return result.public_id;
};

/**
 *
 * @param {image}
 * @returns cloudinary image URL
 * @description Fetch images from cloudinary
 */
export const viewCloudinaryImage = image => {
  const imageUrl = cloudinary.url(image);
  return imageUrl;
};

/**
 * @param {}
 * @returns
 * @description delete images in cloudinary,
 * use invalidate: trut to invalidate the cache generated by CDN.
 */
export const deleteCloudinaryImage = async image => {
  await cloudinary.uploader.destroy(image, { invalidate: true });
};

export default uploadImage;
