const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function initDatabase() {
  // Supabase (Postgres) не поддерживает создание таблиц через JS SDK.
  // Таблицы должны быть созданы вручную через SQL миграции или Supabase Studio.
  // Здесь просто заглушка для совместимости.
  return;
}

async function registerUser(userId, username) {
  await supabase.from("Users").upsert(
    [
      {
        user_id: userId,
        username,
        display_name: username,
      },
    ],
    { onConflict: ["user_id"] }
  );
}

async function getUser(userId) {
  const { data } = await supabase
    .from("Users")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

async function getUserByUsername(username) {
  const { data } = await supabase
    .from("Users")
    .select("*")
    .eq("username", username)
    .single();
  return data;
}

async function setMood(userId, mood) {
  await supabase.from("Users").update({ mood }).eq("user_id", userId);
}

async function getMood(userId) {
  const { data } = await supabase
    .from("Users")
    .select("mood")
    .eq("user_id", userId)
    .single();
  return data?.mood;
}

async function addPendingConnection(requesterId, targetId, relationshipType) {
  const { data, error } = await supabase
    .from("PendingConnections")
    .insert([
      {
        requester_id: requesterId,
        target_id: targetId,
        relationship_type: relationshipType,
      },
    ])
    .select("request_id")
    .single();
  if (error) throw error;
  return data.request_id;
}

async function getPendingConnectionsForUser(userId) {
  const { data } = await supabase
    .from("PendingConnections")
    .select("*, Users!PendingConnections_requester_id_fkey(username)")
    .eq("target_id", userId);
  return (data || []).map((row) => ({
    ...row,
    requester_username: row.Users?.username,
  }));
}

async function getSentPendingConnections(userId) {
  const { data } = await supabase
    .from("PendingConnections")
    .select("*, Users!PendingConnections_target_id_fkey(username)")
    .eq("requester_id", userId);
  return (data || []).map((row) => ({
    ...row,
    target_username: row.Users?.username,
  }));
}

async function acceptConnection(requestId) {
  const { data: row } = await supabase
    .from("PendingConnections")
    .select("*")
    .eq("request_id", requestId)
    .single();
  if (!row) throw new Error("Request not found");
  await supabase.from("Connections").insert([
    {
      user1_id: row.requester_id,
      user2_id: row.target_id,
      relationship_type: row.relationship_type,
    },
  ]);
  await supabase
    .from("PendingConnections")
    .delete()
    .eq("request_id", requestId);
  return row;
}

async function declineConnection(requestId) {
  await supabase
    .from("PendingConnections")
    .delete()
    .eq("request_id", requestId);
}

async function getConnections(userId) {
  const { data } = await supabase
    .from("Connections")
    .select(
      `
      connection_id,
      relationship_type,
      user1_id,
      user2_id,
      Users1:Users!Connections_user1_id_fkey(username, display_name, mood, user_id),
      Users2:Users!Connections_user2_id_fkey(username, display_name, mood, user_id)
    `
    )
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);
  return (data || []).map((row) => {
    const isUser1 = row.user1_id === userId;
    const connected = isUser1 ? row.Users2 : row.Users1;
    return {
      user_id: connected?.user_id,
      username: connected?.username,
      display_name: connected?.display_name,
      mood: connected?.mood,
      relationship_type: row.relationship_type,
    };
  });
}

async function disconnect(user1Id, user2Id) {
  await supabase
    .from("Connections")
    .delete()
    .or(
      `and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`
    );
}

async function sendExpression(senderId, receiverId, expressionType) {
  await supabase.from("LoveExpressions").insert([
    {
      sender_id: senderId,
      receiver_id: receiverId,
      expression_type: expressionType,
    },
  ]);
}

async function updateRelationshipType(userId, targetUserId, newType) {
  await supabase
    .from("Connections")
    .update({ relationship_type: newType })
    .or(
      `and(user1_id.eq.${userId},user2_id.eq.${targetUserId}),and(user1_id.eq.${targetUserId},user2_id.eq.${userId})`
    );
}

async function setDisplayName(userId, displayName) {
  await supabase
    .from("Users")
    .update({ display_name: displayName })
    .eq("user_id", userId);
}

async function getDisplayName(userId) {
  const { data } = await supabase
    .from("Users")
    .select("display_name")
    .eq("user_id", userId)
    .single();
  return data?.display_name || null;
}

function logUserAction(userId, actionType, details) {
  const stmt = db.prepare(`
    INSERT INTO logs (user_id, action_type, details)
    VALUES (?, ?, ?);
  `);
  stmt.run(userId, actionType, details);
}

function getRecentLogs(limit = 50) {
  const stmt = db.prepare(`
    SELECT 
      l.timestamp,
      u.username,
      l.action_type,
      l.details
    FROM logs l
    JOIN users u ON l.user_id = u.user_id
    ORDER BY l.timestamp DESC
    LIMIT ?;
  `);
  return stmt.all(limit);
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
  getRecentLogs,
  logUserAction,
};
