import { setLocal, getLocal } from "./storage";

const key = "iosec_user";

export const setUser = (user) => setLocal(key, user);
export const getUser = () => getLocal(key);
