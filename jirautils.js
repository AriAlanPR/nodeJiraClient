class JiraUtils {
    constructor() {
      this.BASE_PATHS = ['rest/api/latest', 'rest/api/1', 'rest/api/2', 'rest/api/3'];
      this.rest_base_path = this.BASE_PATHS[2];
      this.rest_base_path3 = this.BASE_PATHS[3];
      this.rest_base_path_latest = this.BASE_PATHS[0];
    }
  
    jql(options = {}) {
      const subpath = options.api && options.api >= 0 && options.api < this.BASE_PATHS.length ? this.BASE_PATHS[options.api] : this.BASE_PATHS[0];
  
      let url = `${subpath}/search?jql=${encodeURIComponent(options.query)}`;
    
      const nullOrEmpty = [null, undefined];

      if (options.fields) {
        url += `&fields=${options.fields.map(value => encodeURIComponent(value.toString())).join(',')}`;
      }
      if (!nullOrEmpty.includes(options.start_at)) {
        url += `&startAt=${encodeURIComponent(options.start_at.toString())}`;
      }
      if (!nullOrEmpty.includes(options.max_results)) {
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

  module.exports = JiraUtils;