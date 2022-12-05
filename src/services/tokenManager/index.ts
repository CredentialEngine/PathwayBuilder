import { isEmptyValue } from '../../utils/object';

export const TOKEN_STORAGE_KEY = 'pb_token';
type Token = string | undefined;

const getToken = () => localStorage.getItem(TOKEN_STORAGE_KEY) || '';
//const getTokenWithoutBearer = () => localStorage.getItem(TOKEN_STORAGE_KEY)?.replace('Bearer ', '') || '';
const setToken = (token: Token) =>
  localStorage.setItem(TOKEN_STORAGE_KEY, token || '');
const removeToken = () => localStorage.removeItem(TOKEN_STORAGE_KEY);

const isValidToken = () => {
  const token = getToken();
  if (!isEmptyValue(token)) {
    //const decodedToken = jwt_decode(token || '');
    //const expiresTime = parseInt(get(decodedToken, 'exp')) * 1000;
    //return expiresTime > new Date().getTime();
    return true;
  }
  return false;
};

const TokenManager = {
  getToken,
  setToken,
  removeToken,
  isValidToken,
};

export default TokenManager;
