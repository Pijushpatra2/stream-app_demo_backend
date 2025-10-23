// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from '../config/cloudinary.js';

// // Storage configuration for Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     const folder = file.mimetype.startsWith('video/')
//       ? 'videos'     // folder for videos
//       : 'thumbnails'; // folder for thumbnails

//     return {
//       folder,
//       resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
//       public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
//       format: file.originalname.split('.').pop(),
//     };
//   },
// });

// const upload = multer({ storage });

// export default upload;


import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    const folder = isVideo ? 'videos' : 'thumbnails';
    const format = file.originalname.split('.').pop();

    return {
      folder,
      resource_type: isVideo ? 'video' : 'image',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      format,
    };
  },
});

// Multer upload instance
const upload = multer({ storage });

// Export middleware for route
export const uploadFields = upload.fields([
  { name: 'video_file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

export default upload;
