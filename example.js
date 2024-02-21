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
)

p(ja);

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
    const res = await ja.Get(`${jiraBaseUrl}${ja.utils.rest_base_path3}/issue/${ticket}`);
    
    p("----------------------------------------------------------")
    p("build jql query");
    
    let url = ja.utils.jql('your_query', { fields: ['field1', 'field2'], start_at: 1, max_results: 10 });
    p(url);
    
    p("----------------------------------------------------------")
    p("build a url with a subpath with possibity to specify a range of results");
    let url2 = ja.utils.query('subpath', { start_at: 1, max_results: 10 });
    p(url2);

    p("got data");
    p("----------------------------------------------------------")
    p(res.body);

})();

module.exports = {};