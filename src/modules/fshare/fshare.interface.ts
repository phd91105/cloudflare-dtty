export type FshareAccount = {
  user_email?: string;
  password?: string;
};

export type FshareAuthResponse = {
  token?: string;
  session_id?: string;
};

export type FshareFileResponse = {
  location: string;
};
