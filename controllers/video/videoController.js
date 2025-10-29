// // controllers\video\videoController.js
// import * as Video from '../../models/video/videoModel.js';
// // 🟩 Get all videos
// export const getAllVideos = async (req, res) => {
//   try {
//     const videos = await Video.getAllVideos();
//     res.json(videos);
//   } catch (err) {
//     res.status(500).json({ message: 'Database error', error: err.message });
//   }
// };

// // 🟩 Get video by ID
// export const getVideoById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const video = await Video.getVideoById(id);

//     if (!video) return res.status(404).json({ message: 'Video not found' });
//     res.json(video);
//   } catch (err) {
//     res.status(500).json({ message: 'Database error', error: err.message });
//   }
// };

// // 🟩 Add video (your existing code is fine)
// export const addVideo = async (req, res) => {
//   try {
//     console.log("Received files:", req.files); // 🔥 Debug

//     const videoFile = req.files.video_file?.[0];
//     const thumbnailFile = req.files.thumbnail?.[0];

//     if (!videoFile) {
//       return res.status(400).json({ message: "Video file is required" });
//     }

//     const data = {
//       super_admin_name: req.body.super_admin_name,
//       title: req.body.title,
//       description: req.body.description,
//       video_url: videoFile.path,       // store the uploaded path
//       thumbnail_url: thumbnailFile?.path || null,
//       resolution: req.body.resolution,
//       visibility: req.body.visibility || "public",
//     };

//     await Video.addVideo(data);
//     res.status(201).json({ message: "Video uploaded successfully", data });
//   } catch (error) {
//     console.error("❌ Upload error:", error);
//     res.status(500).json({ message: "Failed to upload video", error: error.message });
//   }
// };



// // 🟩 Update video
// export const updateVideo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Video.updateVideo(id, req.body);
//     res.json({ message: 'Video updated successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update video', error: err.message });
//   }
// };

// // 🟩 Delete video
// export const deleteVideo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Video.deleteVideo(id);
//     res.json({ message: 'Video deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to delete video', error: err.message });
//   }
// };





//========================




import * as Video from '../../models/video/videoModel.js';

/**
 * Get all videos — Public access
 */
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.getAllVideos();
    res.status(200).json({ status: 'success', data: videos });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Database error', error: err.message });
  }
};

/**
 * Get video by ID — Public access
 */
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.getVideoById(id);

    if (!video) {
      return res.status(404).json({ status: 'error', message: 'Video not found' });
    }

    res.status(200).json({ status: 'success', data: video });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Database error', error: err.message });
  }
};

//Controller: Get videos by admin ID
export const getVideosByAdminId = async (req, res) => {
  const { super_admin_id } = req.params;

  console.log(`[CONTROLLER] getVideosByAdminId called with admin ID: ${super_admin_id}`);

  if (!super_admin_id) {
    console.warn(`[WARN] Missing admin ID in request`);
    return res.status(400).json({ message: "Admin ID is required" });
  }

  try {
    const results = await Video.fetchVideosByAdminId(super_admin_id);
    console.log(`[SUCCESS] Returning ${results.length} videos for admin ${super_admin_id}`);

    return res.status(200).json({
      message: "Videos fetched successfully",
      count: results.length,
      videos: results,
    });
  } catch (err) {
    console.error(`[ERROR] Could not fetch videos for admin ${super_admin_id}:`, err);
    return res.status(500).json({ message: "Database error", error: err.message });
  }
};

/**
 * Add video — Only Super Admins
 */
// controllers/video/videoController.js
export const addVideo = async (req, res) => {
  try {
    console.log("Received files:", req.files);

    const videoFile = req.files.video_file?.[0];
    const thumbnailFile = req.files.thumbnail?.[0];

    if (!videoFile) {
      return res.status(400).json({ message: "Video file is required" });
    }

    // Use authenticated super admin info from token
    const { id: super_admin_id, name: super_admin_name } = req.user;

    const data = {
      super_admin_id, // from token
      super_admin_name, // optional, for logging/display
      title: req.body.title,
      description: req.body.description,
      video_url: videoFile.path,
      thumbnail_url: thumbnailFile?.path || null,
      resolution: req.body.resolution,
      visibility: req.body.visibility || "public",
    };

    await Video.addVideo(data);
    res.status(201).json({
      status: "success",
      message: "Video uploaded successfully",
      data,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to upload video",
      error: error.message,
    });
  }
};


/**
 * Update video — Only Super Admins
 */
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const existingVideo = await Video.getVideoById(id);
    if (!existingVideo) {
      return res.status(404).json({ status: 'error', message: 'Video not found' });
    }

    await Video.updateVideo(id, req.body);
    res.status(200).json({ status: 'success', message: 'Video updated successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to update video', error: err.message });
  }
};

/**
 * Delete video — Only Super Admins
 */
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const existingVideo = await Video.getVideoById(id);
    if (!existingVideo) {
      return res.status(404).json({ status: 'error', message: 'Video not found' });
    }

    await Video.deleteVideo(id);
    res.status(200).json({ status: 'success', message: 'Video deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to delete video', error: err.message });
  }
};
