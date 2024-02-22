class Utils {
    constructor() {
        this.nullOrEmpty = [null, undefined, ""];
    }

    isNullOrEmpty(val) {
        return this.nullOrEmpty.includes(val) || (typeof val === 'object' && Object.keys(val).length < 1);
    }
}

module.exports = new Utils();