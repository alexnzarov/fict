import bot from './';
import escape from 'html-escape';

bot.command('/debug', (ctx) => {
  if (ctx.from.id != 311015902) {
    return;
  }

  const from = JSON.stringify(ctx.from, null, 2);
  const chat = JSON.stringify(ctx.chat, null, 2);
  ctx.replyWithHTML(`<pre>From:\n${escape(from)}\n\nChat:\n${escape(chat)}</pre>`);
});