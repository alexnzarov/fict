import { IUser, UserPermissions } from './base';
import Database from './db';

export default class User implements IUser {
  public id: number;
  public permissions: UserPermissions;

  public elder?: boolean;
  public name?: string;
  public username?: string;
  public description?: string;

  constructor(user: IUser) {
    Object.assign(this, user);
  }

  private static getCollection() { return Database.getCollection<IUser>('fict_users'); }

  public static async get(id: number) { 
    const collection = await User.getCollection();
    const user = await collection.findOne({ id });

    return user ? new User(user) : null;
  }

  public static default(id: number, permissions: number = UserPermissions.NONE) {
    return new User({ id, permissions });
  }
};