export default class Scope {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.errors = {};
    this.auth = {};
    this.read = {};
    this.created = {};
    this.updated = {};
    this.deleted = {};
  }
  addItem(action, item) {
    if (this[action][item._type]) {
      this[action][item._type].push(item);
    } else {
      this[action][item._type] = [item];
    }
  }
}
