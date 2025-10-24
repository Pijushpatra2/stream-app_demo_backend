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

// middlewares/upload.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Configure Cloudinary storage dynamically for both videos & images
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    const folder = isVideo ? 'videos' : 'thumbnails';
    const format = file.originalname.split('.').pop().toLowerCase();

    // Allow only safe formats
    const allowedImageFormats = ['jpg', 'jpeg', 'png', 'webp'];
    const allowedVideoFormats = ['mp4', 'mov', 'avi', 'mkv'];

    if (
      (isVideo && !allowedVideoFormats.includes(format)) ||
      (!isVideo && !allowedImageFormats.includes(format))
    ) {
      throw new Error(`Invalid file format: ${format}`);
    }

    return {
      folder,
      resource_type: isVideo ? 'video' : 'image',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      format,
    };
  },
});

// Multer upload instance with file size & type validation
const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video and image files are allowed!'));
    }
  },
});

// Export middleware for routes
export const uploadFields = upload.fields([
  { name: 'video_file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

export default upload;
