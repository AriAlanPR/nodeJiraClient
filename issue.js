
class Issue {
    constructor(client) {
        this.HAS_WORKLOG = 'worklogDate IS NOT null';
        this.WEEKLY_WORKLOG = 'worklogDate >= startOfWeek()';
        this.MONTHLY_WORKLOG = 'worklogDate >= startOfMonth()';
        this.client = client;
    }

    activeClient() {
        return ![null, undefined].includes(this.client);
    }

    async Weekly() {
        if(!this.activeClient()) {
            throw new Error('client is not set for Issue');
        }

        let issues = [];
        const query = [this.HAS_WORKLOG, this.WEEKLY_WORKLOG].join(' AND ');
        do {
            const jql = this.client.utils.jql({query: query, api: 3, fields: null, start_at: issues.length, max_results: 100 });
            const res = await this.client.Get(jql);

            issues = issues.concat(JSON.parse(res.body).issues);
        } while(issues.length !== 0 && issues.length % 100 === 0);

        return issues;
    }

    async Monthly() {
        if(!this.activeClient) {
            throw new Error('client is not set for Issue');
        }

        let issues = [];
        const query = [this.HAS_WORKLOG, this.MONTHLY_WORKLOG].join(' AND ');

        do {
            const jql = this.client.utils.jql({query: query, api: 3, fields: null, start_at: issues.length, max_results: 100 });
            const res = await this.client.Get(jql);
            issues.concat(res?.issues || []);
        } while(issues.length !== 0 && issues.length % 100 === 0);

        return issues;
    }
}

module.exports = Issue;