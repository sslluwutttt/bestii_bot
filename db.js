const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  database: process.env.MYSQLDATABASE,
  password: process.env.MYSQLPASSWORD,
  port: process.env.MYSQLPORT,
});

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Users (
      user_id INT PRIMARY KEY,
      username VARCHAR(255),
      display_name VARCHAR(255),
      mood VARCHAR(50) DEFAULT 'happy'
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Connections (
      connection_id INT AUTO_INCREMENT PRIMARY KEY,
      user1_id INT,
      user2_id INT,
      relationship_type VARCHAR(50)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS PendingConnections (
      request_id INT AUTO_INCREMENT PRIMARY KEY,
      requester_id INT,
      target_id INT,
      relationship_type VARCHAR(50)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS LoveExpressions (
      expression_id INT AUTO_INCREMENT PRIMARY KEY,
      sender_id INT,
      receiver_id INT,
      expression_type VARCHAR(50),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function registerUser(userId, username) {
  await pool.query(
    `
    INSERT INTO Users (user_id, username, display_name)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE username = ?
  `,
    [userId, username, username, username]
  );
}

async function getUser(userId) {
  const [rows] = await pool.query("SELECT * FROM Users WHERE user_id = ?", [
    userId,
  ]);
  return rows[0];
}

async function getUserByUsername(username) {
  const [rows] = await pool.query("SELECT * FROM Users WHERE username = ?", [
    username,
  ]);
  return rows[0];
}

async function setMood(userId, mood) {
  await pool.query("UPDATE Users SET mood = ? WHERE user_id = ?", [
    mood,
    userId,
  ]);
}

async function getMood(userId) {
  const [rows] = await pool.query("SELECT mood FROM Users WHERE user_id = ?", [
    userId,
  ]);
  return rows[0]?.mood;
}

async function addPendingConnection(requesterId, targetId, relationshipType) {
  const [result] = await pool.query(
    `
    INSERT INTO PendingConnections (requester_id, target_id, relationship_type)
    VALUES (?, ?, ?)
  `,
    [requesterId, targetId, relationshipType]
  );
  return result.insertId;
}

async function getPendingConnectionsForUser(userId) {
  const [rows] = await pool.query(
    `
    SELECT p.*, u.username AS requester_username
    FROM PendingConnections p
    JOIN Users u ON p.requester_id = u.user_id
    WHERE p.target_id = ?
  `,
    [userId]
  );
  return rows;
}

async function getSentPendingConnections(userId) {
  const [rows] = await pool.query(
    `
    SELECT p.*, u.username AS target_username
    FROM PendingConnections p
    JOIN Users u ON p.target_id = u.user_id
    WHERE p.requester_id = ?
  `,
    [userId]
  );
  return rows;
}

async function acceptConnection(requestId) {
  const [rows] = await pool.query(
    "SELECT * FROM PendingConnections WHERE request_id = ?",
    [requestId]
  );
  const row = rows[0];
  if (!row) throw new Error("Request not found");
  await pool.query(
    `
    INSERT INTO Connections (user1_id, user2_id, relationship_type)
    VALUES (?, ?, ?)
  `,
    [row.requester_id, row.target_id, row.relationship_type]
  );
  await pool.query("DELETE FROM PendingConnections WHERE request_id = ?", [
    requestId,
  ]);
  return row;
}

async function declineConnection(requestId) {
  await pool.query("DELETE FROM PendingConnections WHERE request_id = ?", [
    requestId,
  ]);
}

async function getConnections(userId) {
  const [rows] = await pool.query(
    `
    SELECT c.connection_id, c.relationship_type,
           CASE WHEN c.user1_id = ? THEN c.user2_id ELSE c.user1_id END AS connected_user_id,
           u.username AS connected_username,
           u.display_name AS connected_display_name,
           u.mood AS connected_mood
    FROM Connections c
    JOIN Users u ON u.user_id = CASE WHEN c.user1_id = ? THEN c.user2_id ELSE c.user1_id END
    WHERE c.user1_id = ? OR c.user2_id = ?
  `,
    [userId, userId, userId, userId]
  );
  return rows.map((row) => ({
    user_id: row.connected_user_id,
    username: row.connected_username,
    display_name: row.connected_display_name,
    mood: row.connected_mood,
    relationship_type: row.relationship_type,
  }));
}

async function disconnect(user1Id, user2Id) {
  await pool.query(
    `
    DELETE FROM Connections
    WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
  `,
    [user1Id, user2Id, user2Id, user1Id]
  );
}

async function sendExpression(senderId, receiverId, expressionType) {
  await pool.query(
    `
    INSERT INTO LoveExpressions (sender_id, receiver_id, expression_type)
    VALUES (?, ?, ?)
  `,
    [senderId, receiverId, expressionType]
  );
}

async function updateRelationshipType(userId, targetUserId, newType) {
  await pool.query(
    `
    UPDATE Connections
    SET relationship_type = ?
    WHERE (user1_id = ? AND user2_id = ?)
       OR (user1_id = ? AND user2_id = ?)
    `,
    [newType, userId, targetUserId, targetUserId, userId]
  );
}

async function setDisplayName(userId, displayName) {
  await pool.query(
    `UPDATE Users SET display_name = ? WHERE user_id = ?`,
    [displayName, userId]
  );
}
async function getDisplayName(userId) {
  const [rows] = await pool.query(
    `SELECT display_name FROM Users WHERE user_id = ?`,
    [userId]
  );
  return rows[0]?.display_name || null;
}

module.exports = {
  initDatabase,
  registerUser,
  getUser,
  getUserByUsername,
  setMood,
  getMood,
  addPendingConnection,
  getPendingConnectionsForUser,
  getSentPendingConnections,
  acceptConnection,
  declineConnection,
  getConnections,
  disconnect,
  sendExpression,
  updateRelationshipType,
  setDisplayName,
  getDisplayName,
};
