const ROOT = "http://127.0.0.1:8000";

const urls = {
  refreshToken: `${ROOT}/token/refresh/`,
  verifyToken: `${ROOT}/token/verify/`,
  register: `${ROOT}/register/`,
  login: `${ROOT}/login/`,
  profile: `${ROOT}/profile/`,
  resetPassword: `${ROOT}/send-password-reset-email/`
};

export default urls;
