const utils = require('./utils');

class Issue {
    constructor(client) {
        this.HAS_WORKLOG = 'worklogDate IS NOT null';
        this.WEEKLY_WORKLOG = 'worklogDate >= startOfWeek()';
        this.MONTHLY_WORKLOG = 'worklogDate >= startOfMonth()';
        this.client = client;
    }

    activeClient() {
        return !utils.isNullOrEmpty(this.client);
    }

    validateClient() {
        if(!this.activeClient()) {
            throw new Error('client is not set for Issue');
        }
    }

    async Find(task_id) {
        this.validateClient();

        const url = `${this.client.utils.rest_base_path3}/issue/${task_id}`;

        const res = await this.client.Get(url);

        return JSON.parse(res.body);
    }

    async findBy(params) {
        this.validateClient();

        try {
            let query = [];
            query.push(this.HAS_WORKLOG);
            if (!utils.isNullOrEmpty(params.project)) { query.push(`project=${params.project}`); }
            if (!utils.isNullOrEmpty(params.start_date)) { query.push(`worklogDate>=${params.start_date}`); }
            if (!utils.isNullOrEmpty(params.end_date)) { query.push(`worklogDate<=${params.end_date}`); }
            if (!utils.isNullOrEmpty(params.assignee)) { query.push(`assignee='${params.assignee}'`); }
            if (!utils.isNullOrEmpty(params.worklogAuthor)) { query.push(`worklogAuthor='${params.worklogAuthor}'`); }
            if (!utils.isNullOrEmpty(params.epic)) { query.push(`parentEpic=${params.epic}`); }

            const found = await this.Search(query.join(' AND '));
            
            const res = found.filter(issue => {
                return issue.fields?.worklog?.total !== 0
            });

            return res;
        } catch (error) {
            console.error(error.message);
            console.error(error.stack);
            return [];
        }
    }

    async Search(query) {
        this.validateClient();
        try {
            let issues = [];

            do {
                const jql = this.client.utils.jql({query: query, api: 3, fields: null, start_at: issues.length, max_results: 100 });
                const res = await this.client.Get(jql);
                issues = issues.concat(JSON.parse(res.body).issues);
            } while(issues.length !== 0 && issues.length % 100 === 0);

            return issues;    
        } catch (error) {
            console.error(error.message);    
            console.error(error.stack);    
            return [];
        }
    }

    async Weekly() {
        const query = [this.HAS_WORKLOG, this.WEEKLY_WORKLOG].join(' AND ');
        
        return await this.Search(query);
    }

    async Monthly() {
        const query = [this.HAS_WORKLOG, this.MONTHLY_WORKLOG].join(' AND ');

        return await this.Search(query);
    }
}

module.exports = Issue;