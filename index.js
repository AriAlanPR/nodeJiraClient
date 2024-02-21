const OAuth = require('oauth');
const fs = require('fs');

class JiraAuthenticator {
    constructor(jiraBaseUrl, consumerKey, consumerSecretPemPath, callbackUrl = null) {
      this.consumerKey = consumerKey;
      this.consumerSecret = fs.readFileSync(consumerSecretPemPath, 'utf8');
      this.jiraBaseUrl = jiraBaseUrl;
      this.utils = JiraUtils();
      this.oauthClient = new OAuth.OAuth(
        `${this.jiraBaseUrl}/plugins/servlet/oauth/request-token`,
        `${this.jiraBaseUrl}/plugins/servlet/oauth/access-token`,
        this.consumerKey,
        this.consumerSecret,
        '1.0',
        callbackUrl, //authorize-callback-url
        'RSA-SHA1'
      );
    }
  
    async getRequestToken() {
      return new Promise((resolve, reject) => {
        this.oauthClient.getOAuthRequestToken((err, token, secret) => {
          if (err) {
            reject(err);
          } else {
            resolve({ token, secret });
          }
        });
      });
    }
  
    async getAccessToken(requestToken, requestTokenSecret, verifier) {
      return new Promise((resolve, reject) => {
        this.oauthClient.getOAuthAccessToken(
          requestToken,
          requestTokenSecret,
          verifier,
          (err, accessToken, accessTokenSecret) => {
            if (err) {
              reject(err);
            } else {
              this.accessToken = accessToken;
              this.accessTokenSecret = accessTokenSecret;
              resolve({ accessToken, accessTokenSecret });
            }
          }
        );
      });
    }

    setAccessTokens(accessToken, accessTokenSecret) {
        if (!this.accessToken) {
            this.accessToken = {
                token: accessToken,
                secret: accessTokenSecret
            };
        }
    
        return this.accessToken;
    }

    async verifyUserConnection() {
      if(!this.accessToken) {
        throw new Error("Access token not set");
      }

      const res = await this.Get(`${this.jiraBaseUrl}/rest/auth/latest/session`);

      return [null, undefined].includes(res.body?.name);
    }

    async Get(zelda) {      
      return new Promise((resolve, reject) => {
        this.oauthClient.get(
          zelda,
          this.accessToken.token,
          this.accessToken.secret,
          (err, body, res) => {
            if (err) {
              reject(err);
            } else {
              resolve({ body, res });
            }
          }
        )
      });
    }
}

const JiraUtils = function() {
  if(!this.instance) {
    const base_paths = ['/rest/api/latest', '/rest/api/1', '/rest/api/2', '/rest/api/3'];
    
    this.instance = {
      rest_base_path: base_paths[2],
      rest_base_path3: base_paths[3],
      rest_base_path_latest: base_paths[0],
      jql: (options = {}) => {        
        const subpath = options.api && options.api >= 0 && options.api < base_paths.length ?  base_paths[options.api] : base_paths[0];
        
        let url = `${subpath}/search?jql=${encodeURIComponent(options.query)}`;

        if (options.fields) {
            url += `&fields=${options.fields.map(value => encodeURIComponent(value.toString())).join(',')}`;
        }
        if (options.start_at) {
            url += `&startAt=${encodeURIComponent(options.start_at.toString())}`;
        }
        if (options.max_results) {
            url += `&maxResults=${encodeURIComponent(options.max_results.toString())}`;
        }
        if (options.validate_query === false) {
            url += '&validateQuery=false';
        }
        if (options.expand) {
            options.expand = Array.isArray(options.expand) ? options.expand : [options.expand];
            url += `&expand=${options.expand.map(value => encodeURIComponent(value.toString())).join(',')}`;
        }

        return url;
      }
    }
  }

  return this.instance;
}

module.exports = { JiraAuthenticator };