import fs from 'fs';
import nc from 'next-connect';
// import { v4 as uuidv4 } from 'uuid';
import { isAuth } from '../../../../utils/auth';
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

handler.use(isAuth);
handler.post(upload.array('avatar', 6), async (req, res) => {
  // Send images to cloudinary
  // console.log('REQUEST FILES ==> ', req.files);
  const cloudPromise = req.files.map(async file => {
    const cloudImage = await uploadImage(file.path);
    // console.log('CLOUD IMAGE ==> ', cloudImage);
    return cloudImage;
  });

  const cloudinaryImages = await Promise.all(cloudPromise);

  // Create image link in cloudinary
  const images = cloudinaryImages.map(img => {
    const cloudinaryPromise = viewCloudinaryImage(img);
    return cloudinaryPromise;
  });

  console.log(images);
  if (res.statusCode >= 200 && res.statusCode <= 299) {
    res.send(images);
  } else {
    res.send({ errMsg: 'Something went wrong on the server' });
  }

  setTimeout(() => {
    req.files?.map(imgFile => fs.unlinkSync(imgFile.path));
  }, 2000);
});

export default handler;
