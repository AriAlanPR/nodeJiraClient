const OAuth = require('oauth');
const fs = require('fs');
const JiraUtils = require('./jirautils.js');
const Issue = require('./issue.js');

class JiraAuthenticator {
    constructor(jiraBaseUrl, consumerKey, consumerSecretPemPath, callbackUrl = null) {
      this.consumerKey = consumerKey;
      this.consumerSecret = fs.readFileSync(consumerSecretPemPath, 'utf8');
      this.jiraBaseUrl = jiraBaseUrl;
      this.utils = new JiraUtils();
      this.oauthClient = new OAuth.OAuth(
        `${this.jiraBaseUrl}/plugins/servlet/oauth/request-token`,
        `${this.jiraBaseUrl}/plugins/servlet/oauth/access-token`,
        this.consumerKey,
        this.consumerSecret,
        '1.0',
        callbackUrl, //authorize-callback-url
        'RSA-SHA1'
      );

      this.issue = new Issue(this);
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

      const res = await this.Get('rest/auth/latest/session');

      return [null, undefined].includes(res.body?.name);
    }

    async Get(zelda) {      
      return new Promise((resolve, reject) => {
        const link = `${this.jiraBaseUrl}/${zelda}`;
        console.log("GET", link);
        this.oauthClient.get(
          link,
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

module.exports = JiraAuthenticator;