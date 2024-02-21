
class Issue {
    constructor(client) {
        this.HAS_WORKLOG = 'worklogDate IS NOT null';
        this.WEEKLY_WORKLOG = 'worklogDate >= startOfWeek()';
        this.MONTHLY_WORKLOG = 'worklogDate >= startOfMonth()';
        this.client = client;
    }

    activeClient() {
        return [null, undefined].includes(this.client);
    }

    Weekly() {
        if(!this.activeClient()) {
            throw new Error('client is not set for Issue');
        }

        const query = [this.HAS_WORKLOG, this.WEEKLY_WORKLOG].join(' AND ');
        const jql = client.utils.jql({query: query, api: 3, fields: null, start_at: null, max_results: null });
        return this.client.Get(jql);
    }

    Monthly() {
        if(!this.activeClient) {
            throw new Error('client is not set for Issue');
        }

        const query = [this.HAS_WORKLOG, this.MONTHLY_WORKLOG].join(' AND ');
        const jql = client.utils.jql({query: query, api: 3, fields: null, start_at: null, max_results: null });
        return this.client.Get(jql);
    }
}

module.exports = Issue;