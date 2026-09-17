import type { IUser } from "@/types/user";

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
}

export interface IAuthSession extends IAuthTokens {
  user: IUser;
}

export interface ILoginPayload {
  username: string;
  password: string;
}
