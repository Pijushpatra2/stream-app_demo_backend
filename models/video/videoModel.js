import sequelize from '../../config/db.js';
import { QueryTypes } from 'sequelize';

// 🟩 Get all videos
export const getAllVideos = async () => {
  const videos = await sequelize.query('SELECT * FROM videos', {
    type: QueryTypes.SELECT,
  });
  return videos;
};

// 🟩 Get single video by ID
export const getVideoById = async (id) => {
  const [video] = await sequelize.query(
    'SELECT * FROM videos WHERE video_id = ?',
    {
      replacements: [id],
      type: QueryTypes.SELECT,
    }
  );
  return video;
};

// 🟩 Add new video
export const addVideo = async (data) => {
  const { super_admin_name, title, description, video_url, thumbnail_url, resolution, visibility } = data;
  const [result] = await sequelize.query(
    `INSERT INTO videos 
      (super_admin_name, title, description, video_url, thumbnail_url, resolution, visibility)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    {
      replacements: [super_admin_name, title, description, video_url, thumbnail_url, resolution, visibility || 'public'],
      type: QueryTypes.INSERT,
    }
  );
  return result;
};

// 🟩 Update video
export const updateVideo = async (id, data) => {
  const { title, description, video_url, thumbnail_url, resolution, visibility, is_visible } = data;
  const [result] = await sequelize.query(
    `UPDATE videos 
      SET title = ?, description = ?, video_url = ?, thumbnail_url = ?, 
          resolution = ?, visibility = ?, is_visible = ?
      WHERE video_id = ?`,
    {
      replacements: [title, description, video_url, thumbnail_url, resolution, visibility, is_visible, id],
      type: QueryTypes.UPDATE,
    }
  );
  return result;
};

// 🟩 Delete video
export const deleteVideo = async (id) => {
  const [result] = await sequelize.query('DELETE FROM videos WHERE video_id = ?', {
    replacements: [id],
    type: QueryTypes.DELETE,
  });
  return result;
};
