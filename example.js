require('dotenv').config();
const echo = console.log;
const p = echo;
const JiraAuthenticator = require('./index.js').JiraAuthenticator;

const jiraBaseUrl = process.env.JIRA_BASE_URL;
const consumerKey = process.env.JIRA_CONSUMER_KEY;
const consumerSecretPath = `${process.cwd()}/${process.env.JIRA_CONSUMER_SECRET_PATH}`;
const accessToken = process.env.JIRA_ACCESS_TOKEN;
const accessTokenSecret = process.env.JIRA_ACCESS_TOKEN_SECRET;
const ticket = process.env.TICKET;

let ja = new JiraAuthenticator(
    jiraBaseUrl,
    consumerKey,
    consumerSecretPath,
    null
);

(async function() {
    p("set access tokens");
    p(ja.setAccessTokens(accessToken, accessTokenSecret));
    p("helper api paths");
    p("----------------------------------------------------------")
    p(ja.utils.rest_base_path);
    p(ja.utils.rest_base_path3);
    p(ja.utils.rest_base_path_latest);

    p("----------------------------------------------------------")
    p("verify user connection");
    let isConnected = await ja.verifyUserConnection();
    p("is connected: ", isConnected);
    
    p("----------------------------------------------------------")
    p("build jql query");
    
    let url = ja.utils.jql({query: 'your_query', api: 3, fields: ['field1', 'field2'], start_at: 1, max_results: 10 });
    p(url);

    p("test a request to a jira issue");
    p("----------------------------------------------------------")
    const res = await ja.Get(`${ja.utils.rest_base_path3}/issue/${ticket}`);
    p(res.body);

})();

module.exports = {};