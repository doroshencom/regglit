
class DataService {
  static saveCycleData(cycleData) {
    const data = JSON.parse(localStorage.getItem('cycles')) || [];
    data.push(cycleData);
    localStorage.setItem('cycles', JSON.stringify(data));
  }

  static getCycleData() {
    return JSON.parse(localStorage.getItem('cycles')) || [];
  }
}

export default DataService;
