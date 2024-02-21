# nodeJiraClient

This allows to make requests to Jira API using OAuth 1.0 and RSA-SHA1 method with a .pem certificate.
To begin, you can create a .env file containing the following parameters which must be provided:

```
JIRA_CONSUMER_KEY=
JIRA_ACCESS_TOKEN=
JIRA_ACCESS_TOKEN_SECRET=
JIRA_BASE_URL=
JIRA_CONSUMER_SECRET_PATH=
```
where:
```
JIRA_CONSUMER_KEY: the consumer key of your Jira instance. By default is always 'OauthKey'.
JIRA_CONSUMER_SECRET_PATH: the path to your .pem certificate file.
JIRA_ACCESS_TOKEN: The access token of the user you're going to authenticate with, in case you already have it.
JIRA_ACCESS_TOKEN_SECRET= The access token secret of the user you're going to authenticate with, in case you already have it.
JIRA_BASE_URL: The host url of your Jira instance.
```

import with
commonJS: 
`const jiraAuthenticator = require('oauth-jira').JiraAuthenticator;`

ES module:
`import { JiraAuthenticator } from 'oauth-jira';`

The class JiraAuthenticator contains a property named `utils` with some helper methods to make easier requests to jira.

For more details, please review the example included in this package.