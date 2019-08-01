import bot from './';
import AppConfig from '../config';
import escape from 'html-escape';
import logger from '../core/Logger';

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

        const types = Object.keys(handlers);
        for (let i = 0; i < types.length; i++) {
          const t = types[i];
          
          if (!msg[t]) { continue; }

          const fn = bot.telegram[handlers[t]].bind(bot.telegram);
          const response = t === 'photo' ? msg.photo[0].file_id : (t === 'text' ? msg.text : msg[t].file_id);

          await fn(chatId, response);

          break;
        }

        const u = reply.forward_from;
        ctx.replyWithHTML(`<b>Я успешно отправил ответ этому пользователю: </b> <a href="tg://user?id=${u.id}">${escape(u.username ? `@${u.username}` : u.first_name)}</a>`);
      }
      catch (err) {
        ctx.reply(`У меня не получилось ответить этому пользователю:\n${err.toString()}`);
      }
    }

    return;
  }

  try {
    const u = ctx.from;
    const forward = (bot as any).telegram.forwardMessage.bind(bot.telegram);
    await bot.telegram.sendMessage(AppConfig.BOT_SUGGESTION_GROUP, `<b>Новое сообщение от</b> <a href="tg://user?id=${u.id}">${escape(u.username ? `@${u.username}` : u.first_name)}</a>:`, { parse_mode: 'HTML' });
    await forward(AppConfig.BOT_SUGGESTION_GROUP, ctx.chat.id, ctx.message.message_id);
  }
  catch (err) {
    logger.error(`Failed to forward a message`, { 
      error: err.toString(),
      chat: ctx.chat && ctx.chat.id,
      user: ctx.from && ctx.from.id,
      message: ctx.message && ctx.message.text
    });
  }
});