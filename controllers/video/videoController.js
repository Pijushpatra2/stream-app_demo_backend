import * as Video from '../../models/video/videoModel.js';

export const getAllVideos = (req, res) => {
  Video.getAllVideos((err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
};

export const getVideoById = (req, res) => {
  const { id } = req.params;
  Video.getVideoById(id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Video not found' });
    res.json(results[0]);
  });
};


export const addVideo = async (req, res) => {
  try {
    const videoFile = req.files?.video_file?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    const videoUrl = videoFile?.path;
    const thumbnailUrl = thumbnailFile?.path;

    const data = {
      super_admin_name: req.body.super_admin_name,
      title: req.body.title,
      description: req.body.description,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      resolution: req.body.resolution,
      visibility: req.body.visibility || 'public',
    };

    await Video.addVideo(data);
    res.status(201).json({ message: 'Video uploaded successfully', data });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload video', error: error.message });
  }
};

export const updateVideo = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  Video.updateVideo(id, data, (err) => {
    if (err) return res.status(500).json({ message: 'Failed to update video', error: err });
    res.json({ message: 'Video updated successfully' });
  });
};

export const deleteVideo = (req, res) => {
  const { id } = req.params;
  Video.deleteVideo(id, (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete video', error: err });
    res.json({ message: 'Video deleted successfully' });
  });
};
