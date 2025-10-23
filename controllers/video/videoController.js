import * as Video from '../../models/video/videoModel.js';

// 🟩 Get all videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.getAllVideos();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// 🟩 Get video by ID
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.getVideoById(id);

    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// 🟩 Add video (your existing code is fine)
export const addVideo = async (req, res) => {
  try {
    console.log("Received files:", req.files); // 🔥 Debug

    const videoFile = req.files.video_file?.[0];
    const thumbnailFile = req.files.thumbnail?.[0];

    if (!videoFile) {
      return res.status(400).json({ message: "Video file is required" });
    }

    const data = {
      super_admin_name: req.body.super_admin_name,
      title: req.body.title,
      description: req.body.description,
      video_url: videoFile.path,       // store the uploaded path
      thumbnail_url: thumbnailFile?.path || null,
      resolution: req.body.resolution,
      visibility: req.body.visibility || "public",
    };

    await Video.addVideo(data);
    res.status(201).json({ message: "Video uploaded successfully", data });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "Failed to upload video", error: error.message });
  }
};



// 🟩 Update video
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    await Video.updateVideo(id, req.body);
    res.json({ message: 'Video updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update video', error: err.message });
  }
};

// 🟩 Delete video
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    await Video.deleteVideo(id);
    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete video', error: err.message });
  }
};
