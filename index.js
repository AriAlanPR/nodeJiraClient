const OAuth = require('oauth');
const fs = require('fs');

class JiraAuthenticator {
    constructor(jiraBaseUrl, consumerKey, consumerSecretPemPath, callbackUrl = null) {
      this.consumerKey = consumerKey;
      this.consumerSecret = fs.readFileSync(consumerSecretPemPath, 'utf8');
      this.jiraBaseUrl = jiraBaseUrl;
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

    Get(zelda, handler) {
        this.oauthClient.get(
            zelda,
            this.accessToken.token,
            this.accessToken.secret,
            handler
        )
    }
}

exports = JiraAuthenticator;