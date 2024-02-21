require('dotenv').config();
let JiraAuthenticator = require('./index.js');
const echo = console.log;
const p = echo;

const jiraBaseUrl = process.env.JIRA_BASE_URL;
const consumerKey = process.env.JIRA_CONSUMER_KEY;
const consumerSecretPath = `${process.cwd()}/${process.env.JIRA_CONSUMER_SECRET_PATH}`;
const accessToken = process.env.JIRA_ACCESS_TOKEN;
const accessTokenSecret = process.env.JIRA_ACCESS_TOKEN_SECRET;

p(JiraAuthenticator);

let ja = new JiraAuthenticator(
    jiraBaseUrl,
    consumerKey,
    consumerSecretPath,
    null
)

p(ja);
p(ja.setAccessTokens(accessToken, accessTokenSecret));
ja.Get(
    'https://dmcstrategicit.atlassian.net/rest/api/3/issue/JSUITE-475',
    function (e, data, res){
        if (e) console.error(e);
        p("got data");
        p("----------------------------------------------------------")
        p(require('util').inspect(data));  
    }       
);