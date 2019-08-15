import IUser from "../core/base/IUser";
import IAuthorization from '../core/base/IAuthorization';

declare global {
  namespace Express {
    export interface Request {
      authorization?: IAuthorization;
      user?: IUser;
    }
  }
}