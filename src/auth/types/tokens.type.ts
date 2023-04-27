interface IUser {
  id: string;
  email: string;
}
export type Tokens = {
  user?: IUser;
  accessToken: string;
  refreshToken: string;
};
