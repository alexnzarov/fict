import bot from './';
import AppConfig from '../config';
import escape from 'html-escape';

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

        // TODO: make it prettier
        if (msg.sticker) { await bot.telegram.sendSticker(chatId, msg.sticker.file_id); }
        else if (msg.photo) { await bot.telegram.sendPhoto(chatId, msg.photo[0].file_id); }
        else if (msg.document) { await bot.telegram.sendDocument(chatId, msg.document.file_id); }
        else if (msg.voice) { await bot.telegram.sendVoice(chatId, msg.voice.file_id); }
        else if (msg.audio) { await bot.telegram.sendAudio(chatId, msg.audio.file_id); }
        else if (msg.video) { await bot.telegram.sendVideo(chatId, msg.video.file_id); }
        else { await bot.telegram.sendMessage(reply.forward_from.id, msg.text); }

        const u = reply.forward_from;
        ctx.replyWithHTML(`<b>Я успешно отправил ответ этому пользователю: </b> <a href="tg://user?id=${u.id}">${escape(u.username ? `@${u.username}` : u.first_name)}</a>`);
      }
      catch (err) {
        ctx.reply(`У меня не получилось ответить этому пользователю:\n${err.toString()}`);
      }
    }

    return;
  }

  const u = ctx.from;
  const forward = (bot as any).telegram.forwardMessage.bind(bot.telegram);
  await bot.telegram.sendMessage(AppConfig.BOT_SUGGESTION_GROUP, `<b>Новое сообщение от</b> <a href="tg://user?id=${u.id}">${escape(u.username ? `@${u.username}` : u.first_name)}</a>:`, { parse_mode: 'HTML' });
  forward(AppConfig.BOT_SUGGESTION_GROUP, ctx.chat.id, ctx.message.message_id);
});