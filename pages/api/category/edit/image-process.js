import nc from 'next-connect';
import fs from 'fs';
import upload from '../../cloudinary/multer-multi-files';
import uploadImage, {
  viewCloudinaryImage,
} from '../../cloudinary/cloudinary-config';

const handler = nc();

export const config = {
  api: {
    bodyParser: false,
  },
};

handler.post(upload.array('catImages', 6), async (req, res) => {
  try {
    const cloudImages = req.files.map(file => {
      const imagesPromise = uploadImage(file.path);
      return imagesPromise;
    });

    const cloudinaryImages = await Promise.all(cloudImages);
    console.log('CLOUD IMAGE  ==> ', cloudinaryImages);

    // Create image link from cloudinary with public_id
    const updatedImages = cloudinaryImages.map(image => {
      const cloudPromise = viewCloudinaryImage(image);
      return cloudPromise;
    });

    console.log(updatedImages);
    if (res.statusCode >= 200 && res.statusCode <= 299) {
      res.send(updatedImages);
    } else {
      res.send({ errMsg: 'Something went wrong on the server' });
    }

    setTimeout(() => {
      req.files.map(file => fs.unlinkSync(file.path));
    }, 2000);
  } catch (err) {
    res.status(404).send();
    req.files.length > 0 && req.files.map(image => fs.unlinkSync(image.path));
  }
});

export default handler;
