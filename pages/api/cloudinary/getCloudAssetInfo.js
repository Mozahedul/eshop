import { vs as cloudinary } from 'cloudinary';

const getCloudAsset = async publicId => {
  const options = {
    colors: true,
  };
  try {
    const result = await cloudinary.api.resource(publicId, options);
    console.log('RESULT ==> ', result);
    return result.colors;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getCloudAsset;
