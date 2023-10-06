const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async (event, context) => {
  const file = event.body;
  const uploadResult = await cloudinary.uploader.upload(file, {
    resource_type: 'auto',
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
    }),
  };
};
