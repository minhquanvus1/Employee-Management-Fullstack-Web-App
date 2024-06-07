import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_BASE_URL
    : process.env.REACT_APP_DEV_BASE_URL;
class EmployeeService {
  //**Method to get all employee from our api or database */
  getAllEmployee() {
    console.log("base url is", BASE_URL);
    return axios.get(BASE_URL);
  }
  /**MEthod to save employee */
  saveEmployee(employeeData) {
    return axios.post(`${BASE_URL}`, employeeData);
  }
  updateEmployee(id, employeeData) {
    return axios.put(`${BASE_URL}/${id}`, employeeData);
  }
  getEmployeeById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }
  deleteEmployee(id) {
    return axios.delete(`${BASE_URL}` + "/" + id);
  }
}
export default new EmployeeService();
