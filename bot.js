const { Telegraf } = require("telegraf");
const db = require("./db");

const bot = new Telegraf(process.env.BOT_TOKEN);

db.initDatabase();

const MOOD_CATEGORIES = [
  { key: "happy", label: "😊 Happy" },
  { key: "love", label: "😍 Love & Affection" },
  { key: "sad", label: "😢 Sad" },
  { key: "angry", label: "😠 Angry" },
  { key: "anxious", label: "😰 Anxious/Worried" },
  { key: "tired", label: "😴 Tired/Exhausted" },
  { key: "surprised", label: "😲 Surprised/Confused" },
  { key: "calm", label: "😌 Calm/Peaceful" },
  { key: "playful", label: "😜 Playful/Fun" },
  { key: "confident", label: "😎 Confident/Proud" },
  { key: "neutral", label: "😐 Neutral/Other" },
];

const MOODS = {
  happy: [
    "😊 happy",
    "😄 joyful",
    "🤩 excited",
    "🥳 ecstatic",
    "😁 cheerful",
    "😸 delighted",
    "🤗 elated",
    "🌟 euphoric",
    "😇 blissful",
    "✨ radiant",
  ],
  love: [
    "😍 in love",
    "🥰 loving",
    "💕 romantic",
    "💖 affectionate",
    "😘 adoring",
    "💝 smitten",
    "❤️‍🔥 passionate",
    "💗 devoted",
    "🤱 tender",
    "🫶 caring",
  ],
  sad: [
    "😢 sad",
    "😭 crying",
    "💔 heartbroken",
    "😔 melancholy",
    "😿 sorrowful",
    "🌧️ gloomy",
    "😖 miserable",
    "😫 devastated",
    "🖤 mourning",
    "😞 dejected",
  ],
  angry: [
    "😠 angry",
    "🤬 furious",
    "😤 irritated",
    "😑 annoyed",
    "😒 frustrated",
    "👿 outraged",
    "🔥 livid",
    "💢 mad",
    "🌋 heated",
    "😡 fuming",
  ],
  anxious: [
    "😰 anxious",
    "😟 worried",
    "😅 nervous",
    "😵‍💫 stressed",
    "🥺 panicked",
    "😵 overwhelmed",
    "😬 restless",
    "😬 uneasy",
    "😰 tense",
    "🤯 frantic",
  ],
  tired: [
    "😴 tired",
    "🥱 exhausted",
    "😪 sleepy",
    "🫠 drained",
    "😩 weary",
    "🐌 sluggish",
    "💤 lethargic",
    "🔥 burnt out",
    "😑 fatigued",
    "😵‍💫 drowsy",
  ],
  surprised: [
    "😲 surprised",
    "😱 shocked",
    "🤯 amazed",
    "😕 confused",
    "🤔 puzzled",
    "😵 bewildered",
    "😳 stunned",
    "🫨 dumbfounded",
    "🤷 perplexed",
    "🧐 curious",
  ],
  calm: [
    "😌 calm",
    "☮️ peaceful",
    "🕊️ serene",
    "🧘 tranquil",
    "😎 relaxed",
    "🧘‍♀️ zen",
    "😊 content",
    "😌 satisfied",
    "🌙 mellow",
    "🙂 composed",
  ],
  playful: [
    "😜 playful",
    "🤪 silly",
    "🤡 goofy",
    "😏 mischievous",
    "😋 cheeky",
    "🎉 fun",
    "⚡ energetic",
    "🦘 bouncy",
    "🌈 vibrant",
    "🕺 lively",
  ],
  confident: [
    "😎 confident",
    "🦚 proud",
    "💪 determined",
    "🎯 ambitious",
    "🔥 fierce",
    "🦁 bold",
    "🦸 brave",
    "💎 strong",
    "👑 powerful",
    "🚀 unstoppable",
  ],
  neutral: [
    "😐 neutral",
    "🙂 okay",
    "👍 fine",
    "😑 bored",
    "🤷‍♀️ indifferent",
    "🤔 thoughtful",
    "💭 contemplative",
    "☁️ dreamy",
    "🌅 nostalgic",
    "🌟 hopeful",
  ],
};

const EXPRESSIONS = {
  hug: { emoji: "🤗", message: "sent you a warm hug!" },
  kiss: { emoji: "😘", message: "blew you a kiss!" },
  heart: { emoji: "❤️", message: "sent you love!" },
  cuddle: { emoji: "🫂", message: "wants to cuddle with you!" },
  flower: { emoji: "🌹", message: "gave you a beautiful flower!" },
  chocolate: { emoji: "🍫", message: "shared chocolate with you!" },
  smile: { emoji: "😊", message: "smiled at you!" },
  wink: { emoji: "😉", message: "winked at you!" },
  high_five: { emoji: "🙏", message: "gave you a high five!" },
  thumbs_up: { emoji: "👍", message: "gave you thumbs up!" },
  clap: { emoji: "👏", message: "is clapping for you!" },
  sparkles: { emoji: "✨", message: "sent you sparkles!" },
  rainbow: { emoji: "🌈", message: "shared a rainbow with you!" },
  star: { emoji: "⭐", message: "thinks you're a star!" },
  gem: { emoji: "💎", message: "thinks you're a gem!" },
  gift: { emoji: "🎁", message: "gave you a gift!" },
  handshake: { emoji: "🤝", message: "shook your hand!" },
  wave: { emoji: "👋", message: "waved at you!" },
  party: { emoji: "🥳", message: "invited you to a party!" },
  sun: { emoji: "🌞", message: "wished you a sunny day!" },
  moon: { emoji: "🌙", message: "wished you sweet dreams!" },
  umbrella: { emoji: "☂️", message: "offered you an umbrella!" },
  shield: { emoji: "🛡️", message: "is protecting you!" },
  pat: { emoji: "🐾", message: "pat you!" },
};

const userStates = {};

async function handleSetMood(ctx) {
  userStates[ctx.from.id] = { step: "choose_category" };
  const keyboard = MOOD_CATEGORIES.map((cat) => [
    { text: cat.label, callback_data: `moodcat:${cat.key}` },
  ]);
  await ctx.reply("choose your mood category:", {
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleCategorySelection(ctx, categoryKey) {
  userStates[ctx.from.id] = { step: "choose_mood", category: categoryKey };
  const moods = MOODS[categoryKey] || [];
  const keyboard = moods.map((m) => [{ text: m, callback_data: `mood:${m}` }]);
  // Добавляем кнопку "⬅️ Back"
  keyboard.push([
    { text: "⬅️ Back to categories", callback_data: "moodcat:back" },
  ]);
  await ctx.editMessageText("Choose your mood:", {
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleBackToCategories(ctx) {
  userStates[ctx.from.id] = { step: "choose_category" };
  const keyboard = MOOD_CATEGORIES.map((cat) => [
    { text: cat.label, callback_data: `moodcat:${cat.key}` },
  ]);
  await ctx.editMessageText("choose your mood category:", {
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleMoodSelection(ctx, mood) {
  await db.setMood(ctx.from.id, mood);
  await ctx.editMessageText(`your mood is now ${mood}!`);
  const displayName =
    (await db.getDisplayName(ctx.from.id)) ||
    ctx.from.username ||
    ctx.from.first_name;
  const connections = await db.getConnections(ctx.from.id);
  for (const conn of connections) {
    if (conn.user_id !== ctx.from.id) {
      await bot.telegram.sendMessage(
        conn.user_id,
        `🔔 ${displayName} set their mood as <b>${mood}</b>`,
        { parse_mode: "HTML" }
      );
    }
  }
  delete userStates[ctx.from.id];
}

async function handleMyMood(ctx) {
  const mood = await db.getMood(ctx.from.id);
  await ctx.reply(`Your mood: ${mood || "not set"}`);
}

async function handleFriendsMoods(ctx) {
  const connections = await db.getConnections(ctx.from.id);
  if (connections.length === 0) return ctx.reply("no connections yet.");
  const list = connections
    .map((c) => `@${c.username} - ${c.mood || "not set"}`)
    .join("\n");
  await ctx.reply(`connections' moods:\n${list}`);
}

async function handleSendInteraction(ctx) {
  const displayName =
    (await db.getDisplayName(ctx.from.id)) ||
    ctx.from.username ||
    ctx.from.first_name;
  const userId = ctx.from.id;
  const connections = await db.getConnections(userId);
  if (connections.length === 0) return ctx.reply("no connections yet.");
  const keyboard = connections.map((c) => [
    { text: `@${displayName}`, callback_data: `conn:${c.user_id}` },
  ]);
  userStates[userId] = { step: "select_connection" };
  await ctx.reply("сhoose a connection:", {
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleMyConnections(ctx) {
  const connections = await db.getConnections(ctx.from.id);
  if (connections.length === 0) return ctx.reply("no connections yet.");
  const keyboard = connections.map((c) => [
    {
      text: `👤 ${c.username} (${c.relationship_type})`,
      callback_data: `editrel:${c.user_id}`,
    },
    {
      text: `✏️ set name for ${c.username}`,
      callback_data: `setname:${c.user_id}`,
    },
  ]);
  await ctx.reply("your connections:", {
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleSetNamePrompt(ctx, targetUserId) {
  userStates[ctx.from.id] = { step: "set_name", targetUserId };
  await ctx.editMessageText("send me a new name for this user (max 32 chars):");
}

async function handleEditRelationship(ctx, targetUserId) {
  const types = ["partner", "friend", "bestie"];
  const displayName =
    (await db.getDisplayName(ctx.from.id)) ||
    ctx.from.username ||
    ctx.from.first_name;

  const connection = (await db.getConnections(ctx.from.id)).find(
    (c) => c.user_id == targetUserId
  );
  if (!connection) return ctx.editMessageText("Connection not found.");
  const keyboard = types
    .filter((t) => t !== connection.relationship_type)
    .map((type) => [
      {
        text: `Change to ${type}`,
        callback_data: `setrel:${targetUserId}:${type}`,
      },
    ]);
  keyboard.push([{ text: "⬅️ Back", callback_data: "connections:back" }]);
  await ctx.editMessageText(
    `@${displayName}\ncurrent: ${connection.relationship_type}\nchoose new type:`,
    { reply_markup: { inline_keyboard: keyboard } }
  );
}

async function handleSetRelationship(ctx, targetUserId, newType) {
  await db.updateRelationshipType(ctx.from.id, targetUserId, newType);
  const connection = (await db.getConnections(ctx.from.id)).find(
    (c) => c.user_id == targetUserId
  );
  const displayName =
    (await db.getDisplayName(ctx.from.id)) ||
    ctx.from.username ||
    ctx.from.first_name;
  await ctx.editMessageText(
    `@${displayName}\nrelationship type updated to: ${newType}`
  );
}

async function handlePendingRequests(ctx) {
  const toAccept = await db.getPendingConnectionsForUser(ctx.from.id);
  const sent = await db.getSentPendingConnections(ctx.from.id);
  let reply = "";
  if (toAccept.length > 0) {
    reply +=
      "requests to accept:\n" +
      toAccept
        .map(
          (r) =>
            `${r.request_id}: from @${r.requester_username} as ${r.relationship_type}`
        )
        .join("\n") +
      "\n";
  }
  if (sent.length > 0) {
    reply +=
      "sent requests:\n" +
      sent
        .map((r) => `to @${r.target_username} as ${r.relationship_type}`)
        .join("\n");
  }
  await ctx.reply(reply || "no pending requests.");
}

async function handleBreakConnection(ctx) {
  await ctx.reply("usage: /disconnect @username");
}

async function handleConnect(ctx) {
  await ctx.reply("usage: /connect @username type (partner, friend, bestie)");
}

async function handleHelp(ctx) {
  await ctx.reply(
    `ℹ️ <b>available actions:</b>
🔗 <b>connect</b> — start a connection with another user
👥 <b>my connections</b> — your connections list
⏳ <b>pending requests</b> — sent connection requests list
❌ <b>break the connection</b> — leave the connection
😊 <b>set mood</b> — choose your mood
🙋‍♂️ <b>my mood</b> — see your mood
👀 <b>friends' moods</b> — see friends' moods
💌 <b>send an interaction</b> — send an interaction to a friend

<b>use buttons below for actions!</b>`,
    { parse_mode: "HTML" }
  );
}

bot.command("start", async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || `user${userId}`;
  await db.registerUser(userId, username);
  await ctx.reply(
    "👋 welcome to bestii bot! ❤️\n\nuse menu below for actions or use /help.",
    {
      reply_markup: {
        keyboard: [
          [{ text: "😊 set mood" }, { text: "💌 send interaction" }],
          [{ text: "🙋‍♂️ my mood" }, { text: "👀 friends' moods" }],
          [{ text: "🔗 connect" }, { text: "👥 my connections" }],
          [
            { text: "⏳ pending requests" },
            { text: "❌ break the connection" },
          ],
          [{ text: "ℹ️ help" }],
        ],
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    }
  );
});

bot.command("help", handleHelp);
bot.hears("ℹ️ help", handleHelp);

bot.command("connect", async (ctx) => {
  const userId = ctx.from.id;
  const args = ctx.message.text.split(" ");
  if (args.length < 3)
    return ctx.reply(
      "usage: /connect @username type (partner, friend, bestie)"
    );
  const targetUsername = args[1].startsWith("@") ? args[1].slice(1) : args[1];
  const type = args[2].toLowerCase();
  if (!["partner", "friend", "bestie"].includes(type))
    return ctx.reply("type must be partner, friend, or bestie.");

  const target = await db.getUserByUsername(targetUsername);
  if (!target) return ctx.reply("user not found.");
  if (target.user_id === userId)
    return ctx.reply("you cannot connect with yourself!");

  const connections = await db.getConnections(userId);
  if (connections.some((c) => c.user_id === target.user_id))
    return ctx.reply("you are already connected.");
  const pending = await db.getPendingConnectionsForUser(userId);
  const sentPending = await db.getSentPendingConnections(userId);
  if (
    pending.some((p) => p.requester_id === target.user_id) ||
    sentPending.some((p) => p.target_id === target.user_id)
  ) {
    return ctx.reply("a connection request already exists.");
  }

  const requestId = await db.addPendingConnection(userId, target.user_id, type);
  const displayName =
    (await db.getDisplayName(ctx.from.id)) ||
    ctx.from.username ||
    ctx.from.first_name;
  await bot.telegram.sendMessage(
    target.user_id,
    `@${
      displayName || ctx.from.username
    } wants to connect as a ${type}. accept?`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Yes ✅", callback_data: `accept:${requestId}` },
            { text: "No ❌", callback_data: `decline:${requestId}` },
          ],
        ],
      },
    }
  );
  await ctx.reply(`connection request sent to @${targetUsername}!`);
});

bot.command("accept", async (ctx) => {
  const args = ctx.message.text.split(" ");
  if (args.length < 2) return ctx.reply("usage: /accept request_id");
  const requestId = parseInt(args[1]);
  const request = await db.acceptConnection(requestId).catch(() => null);
  if (!request || request.target_id !== ctx.from.id)
    return ctx.reply("invalid or not your request.");

  const requester = await db.getUser(request.requester_id);
  await ctx.reply(
    `you are now connected with @${requester.username} as ${request.relationship_type}!`
  );
  await bot.telegram.sendMessage(
    request.requester_id,
    `@${ctx.from.username} accepted your ${request.relationship_type} request!`
  );
});

bot.command("decline", async (ctx) => {
  const args = ctx.message.text.split(" ");
  if (args.length < 2) return ctx.reply("Usage: /decline request_id");
  const requestId = parseInt(args[1]);
  const request = await db
    .getPendingConnectionsForUser(ctx.from.id)
    .then((rows) => rows.find((r) => r.request_id === requestId));
  if (!request) return ctx.reply("Invalid or not your request.");

  await db.declineConnection(requestId);
  await ctx.reply("Request declined.");
  const requester = await db.getUser(request.requester_id);
  await bot.telegram.sendMessage(
    request.requester_id,
    `@${ctx.from.username} declined your ${request.relationship_type} request.`
  );
});

bot.command("connections", handleMyConnections);
bot.hears("👥 my connections", handleMyConnections);

bot.command("pending", handlePendingRequests);
bot.hears("⏳ pending requests", handlePendingRequests);

bot.command("disconnect", async (ctx) => {
  const args = ctx.message.text.split(" ");
  if (args.length < 2) return ctx.reply("Usage: /disconnect @username");
  const username = args[1].startsWith("@") ? args[1].slice(1) : args[1];
  const target = await db.getUserByUsername(username);
  if (!target) return ctx.reply("User not found.");
  await db.disconnect(ctx.from.id, target.user_id);
  await ctx.reply(`disconnected from @${username}.`);
  await bot.telegram.sendMessage(
    target.user_id,
    `@${ctx.from.username} disconnected from you.`
  );
});

bot.command("setmood", handleSetMood);
bot.hears("😊 set mood", handleSetMood);

bot.command("mymood", handleMyMood);
bot.hears("🙋‍♂️ my mood", handleMyMood);

bot.command("moods", handleFriendsMoods);
bot.hears("👀 friends' moods", handleFriendsMoods);

bot.command("send", handleSendInteraction);
bot.hears("💌 send interaction", handleSendInteraction);

bot.on("text", async (ctx, next) => {
  const state = userStates[ctx.from.id];
  if (state?.step === "set_name" && state.targetUserId) {
    const newName = ctx.message.text.trim().slice(0, 32);
    await db.setDisplayName(state.targetUserId, newName);
    await ctx.reply(`name updated to: ${newName}`);
    delete userStates[ctx.from.id];
    return;
  }
  return next();
});

bot.on("callback_query", async (ctx) => {
  const userId = ctx.from.id;
  const data = ctx.callbackQuery.data;

  if (data.startsWith("accept:") || data.startsWith("decline:")) {
    const [action, requestId] = data.split(":");
    const request = await db
      .getPendingConnectionsForUser(userId)
      .then((rows) => rows.find((r) => r.request_id === parseInt(requestId)));
    if (!request) return ctx.answerCbQuery("not your request.");
    if (action === "accept") {
      await db.acceptConnection(request.request_id);
      const requester = await db.getUser(request.requester_id);
      await bot.telegram.sendMessage(
        request.requester_id,
        `@${ctx.from.username} accepted your ${request.relationship_type} request!`
      );
      await ctx.editMessageText(
        `connected with @${requester.username} as ${request.relationship_type}!`
      );
    } else {
      await db.declineConnection(request.request_id);
      const requester = await db.getUser(request.requester_id);
      await bot.telegram.sendMessage(
        request.requester_id,
        `@${ctx.from.username} declined your ${request.relationship_type} request.`
      );
      await ctx.editMessageText("request declined.");
    }
  } else if (
    userStates[userId]?.step === "select_connection" &&
    data.startsWith("conn:")
  ) {
    const selectedUserId = data.split(":")[1];
    userStates[userId] = { step: "select_expression", selectedUserId };
    const keyboard = Object.keys(EXPRESSIONS).map((e) => [
      { text: `${EXPRESSIONS[e].emoji} ${e}`, callback_data: `exp:${e}` },
    ]);
    await ctx.editMessageText("choose an expression:", {
      reply_markup: { inline_keyboard: keyboard },
    });
  } else if (
    userStates[userId]?.step === "select_expression" &&
    data.startsWith("exp:")
  ) {
    const displayName =
      (await db.getDisplayName(ctx.from.id)) ||
      ctx.from.username ||
      ctx.from.first_name;
    const expression = data.split(":")[1];
    const receiverId = userStates[userId].selectedUserId;
    await db.sendExpression(userId, receiverId, expression);
    const receiver = await db.getUser(receiverId);
    await ctx.editMessageText(
      `you sent a ${EXPRESSIONS[expression].emoji} ${expression} to @${receiver.username}!`
    );
    await bot.telegram.sendMessage(
      receiverId,
      `@${displayName} ${EXPRESSIONS[expression].message} ${EXPRESSIONS[expression].emoji}`
    );
    delete userStates[userId];
  } else if (data.startsWith("mood:")) {
    const mood = data.split(":")[1];
    await handleMoodSelection(ctx, mood);
    return ctx.answerCbQuery();
  } else if (data.startsWith("moodcat:")) {
    const categoryKey = data.split(":")[1];
    if (categoryKey === "back") {
      await handleBackToCategories(ctx);
    } else {
      await handleCategorySelection(ctx, categoryKey);
    }
    return ctx.answerCbQuery();
  } else if (data.startsWith("editrel:")) {
    const targetUserId = data.split(":")[1];
    await handleEditRelationship(ctx, targetUserId);
    return ctx.answerCbQuery();
  } else if (data.startsWith("setrel:")) {
    const [, targetUserId, newType] = data.split(":");
    await handleSetRelationship(ctx, targetUserId, newType);
    return ctx.answerCbQuery("Relationship updated!");
  } else if (data === "connections:back") {
    await handleMyConnections(ctx);
    return ctx.answerCbQuery();
  } else if (data.startsWith("setname:")) {
    const targetUserId = data.split(":")[1];
    await handleSetNamePrompt(ctx, targetUserId);
    return ctx.answerCbQuery();
  }
  ctx.answerCbQuery();
});

bot.hears("🔗 connect", (ctx) =>
  ctx.reply("Usage: /connect @username type (partner, friend, bestie)")
);
bot.hears("❌ break the connection", (ctx) =>
  ctx.reply("Usage: /disconnect @username")
);

bot.launch();
console.log("Bot is running...");
