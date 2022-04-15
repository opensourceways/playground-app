let authCode = "";
let authIdentity = "";

export function setAuthCode(code) {
  authCode = code;
}

export function getAuthCode() {
  return authCode;
}

export function setAuthIdentity(identity) {
  authIdentity = identity;
}

export function getAuthIdentity() {
  return authIdentity;
}
