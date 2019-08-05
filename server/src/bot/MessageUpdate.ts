import { ContextMessageUpdate } from 'telegraf';

export default interface MessageUpdate extends ContextMessageUpdate {
  session: any;
};