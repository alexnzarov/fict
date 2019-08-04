import bot from '..';
import AppConfig from '../../config';
import escape from 'html-escape';
import logger from '../../core/Logger';
import Database from '../../core/db';

const handlers = {
  sticker: 'sendSticker',
  photo: 'sendPhoto',
  document: 'sendDocument',
  voice: 'sendVoice',
  audio: 'sendAudio',
  video: 'sendVideo',
  text: 'sendMessage'
};

bot.on('message', async (ctx) => {
  if (ctx.chat.type !== 'private') { 
    const reply = ctx.message.reply_to_message;

    if (ctx.chat.id === AppConfig.BOT_SUGGESTION_GROUP && reply && reply.from.username === bot.options.username) {
      if (!reply.forward_from || reply.forward_from.username === bot.options.username) {
        return;
      }

      try {
        const chatId = reply.forward_from.id;
        const msg = ctx.message;

        const u = reply.forward_from;
        const name = escape(u.username ? `@${u.username}` : u.first_name);
        const types = Object.keys(handlers);
        for (let i = 0; i < types.length; i++) {
          const t = types[i];
          
          if (!msg[t]) { continue; }

          const fn = bot.telegram[handlers[t]].bind(bot.telegram);
          const response = t === 'photo' ? msg.photo[0].file_id : (t === 'text' ? msg.text : msg[t].file_id);

          if (t === 'text') {
            if (response === '/ban') {
              const banMsg = [
                `<b>Я заблокировал пересылку сообщений от этого пользователя:</b> <a href="tg://user?id=${u.id}">${name}</a>\n`,
                'Чтобы разблокировать, напиши /unban на одно из сообщений этого пользователя, что я пересылал.'
              ].join('\n');

              const db = await Database.getCollection('fict_bot_sessions');
              await db.updateOne({ key: `${u.id}:${u.id}` }, { $set: { ['data.banned']: true } });

              ctx.replyWithHTML(banMsg);
              bot.telegram.sendMessage(chatId, 'Я больше не буду передавать твои сообщения в предложку 😡').catch(() => {});

              logger.info('Bot banned forwarding from the user', { id: u.id, name, admin: ctx.from.id });

              return;
            }
            else if (response === '/unban') {
              const unbanMsg = `<b>Я разблокировал пересылку сообщений от этого пользователя:</b> <a href="tg://user?id=${u.id}">${name}</a>`;
              
              const db = await Database.getCollection('fict_bot_sessions');
              await db.updateOne({ key: `${u.id}:${u.id}` }, { $set: { ['data.banned']: false } });

              ctx.replyWithHTML(unbanMsg);

              logger.info('Bot unbanned forwarding from the user', { id: u.id, name, admin: ctx.from.id });
              
              return;
            }
          }

          await fn(chatId, response);

          logger.info('Bot replied to the forward', { id: ctx.from.id, username: ctx.from.username || ctx.from.first_name, type: t });

          break;
        }

        ctx.replyWithHTML(`<b>Я успешно отправил ответ этому пользователю:</b> <a href="tg://user?id=${u.id}">${name}</a>`);
      }
      catch (err) {
        ctx.reply(`У меня не получилось ответить этому пользователю:\n${err.toString()}`);

        logger.error('Bot failed to send a reply', { 
          error: err.toString(),
          chat: ctx.chat.id,
          target: reply.forward_from.id,
          sender: ctx.from.id,
        });
      }
    }

    return;
  }

  try {
    if (ctx.session.banned) {
      return;
    }

    const u = ctx.from;
    const forward = (bot as any).telegram.forwardMessage.bind(bot.telegram);
    await bot.telegram.sendMessage(AppConfig.BOT_SUGGESTION_GROUP, `<b>Новое сообщение от</b> <a href="tg://user?id=${u.id}">${escape(u.username ? `@${u.username}` : u.first_name)}</a>:`, { parse_mode: 'HTML' });
    await forward(AppConfig.BOT_SUGGESTION_GROUP, ctx.chat.id, ctx.message.message_id);

    logger.info('Bot forwarded a message', { id: u.id, username: u.username || u.first_name });
  }
  catch (err) {
    logger.error(`Bot failed to forward a message`, { 
      error: err.toString(),
      chat: ctx.chat && ctx.chat.id,
      user: ctx.from && ctx.from.id,
      message: ctx.message && ctx.message.text
    });
  }
});