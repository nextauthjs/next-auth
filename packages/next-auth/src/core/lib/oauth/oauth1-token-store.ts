const _storage = new Map();

const oAuth1TokenStore = {
  setTokenSecret: (token, tokenSecret) => _storage.set(token, tokenSecret),
  getTokenSecret: function (token) { 
    return _storage.get(token); 
  },
  removeTokenSecret: (token) => _storage.delete(token),
}

export default oAuth1TokenStore;