export default class DataManager {
  constructor(options) {
    if (options && options.data) {
      this.data = options.data;
    }
  }
  setData(data) {
    this.data = data;
  }
  getData() {
    return this.data;
  }
  updateData(data) {
    this.data = {
      ...this.data,
      ...data
    }
  }
}