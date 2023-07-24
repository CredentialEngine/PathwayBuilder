import TokenManager, { TOKEN_STORAGE_KEY } from '../index';

describe('TokenManager', () => {
  const fakeToken = 'jwtToken';

  beforeEach(() => {
    localStorage.clear();
    TokenManager.removeToken();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should get token from localStorage when localStorage contain jwt_token', () => {
    const tokenManager = TokenManager;
    expect(tokenManager.getToken()).toBe('');
    localStorage.setItem(TOKEN_STORAGE_KEY, fakeToken);
    expect(tokenManager.getToken()).toBe(fakeToken);
  });

  it('should set token successfully', () => {
    const tokenManager = TokenManager;
    expect(tokenManager.getToken()).toBe('');
    tokenManager.setToken(fakeToken);
    expect(tokenManager.getToken()).toBe(fakeToken);
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe(fakeToken);
  });

  it('should remove token successfully', () => {
    const tokenManager = TokenManager;
    tokenManager.setToken('token');
    expect(tokenManager.getToken()).toEqual('token');
    tokenManager.removeToken();
    expect(tokenManager.getToken()).toBe('');
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe(null);
  });

  it('should isValidToken return false when token is empty', () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, '');
    const tokenManager = TokenManager;
    expect(tokenManager.isValidToken()).toBe(false);
  });
});
