const local = window.localStorage;
const session = window.sessionStorage;

const removeStorage = function(local, key) {
  if (!key) return;
  local.removeItem(key);
};

const getStorage = function(local, key) {
  let value = key ? local.getItem(key) : null;
  try {
    value = value ? JSON.parse(value) : value;
  } catch (error) {}
  return value;
};

const setStorage = function(local, key, value) {
  if (!key) return;

  const _value = typeof value === "object" ? JSON.stringify(value) : value;
  local.setItem(key, _value);
};

export const removeLocal = key => removeStorage(local, key);
export const setLocal = (key, value) => setStorage(local, key, value);
export const getLocal = key => getStorage(local, key);
export const removeSession = key => removeStorage(session, key);
export const setSession = (key, value) => setStorage(session, key, value);
export const getSession = key => getStorage(session, key);
