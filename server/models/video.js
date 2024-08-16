const db = require('../database');

// Define SQL operations for Video

// Creating a new video
const addVideo = (video, callback) => {
  const { title, filename, filepath, mimetype, size, duration, author, thumbnail, codec } = video;
  const sql = `INSERT INTO Video (title, filename, filepath, mimetype, size, duration, author, thumbnail, codec) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [title, filename, filepath, mimetype, size, duration, author, thumbnail, codec], function(err) {
    callback(err, this.lastID);
  });
};

// Get all videos by a specific author
const getVideosByAuthor = (authorId, callback) => {
  const sql = `SELECT * FROM Video WHERE author = ?`;
  db.all(sql, [authorId], callback);
};

// Get video by ID
const getVideoById = (id, callback) => {
  const sql = 'SELECT * FROM Video WHERE id = ?';
  db.all(sql, [id], callback);
}

// Delete specific video
const deleteVideo = (id, callback) => {
  const sql = 'DELETE FROM Video WHERE id = ?';

  db.run(sql, [id], function(err) {
      if (err) {
          return callback(err, null);
      }
      callback(null, this.changes > 0); // this.changes > 0 indicates if any rows were deleted
  });
};

module.exports = {
  addVideo,
  getVideosByAuthor,
  getVideoById,
  deleteVideo,
};
