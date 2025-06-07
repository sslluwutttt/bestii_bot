const { Telegraf } = require("telegraf");
const db = require("./db");

const bot = new Telegraf(process.env.BOT_TOKEN);

db.initDatabase();

const MOOD_CATEGORIES = [
  { key: "happy", label: "😊 happy" },
  { key: "love", label: "😍 love & Affection" },
  { key: "sad", label: "😢 sad" },
  { key: "angry", label: "😠 angry" },
  { key: "anxious", label: "😰 anxious/worried" },
  { key: "tired", label: "😴 tired" },
  { key: "surprised", label: "😲 surprised/confused" },
  { key: "calm", label: "😌 calm" },
  { key: "playful", label: "😜 playful/fun" },
  { key: "confident", label: "😎 confident/proud" },
  { key: "neutral", label: "😐 neutral/other" },
];

const MOODS = {
  happy: [
    "😊 happy",
    "😄 joyful",
    "🤩 excited",
    "🥳 ecstatic",
    "😁 cheerful",
    "🌱 optimistic",
    "🌈 positive",
    "🦋 inspired",
    "🌟 encouraged",
  ],
  love: [
    "😍 in love",
    "🥰 loving",
    "💕 romantic",
    "💖 affectionate",
    "😘 adoring",
    "💝 smitten",
    "❤️‍🔥 passionate",
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
    "📊 overthinking",
  ],
  tired: [
    "😴 tired",
    "🥱 exhausted",
    "😪 sleepy",
    "🫠 drained",
    "🔥 burnt out",
    "🛏️ need bed",
    "💤 sleepless",
    "🥱 yawning",
    "😮‍💨 exhausted",
    "🧟 zombie mode",
    "📉 no energy",
    "🌙 night owl",
  ],
  surprised: [
    "😲 surprised",
    "😱 shocked",
    "🤯 amazed",
    "😕 confused",
    "🤔 puzzled",
    "😳 stunned",
    "🤷 perplexed",
    "🧐 curious",
    "😰 freaking out",
  ],
  calm: [
    "😌 calm",
    "☮️ peaceful",
    "🕊️ serene",
    "😎 relaxed",
    "😊 content",
    "😌 satisfied",
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
    "🤔 thoughtful",
    "💭 contemplative",
    "☁️ dreamy",
    "🌟 hopeful",
    "🎯 focused",
    "💻 productive",
  ],
};

const EXPRESSION_CATEGORIES = [
  { key: "positive", label: "😊 positive" },
  { key: "care", label: "🤗 care & support" },
  { key: "playful", label: "😜 playful & silly" },
  { key: "neutral", label: "😐 neutral" },
  { key: "negative", label: "😈 mean" },
  { key: "other", label: "✨ other" },
];

const EXPRESSIONS = {
  // Positive
  hug: {
    emoji: "🤗",
    message: "sent you a warm hug!",
    label: "send a hug",
    category: "positive",
  },
  kiss: {
    emoji: "😘",
    message: "blew you a kiss!",
    label: "blow a kiss",
    category: "positive",
  },
  heart: {
    emoji: "❤️",
    message: "sent you love!",
    label: "send love",
    category: "positive",
  },
  cuddle: {
    emoji: "🫂",
    message: "wants to cuddle with you!",
    label: "cuddle",
    category: "positive",
  },
  smile: {
    emoji: "😊",
    message: "smiled at you!",
    label: "send a smile",
    category: "positive",
  },
  wink: {
    emoji: "😉",
    message: "winked at you!",
    label: "wink",
    category: "positive",
  },
  high_five: {
    emoji: "🙏",
    message: "gave you a high five!",
    label: "high five",
    category: "positive",
  },
  thumbs_up: {
    emoji: "👍",
    message: "gave you thumbs up!",
    label: "thumbs up",
    category: "positive",
  },
  clap: {
    emoji: "👏",
    message: "is clapping for you!",
    label: "clap",
    category: "positive",
  },
  handshake: {
    emoji: "🤝",
    message: "shook your hand!",
    label: "handshake",
    category: "positive",
  },
  wave: {
    emoji: "👋",
    message: "waved at you!",
    label: "wave",
    category: "positive",
  },
  sun: {
    emoji: "🌞",
    message: "wished you a good morning!",
    label: "good morning",
    category: "positive",
  },
  moon: {
    emoji: "🌙",
    message: "wished you sweet dreams!",
    label: "sweet dreams",
    category: "positive",
  },
  cheer: {
    emoji: "🎉",
    message: "is cheering for you!",
    label: "cheer",
    category: "positive",
  },
  dance: {
    emoji: "💃",
    message: "is dancing with you!",
    label: "dance",
    category: "positive",
  },
  blush: {
    emoji: "😊",
    message: "blushed because of you!",
    label: "blush",
    category: "positive",
  },
  good_luck: {
    emoji: "🍀",
    message: "wished you good luck!",
    label: "wish good luck",
    category: "positive",
  },
  trophy: {
    emoji: "🏆",
    message: "thinks you deserve a trophy!",
    label: "deserve trophy",
    category: "positive",
  },
  fireworks: {
    emoji: "🎆",
    message: "is celebrating with fireworks!",
    label: "celebrate with fireworks",
    category: "positive",
  },

  // Care & Support
  umbrella: {
    emoji: "☂️",
    message: "offered you an umbrella!",
    label: "offer umbrella",
    category: "care",
  },
  fan: {
    emoji: "🪭",
    message: "offered you a fan!",
    label: "offer a fan",
    category: "care",
  },
  blanket: {
    emoji: "🛏️",
    message: "wrapped you in a warm blanket!",
    label: "warm blanket",
    category: "care",
  },
  medicine: {
    emoji: "💊",
    message: "brought you medicine!",
    label: "bring medicine",
    category: "care",
  },
  bandaid: {
    emoji: "🩹",
    message: "put a band-aid on your boo-boo!",
    label: "put a band-aid",
    category: "care",
  },
  shield: {
    emoji: "🛡️",
    message: "is protecting you!",
    label: "protect",
    category: "care",
  },
  support: {
    emoji: "🫂",
    message: "is here to support you!",
    label: "support",
    category: "care",
  },
  listen: {
    emoji: "👂",
    message: "is here to listen to you",
    label: "listen",
    category: "care",
  },
  comfort: {
    emoji: "🫂",
    message: "is comforting you with a gentle hug",
    label: "comfort",
    category: "care",
  },
  healing: {
    emoji: "💝",
    message: "sent healing energy your way",
    label: "send healing",
    category: "care",
  },
  proud: {
    emoji: "🌟",
    message: "is proud of you!",
    label: "be proud",
    category: "care",
  },
  gratitude: {
    emoji: "🙏",
    message: "is grateful to have you",
    label: "show gratitude",
    category: "care",
  },
  strength: {
    emoji: "💪",
    message: "sends you strength",
    label: "send strength",
    category: "care",
  },

  // Playful
  tickle: {
    emoji: "🤗",
    message: "is tickling you!",
    label: "tickle",
    category: "playful",
  },
  silly_dance: {
    emoji: "👯",
    message: "is doing a silly dance!",
    label: "silly dance",
    category: "playful",
  },
  pat: { emoji: "🐾", message: "pat you!", label: "pat", category: "care" },
  boop: {
    emoji: "👉",
    message: "booped your nose!",
    label: "boop nose",
    category: "playful",
  },
  loud: {
    emoji: "🥁",
    message: "wants you to wake up!",
    label: "wake up!",
    category: "playful",
  },
  peek: {
    emoji: "👀",
    message: "is playing peek-a-boo!",
    label: "peek-a-boo",
    category: "playful",
  },
  microphone: {
    emoji: "🎤",
    message: "sang to you!",
    label: "sing",
    category: "playful",
  },
  detective: {
    emoji: "🕵️",
    message: "is investigating you!",
    label: "investigate",
    category: "other",
  },

  // Neutral
  sleep: {
    emoji: "😴",
    message: "fell asleep on you!",
    label: "fall asleep",
    category: "neutral",
  },
  hungry: {
    emoji: "🤤",
    message: "is drooling with hunger!",
    label: "hungry",
    category: "neutral",
  },
  think: {
    emoji: "🤔",
    message: "is thinking about what you said...",
    label: "think",
    category: "neutral",
  },
  wait: {
    emoji: "⌛",
    message: "asks you to wait a moment...",
    label: "ask to wait",
    category: "neutral",
  },
  silence: {
    emoji: "🤫",
    message: "is enjoying the silence...",
    label: "enjoy silence",
    category: "neutral",
  },

  // mean
  poop: {
    emoji: "💩",
    message: "threw poop at you!",
    label: "throw poop",
    category: "negative",
  },
  slap: {
    emoji: "🖐️",
    message: "slapped you!",
    label: "slap",
    category: "negative",
  },
  ignore: {
    emoji: "🙈",
    message: "is ignoring you.",
    label: "ignore",
    category: "negative",
  },
  facepalm: {
    emoji: "🤦",
    message: "is disappointed in you.",
    label: "facepalm",
    category: "negative",
  },
  eye_roll: {
    emoji: "🙄",
    message: "rolled their eyes at you.",
    label: "roll eyes",
    category: "negative",
  },
  fist: {
    emoji: "👊",
    message: "raised a fist at you!",
    label: "fist bump",
    category: "negative",
  },
  hmph: {
    emoji: "😒",
    message: "said 'hmph!' and turned away!",
    label: "hmph!",
    category: "negative",
  },
  hiss: {
    emoji: "😾",
    message: "hissed at you like an angry cat!",
    label: "hiss",
    category: "negative",
  },
  silent: {
    emoji: "🤐",
    message: "is giving you the silent treatment.",
    label: "silent treatment",
    category: "negative",
  },
  tantrum: {
    emoji: "😤",
    message: "is throwing a tantrum!",
    label: "throw tantrum",
    category: "negative",
  },
  sigh: {
    emoji: "😔",
    message: "sighed deeply at you!",
    label: "sigh",
    category: "negative",
  },
  cry: {
    emoji: "😢",
    message: "is crying because of you!",
    label: "cry",
    category: "negative",
  },

  // Other
  ninja: {
    emoji: "🥷",
    message: "sneaked up on you!",
    label: "ninja mode",
    category: "other",
  },
  magic: {
    emoji: "✨",
    message: "cast a magic spell!",
    label: "cast spell",
    category: "other",
  },
  kitty: {
    emoji: "😺",
    message: "sent kitty purrs!",
    label: "kitty purr",
    category: "other",
  },
  puppy: {
    emoji: "🐶",
    message: "sent puppy kisses!",
    label: "puppy kiss",
    category: "other",
  },
};

const ADMIN_IDS = [437651331];
const userStates = {};

function isAdmin(userId) {
  return ADMIN_IDS.includes(userId);
}

async function handleSetMood(ctx) {
  userStates[ctx.from.id] = { step: "choose_category" };
  const keyboard = MOOD_CATEGORIES.map((cat) => [
    { text: cat.label, callback_data: `moodcat:${cat.key}` },
  ]);
  await ctx.reply(
    "🎭 <b>how are you feeling?</b>\n\nchoose your mood category:",
    {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: keyboard },
    }
  );
}

async function handleCategorySelection(ctx, categoryKey) {
  userStates[ctx.from.id] = { step: "choose_mood", category: categoryKey };
  const moods = MOODS[categoryKey] || [];
  const keyboard = moods.map((m) => [{ text: m, callback_data: `mood:${m}` }]);
  // Добавляем кнопку "⬅️ Back"
  keyboard.push([
    { text: "⬅️ back to categories", callback_data: "moodcat:back" },
    { text: "❌ cancel", callback_data: "cancel" },
  ]);
  await ctx.editMessageText("choose your mood:", {
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleBackToCategories(ctx) {
  userStates[ctx.from.id] = { step: "choose_category" };
  const keyboard = MOOD_CATEGORIES.map((cat) => [
    { text: cat.label, callback_data: `moodcat:${cat.key}` },
  ]);
  keyboard.push([{ text: "❌ Cancel", callback_data: "cancel" }]);
  await ctx.editMessageText("choose your mood category:", {
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleMoodSelection(ctx, mood) {
  await db.setMood(ctx.from.id, mood);
  await db.logUserAction(ctx.from.id, "mood", `set mood to: ${mood}`);
  await ctx.editMessageText(`✅ your mood is now set to <b>${mood}</b>!`, {
    parse_mode: "HTML",
  });
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
  await ctx.reply(`🙋‍♂️ <b>your mood:</b> <i>${mood || "not set"}</i>`, {
    parse_mode: "HTML",
  });
}

async function handleFriendsMoods(ctx) {
  const connections = await db.getConnections(ctx.from.id);
  if (connections.length === 0) return ctx.reply("no connections yet.");
  const list = connections
    .map((c) => `@${c.username} - ${c.mood || "not set"}`)
    .join("\n");
  await ctx.reply(`👀 <b>connections' moods:</b>\n${list}`, {
    parse_mode: "HTML",
  });
}

async function handleSendInteraction(ctx) {
  const userId = ctx.from.id;
  const connections = await db.getConnections(userId);
  if (connections.length === 0) {
    return ctx.reply("😔 <i>no connections yet.</i>", { parse_mode: "HTML" });
  }
  const keyboard = await Promise.all(
    connections.map(async (c) => [
      {
        text: `${
          (await db.getDisplayName(c.user_id)) || c.username || c.user_id
        }`,
        callback_data: `conn:${c.user_id}`,
      },
    ])
  );
  userStates[userId] = { step: "select_connection" };
  await ctx.reply("💌 <b>choose a connection:</b>", {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleMyConnections(ctx) {
  const connections = await db.getConnections(ctx.from.id);
  if (connections.length === 0)
    return ctx.reply("😔 <i>no connections yet.</i>", { parse_mode: "HTML" });
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
  await ctx.reply("👥 <b>Your connections:</b>", {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleSetNamePrompt(ctx, targetUserId) {
  userStates[ctx.from.id] = { step: "set_name", targetUserId };
  await ctx.editMessageText(
    "✏️ <b>send me a new name for this user (max 32 chars):</b>",
    { parse_mode: "HTML" }
  );
}

async function handleEditRelationship(ctx, targetUserId) {
  const types = ["partner", "friend", "bestie"];
  const displayName =
    (await db.getDisplayName(targetUserId)) ||
    connection.username ||
    connection.user_id;

  const connection = (await db.getConnections(ctx.from.id)).find(
    (c) => c.user_id == targetUserId
  );
  if (!connection)
    return ctx.editMessageText("❌ <i>connection not found.</i>", {
      parse_mode: "HTML",
    });
  const keyboard = types
    .filter((t) => t !== connection.relationship_type)
    .map((type) => [
      {
        text: `🔄 change to ${type}`,
        callback_data: `setrel:${targetUserId}:${type}`,
      },
    ]);
  keyboard.push([
    { text: "⬅️ Back", callback_data: "connections:back" },
    { text: "❌ Cancel", callback_data: "cancel" },
  ]);

  await ctx.editMessageText(
    `@${displayName}\ncurrent: ${connection.relationship_type} ${
      connection.relationship_type === "bestie" ? "💓" : "🕺🏻"
    }\nchoose new type:`,
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

bot.command("admin", async (ctx) => {
  if (!isAdmin(ctx.from.id)) {
    return ctx.reply("⛔ access denied");
  }

  const keyboard = [
    [{ text: "📊 recent actions" }],
    [{ text: "📈 statistics" }],
    [{ text: "❌ close admin panel" }],
  ];

  await ctx.reply("🔐 <b>admin Panel</b>\n\nselect an option:", {
    parse_mode: "HTML",
    reply_markup: {
      keyboard,
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  });
});

bot.hears("📊 recent Actions", async (ctx) => {
  if (!isAdmin(ctx.from.id)) return;

  const logs = await db.getRecentLogs(20);
  if (logs.length === 0) {
    return ctx.reply("no recent actions found.");
  }

  const formatLog = (log) => {
    const date = new Date(log.timestamp).toLocaleString();
    return `${date}\n@${log.username}: ${log.action_type}\n${log.details}\n`;
  };

  const message = logs.map(formatLog).join("\n");
  await ctx.reply(`📊 <b>recent Actions:</b>\n\n${message}`, {
    parse_mode: "HTML",
  });
});

bot.hears("📈 statistics", async (ctx) => {
  if (!isAdmin(ctx.from.id)) return;

  const stats = await db
    .prepare(
      `
    SELECT 
      COUNT(DISTINCT user_id) as total_users,
      COUNT(*) as total_actions,
      COUNT(CASE WHEN action_type = 'mood' THEN 1 END) as mood_updates,
      COUNT(CASE WHEN action_type = 'expression' THEN 1 END) as expressions_sent,
      COUNT(CASE WHEN action_type = 'message' THEN 1 END) as messages_received
    FROM logs;
  `
    )
    .get();

  await ctx.reply(
    `📈 <b>statistics:</b>\n\n` +
      `total users: ${stats.total_users}\n` +
      `total actions: ${stats.total_actions}\n` +
      `mood updates: ${stats.mood_updates}\n` +
      `expressions sent: ${stats.expressions_sent}\n` +
      `messages received: ${stats.messages_received}`,
    { parse_mode: "HTML" }
  );
});

bot.hears("❌ close admin panel", async (ctx) => {
  if (!isAdmin(ctx.from.id)) return;

  // Return to normal keyboard
  await ctx.reply("admin panel closed", {
    reply_markup: {
      keyboard: [
        [{ text: "😊 set mood" }, { text: "💌 send interaction" }],
        [{ text: "🙋‍♂️ my mood" }, { text: "👀 friends' moods" }],
        [{ text: "🔗 connect" }, { text: "👥 my connections" }],
        [{ text: "⏳ pending requests" }, { text: "❌ break the connection" }],
        [{ text: "ℹ️ help" }],
      ],
      resize_keyboard: true,
    },
  });
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
  await db.logUserAction(ctx.from.id, "message", 
    `sent message: ${ctx.message.text.slice(0, 50)}...`);
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
  }
  if (
    userStates[userId]?.step === "select_connection" &&
    data.startsWith("conn:")
  ) {
    const selectedUserId = data.split(":")[1];
    userStates[userId] = { step: "select_expression_category", selectedUserId };
    // Показываем категории выражений
    const keyboard = EXPRESSION_CATEGORIES.map((cat) => [
      {
        text: cat.label,
        callback_data: `expcat:${cat.key}`,
      },
    ]);
    keyboard.push([{ text: "⬅️ Back", callback_data: "back:connections" }]);
    await ctx.editMessageText("choose an expression category:", {
      reply_markup: { inline_keyboard: keyboard },
    });
  } else if (
    userStates[userId]?.step === "select_expression_category" &&
    data.startsWith("expcat:")
  ) {
    const categoryKey = data.split(":")[1];
    userStates[userId].step = "select_expression";
    userStates[userId].categoryKey = categoryKey;
    // Показываем выражения выбранной категории
    const expressions = Object.entries(EXPRESSIONS)
      .filter(([_, v]) => v.category === categoryKey)
      .map(([k, v]) => ({
        key: k,
        ...v,
      }));
    const keyboard = expressions.map((e) => [
      {
        text: `${e.emoji} ${e.label}`,
        callback_data: `exp:${e.key}`,
      },
    ]);
    keyboard.push([{ text: "⬅️ Back", callback_data: "back:expcat" }]);
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
    await db.logUserAction(
      userId,
      "expression",
      `sent ${expression} to user ${receiverId}`
    );
    const receiver = await db.getUser(receiverId);
    const receiverDisplayName =
      (await db.getDisplayName(receiverId)) ||
      receiver.username ||
      receiver.first_name;
    await ctx.editMessageText(
      `you sent a ${EXPRESSIONS[expression].emoji} ${expression} to @${receiverDisplayName}!`
    );
    await bot.telegram.sendMessage(
      receiverId,
      `@${displayName} ${EXPRESSIONS[expression].message} ${EXPRESSIONS[expression].emoji}`
    );
    delete userStates[userId];
  } else if (
    userStates[userId]?.step === "select_expression" &&
    data === "back:expcat"
  ) {
    // Вернуться к выбору категории
    userStates[userId].step = "select_expression_category";
    const keyboard = EXPRESSION_CATEGORIES.map((cat) => [
      {
        text: cat.label,
        callback_data: `expcat:${cat.key}`,
      },
    ]);
    keyboard.push([{ text: "⬅️ Back", callback_data: "back:connections" }]);
    await ctx.editMessageText("choose an expression category:", {
      reply_markup: { inline_keyboard: keyboard },
    });
  } else if (
    userStates[userId]?.step === "select_expression_category" &&
    data === "back:connections"
  ) {
    // Вернуться к выбору пользователя
    userStates[userId] = { step: "select_connection" };
    const connections = await db.getConnections(userId);
    const keyboard = await Promise.all(
      connections.map(async (c) => [
        {
          text: `${
            (await db.getDisplayName(c.user_id)) || c.username || c.user_id
          }`,
          callback_data: `conn:${c.user_id}`,
        },
      ])
    );
    await ctx.editMessageText("💌 <b>choose a connection:</b>", {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: keyboard },
    });
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
  } else if (data === "cancel") {
    delete userStates[userId];
    await ctx.editMessageText("❌ <b>Action cancelled.</b>", {
      parse_mode: "HTML",
    });
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
