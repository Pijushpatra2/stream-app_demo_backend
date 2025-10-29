// //models\video\videoModel.js
// import sequelize from '../../config/db.js';
// import { QueryTypes } from 'sequelize';

// // 🟩 Get all videos
// export const getAllVideos = async () => {
//   const videos = await sequelize.query('SELECT * FROM videos', {
//     type: QueryTypes.SELECT,
//   });
//   return videos;
// };

// // 🟩 Get single video by ID
// export const getVideoById = async (id) => {
//   const [video] = await sequelize.query(
//     'SELECT * FROM videos WHERE video_id = ?',
//     {
//       replacements: [id],
//       type: QueryTypes.SELECT,
//     }
//   );
//   return video;
// };

// // 🟩 Add new video
// // 🟩 Add new video
// export const addVideo = async (data) => {
//   const {
//     super_admin_id,
//     super_admin_name,
//     title,
//     description,
//     video_url,
//     thumbnail_url,
//     resolution,
//     visibility
//   } = data;

//   // --- Safety: replace undefined with null or defaults ---
//   const replacements = [
//     super_admin_name || null,
//     title || null,
//     description || null,
//     video_url || null,
//     thumbnail_url || null,
//     resolution || null,
//     visibility || 'public'
//   ];

//   console.log("🟢 Adding video with values:", replacements); // ✅ debug log

//   const [result] = await sequelize.query(
//     `INSERT INTO videos
//       (super_admin_name, title, description, video_url, thumbnail_url, resolution, visibility)
//       VALUES (?, ?, ?, ?, ?, ?, ?)`,
//     {
//       replacements,
//       type: QueryTypes.INSERT,
//     }
//   );

//   return result;
// };

// // 🟩 Update video
// export const updateVideo = async (id, data) => {
//   const { title, description, video_url, thumbnail_url, resolution, visibility, is_visible } = data;
//   const [result] = await sequelize.query(
//     `UPDATE videos 
//       SET title = ?, description = ?, video_url = ?, thumbnail_url = ?, 
//           resolution = ?, visibility = ?, is_visible = ?
//       WHERE video_id = ?`,
//     {
//       replacements: [title, description, video_url, thumbnail_url, resolution, visibility, is_visible, id],
//       type: QueryTypes.UPDATE,
//     }
//   );
//   return result;
// };

// //Delete video
// export const deleteVideo = async (id) => {
//   const [result] = await sequelize.query('DELETE FROM videos WHERE video_id = ?', {
//     replacements: [id],
//     type: QueryTypes.DELETE,
//   });
//   return result;
// };



import sequelize from '../../config/db.js';
import { QueryTypes } from 'sequelize';

//Get all videos
export const getAllVideos = async () => {
  const videos = await sequelize.query('SELECT * FROM videos', {
    type: QueryTypes.SELECT,
  });
  return videos;
};

//Get single video by ID
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

//Fetch videos by admin ID (database layer)
export const fetchVideosByAdminId = async (super_admin_id) => {
  console.log(`[DB QUERY] Fetching videos for super_admin_id: ${super_admin_id}`);

  const query = `
    SELECT 
      video_id,
      super_admin_id,
      super_admin_name,
      title,
      description,
      video_url,
      thumbnail_url,
      resolution,
      views_count,
      likes_count,
      dislikes_count,
      tags,
      is_live,
      visibility,
      is_visible,
      uploaded_at
    FROM videos
    WHERE super_admin_id = :super_admin_id AND is_visible = 1
    ORDER BY uploaded_at DESC
  `;

  try {
    const results = await sequelize.query(query, {
      replacements: { super_admin_id },
      type: QueryTypes.SELECT,
    });

    console.log(`[DB SUCCESS] Found ${results.length} videos for admin ${super_admin_id}`);
    return results;
  } catch (err) {
    console.error(`[DB ERROR] Failed to fetch videos for admin ${super_admin_id}:`, err);
    throw err;
  }
};

//Add new video
export const addVideo = async (data) => {
  const {
    super_admin_id,
    super_admin_name,
    title,
    description,
    video_url,
    thumbnail_url,
    resolution,
    visibility,
  } = data;

  // --- Safety: replace undefined/null values properly ---
  const replacements = [
    super_admin_id || null,   //added foreign key
    super_admin_name || null,
    title || null,
    description || null,
    video_url || null,
    thumbnail_url || null,
    resolution || null,
    visibility || 'public',
  ];

  console.log("Adding video with values:", replacements); //Debug log

  // --- Include super_admin_id in INSERT query ---
  const [result] = await sequelize.query(
    `INSERT INTO videos
      (super_admin_id, super_admin_name, title, description, video_url, thumbnail_url, resolution, visibility)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    {
      replacements,
      type: QueryTypes.INSERT,
    }
  );

  return result;
};

//Update video
export const updateVideo = async (id, data) => {
  const {
    title,
    description,
    video_url,
    thumbnail_url,
    resolution,
    visibility,
    is_visible,
  } = data;

  const [result] = await sequelize.query(
    `UPDATE videos 
      SET title = ?, description = ?, video_url = ?, thumbnail_url = ?, 
          resolution = ?, visibility = ?, is_visible = ?
      WHERE video_id = ?`,
    {
      replacements: [
        title || null,
        description || null,
        video_url || null,
        thumbnail_url || null,
        resolution || null,
        visibility || 'public',
        is_visible ?? true,
        id,
      ],
      type: QueryTypes.UPDATE,
    }
  );

  return result;
};

//Delete video
export const deleteVideo = async (id) => {
  const [result] = await sequelize.query(
    'DELETE FROM videos WHERE video_id = ?',
    {
      replacements: [id],
      type: QueryTypes.DELETE,
    }
  );
  return result;
};
