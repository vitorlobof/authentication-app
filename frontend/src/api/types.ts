export type TokenPairData = {
  token: {
    access: string;
    refresh: string;
  };
  detail: string;
};

export type RegisterServerErrors = {
  username?: string[];
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
};

export type LoginServerErrors = {
  username_or_email?: string[];
  password?: string[];
  non_field_errors?: string[];
};

export type PasswordResetServerMsgs = {
  detail?: string[];
  email?: string[];
  non_field_errors?: string[]
}
