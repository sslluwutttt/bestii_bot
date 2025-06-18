const { Markup } = require("telegraf");
const db = require("./db");

const apologyStates = {};

const QUESTIONS = [
  {
    key: "infraction_type",
    type: "single",
    text: `🙏 what's your infraction type? choose one:`,
    options: [
      { key: "words", label: "said something wrong" },
      { key: "actions", label: "did something wrong" },
      { key: "inactions", label: "did not take action" },
    ],
  },
  {
    key: "what_happened",
    type: "text",
    text: "📝 write a few sentences about what exactly you did wrong:",
  },
  {
    key: "reasons",
    type: "multi",
    text: "💭 what reasons do you have for your behavior? select all that apply:",
    options: [
      { key: "wasnt_thinking", label: "i wasn't thinking" },
      { key: "felt_right", label: "it felt right at the time" },
      { key: "overwhelmed", label: "i was overwhelmed/stressed" },
      { key: "misunderstood", label: "i misunderstood the situation" },
      { key: "funny", label: "i was trying to be funny (and failed)" },
      { key: "impress", label: "i was trying to impress someone else" },
      { key: "insecure", label: "i was feeling insecure" },
      { key: "forgot", label: "i forgot about it" },
      { key: "forgot_important", label: "i forgot that it's important to you" },
      { key: "impulsively", label: "i acted impulsively" },
      { key: "matter", label: "i thought it wouldn't matter" },
      { key: "influenced", label: "i was hungry/tired/drunk" },
      { key: "fool", label: "i'm just a fool" },
      { key: "stupid", label: "i'm just stupid" },
    ],
  },
  {
    key: "myfeelings",
    type: "multi",
    text: "💭 what do you feel now? select all that apply:",
    options: [
      { key: "guilty", label: "guilty" },
      { key: "ashamed", label: "ashamed" },
      { key: "sorry", label: "really sorry" },
      { key: "feel_stupid", label: "stupid" },
      { key: "regretful", label: "regretful but learning" },
      { key: "hopeful", label: "hoping you'll forgive me" },
      { key: "fix", label: "ready to fix this" },
      { key: "vindicated", label: "vindicated" },
    ],
  },
  {
    key: "yourfeelings",
    type: "multi",
    text: "DYNAMIC", // placeholder
    options: [
      { key: "hurt", label: "hurt" },
      { key: "angry", label: "angry" },
      { key: "disappointed", label: "disappointed" },
      { key: "confused", label: "confused" },
      { key: "ignored", label: "ignored" },
      { key: "sad", label: "sad" },
      { key: "deserve_better", label: "like you deserve better" },
    ],
  },
  {
    key: "sincerety",
    type: "single",
    text: `🙏 what's your sincerity level? how sorry are you? choose one:`,
    options: [
      { key: "heartfelt", label: "❤️ heartfelt" },
      { key: "begrudging", label: "😐 begrudging" },
      { key: "technical", label: "🛠️ technical" },
    ],
  },
  {
    key: "promises",
    type: "multi",
    text: `💭 what promises can you make? what will (or won't) you do next time? select all that apply:`,
    options: [
      { key: "will_change", label: "i will change my behavior" },
      { key: "will_communicate", label: "i will communicate better" },
      { key: "will_listen", label: "i will listen to you more" },
      { key: "will_apologize", label: "i will apologize sincerely" },
      { key: "will_make_amends", label: "i will make amends" },
      {
        key: "will_respect_boundaries",
        label: "i will respect your boundaries",
      },
      {
        key: "will_take_responsibility",
        label: "i will take responsibility for my actions",
      },
      { key: "wont_repeat_this", label: "i won't repeat this behavior" },
      {
        key: "will_make_up",
        label: "i will make up for it. tell me what to do",
      },
    ],
  },
  {
    key: "comments",
    type: "text",
    text: "📝 write any additional comments you'd like to add:",
  },
  {
    key: "signature",
    type: "text",
    text: "📝 write signature (state your legal name or nickname):",
  },
];

async function startApology(ctx) {
  const userId = ctx.from.id;
  const connections = await db.getConnections(userId);
  if (!connections.length) {
    return ctx.reply("😔 you have no connections to send an apology to.", {
      parse_mode: "HTML",
    });
  }
  apologyStates[userId] = { step: "select_connection", answers: {} };
  const keyboard = await Promise.all(
    connections.map(async (c) => [
      {
        text: `${c.display_name || c.username || c.user_id}`,
        callback_data: `apology_conn:${c.user_id}`,
      },
    ])
  );
  await ctx.reply("🙏 who do you want to apologize to?", {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleCallback(ctx) {
  const userId = ctx.from.id;
  const state = apologyStates[userId];
  const data = ctx.callbackQuery.data;
  if (!state && !data.startsWith("apology_resp:")) return false;

  if (data.startsWith("apology_resp:")) {
    return await handleResponse(ctx);
  }

  if (
    state &&
    state.step === "select_connection" &&
    data.startsWith("apology_conn:")
  ) {
    state.connectionId = data.split(":")[1];
    state.step = 0;
    state.answers = {};
    await askQuestion(ctx, userId, 0);
    return true;
  }

  if (state && typeof state.step === "number") {
    const q = QUESTIONS[state.step];
    if (q.type === "single" && data.startsWith("apology_q:")) {
      state.answers[q.key] = data.split(":")[1];
      await nextQuestion(ctx, userId);
      return true;
    }
    if (q.type === "multi" && data.startsWith("apology_qm:")) {
      const val = data.split(":")[1];
      state.answers[q.key] = state.answers[q.key] || [];
      if (state.answers[q.key].includes(val)) {
        state.answers[q.key] = state.answers[q.key].filter((v) => v !== val);
      } else {
        state.answers[q.key].push(val);
      }
      await askQuestion(ctx, userId, state.step, true);
      return true;
    }
    if (data === "apology_next") {
      await nextQuestion(ctx, userId);
      return true;
    }
    if (data === "apology_back") {
      await prevQuestion(ctx, userId);
      return true;
    }
    if (data === "apology_cancel") {
      delete apologyStates[userId];
      await ctx.editMessageText("❌ apology form cancelled.", {
        parse_mode: "HTML",
      });
      return true;
    }
  }
  return false;
}

async function handleText(ctx) {
  const userId = ctx.from.id;
  const state = apologyStates[userId];
  if (!state || typeof state.step !== "number") return false;
  const q = QUESTIONS[state.step];
  if (q.type === "text") {
    state.answers[q.key] = ctx.message.text.trim().slice(0, 200);
    await nextQuestion(ctx, userId);
    return true;
  }
  return false;
}

async function askQuestion(ctx, userId, idx, edit = false) {
  const q = { ...QUESTIONS[idx] };
  // dynamic text for yourfeelings
  if (q.key === "yourfeelings") {
    const state = apologyStates[userId];
    const receiver = await db.getUser(state.connectionId);
    q.text = `💭 what do you think @${
      receiver.username || receiver.user_id
    } feels? select all that apply:`;
  }
  apologyStates[userId].step = idx;
  let keyboard = [];
  if (q.type === "single") {
    keyboard = q.options.map((opt) => [
      { text: opt.label, callback_data: `apology_q:${opt.key}` },
    ]);
  } else if (q.type === "multi") {
    const selected = apologyStates[userId].answers[q.key] || [];
    keyboard = q.options.map((opt) => [
      {
        text: `${selected.includes(opt.key) ? "✅ " : ""}${opt.label}`,
        callback_data: `apology_qm:${opt.key}`,
      },
    ]);
    keyboard.push([{ text: "next ➡️", callback_data: "apology_next" }]);
  }
  if (idx > 0)
    keyboard.push([{ text: "⬅️ back", callback_data: "apology_back" }]);
  keyboard.push([{ text: "❌ cancel", callback_data: "apology_cancel" }]);
  if (q.type === "text") {
    if (edit) {
      await ctx.editMessageText(q.text.toLowerCase(), {
        parse_mode: "HTML",
        reply_markup: { inline_keyboard: keyboard },
      });
    } else {
      await ctx.reply(q.text.toLowerCase(), {
        parse_mode: "HTML",
        reply_markup: { inline_keyboard: keyboard },
      });
    }
  } else {
    if (edit) {
      await ctx.editMessageText(q.text.toLowerCase(), {
        parse_mode: "HTML",
        reply_markup: { inline_keyboard: keyboard },
      });
    } else {
      await ctx.reply(q.text.toLowerCase(), {
        parse_mode: "HTML",
        reply_markup: { inline_keyboard: keyboard },
      });
    }
  }
}

async function nextQuestion(ctx, userId) {
  const state = apologyStates[userId];
  if (typeof state.step !== "number") return;
  if (state.step < QUESTIONS.length - 1) {
    await askQuestion(ctx, userId, state.step + 1);
  } else {
    await finishApology(ctx, userId);
  }
}

async function prevQuestion(ctx, userId) {
  const state = apologyStates[userId];
  if (typeof state.step !== "number" || state.step === 0) return;
  await askQuestion(ctx, userId, state.step - 1);
}

async function finishApology(ctx, userId) {
  const state = apologyStates[userId];
  const receiverId = state.connectionId;
  const sender = await db.getUser(userId);
  const receiver = await db.getUser(receiverId);
  let msg = `🙏 <b>apology form from @${(
    sender.username || sender.user_id
  ).toLowerCase()}</b>\n\n`;
  msg += `<b>infraction type:</b> ${(
    state.answers.infraction_type || "-"
  ).toLowerCase()}\n`;
  msg += `<b>what happened:</b> ${(
    state.answers.what_happened || "-"
  ).toLowerCase()}\n`;
  msg += `<b>reasons:</b> ${
    (state.answers.reasons || []).map((x) => x.toLowerCase()).join(", ") || "-"
  }\n`;
  msg += `<b>my feelings:</b> ${
    (state.answers.myfeelings || []).map((x) => x.toLowerCase()).join(", ") ||
    "-"
  }\n`;
  msg += `<b>what you feel:</b> ${
    (state.answers.yourfeelings || []).map((x) => x.toLowerCase()).join(", ") ||
    "-"
  }\n`;
  msg += `<b>sincerety:</b> ${(
    state.answers.sincerety || "-"
  ).toLowerCase()}\n`;
  msg += `<b>promises:</b> ${
    (state.answers.promises || []).map((x) => x.toLowerCase()).join(", ") || "-"
  }\n`;
  msg += `<b>comments:</b> ${(state.answers.comments || "-").toLowerCase()}\n`;
  msg += `<b>signature:</b> ${(
    state.answers.signature || "-"
  ).toLowerCase()}\n`;
  msg += "\nwhat will you do?";
  await ctx.reply("✅ your apology form has been sent!", {
    parse_mode: "HTML",
  });
  await ctx.telegram.sendMessage(receiverId, msg, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "forgive 🙏",
            callback_data: `apology_resp:forgive:${userId}`,
          },
          {
            text: "not forgive ❌",
            callback_data: `apology_resp:notforgive:${userId}`,
          },
        ],
      ],
    },
  });
  delete apologyStates[userId];
}

async function handleResponse(ctx) {
  const data = ctx.callbackQuery.data;
  if (!data.startsWith("apology_resp:")) return false;
  const [, action, senderId] = data.split(":");
  const sender = await db.getUser(senderId);
  const receiver = ctx.from;
  let msg = "";
  if (action === "forgive") {
    msg = `🎉 your apology was accepted by @${
      receiver.username || receiver.id
    }!`;
  } else {
    msg = `😔 your apology was not accepted by @${
      receiver.username || receiver.id
    }.`;
  }
  await ctx.editMessageText(
    action === "forgive"
      ? "you forgave this apology 🙏"
      : "you did not forgive this apology ❌",
    { parse_mode: "HTML" }
  );
  await ctx.telegram.sendMessage(senderId, msg, { parse_mode: "HTML" });
  return true;
}

module.exports = {
  startApology,
  handleCallback,
  handleText,
  handleResponse,
};
