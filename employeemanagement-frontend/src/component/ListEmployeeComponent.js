import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import EmployeeService from "../service/EmployeeService";

const ListEmployeeComponent = () => {
  const [employeeArray, setEmployeeArray] = useState([]);
  const renderCount = useRef(1);
  useEffect(() => {
    getAllEmployee();
  }, []);
  useEffect(() => {
    console.log("Render Count: ", renderCount.current);
    renderCount.current = renderCount.current + 1;
  });

  function getAllEmployee() {
    EmployeeService.getAllEmployee()
      .then((res) => {
        setEmployeeArray(res.data);
        console.log(res);
      })
      .catch((e) => console.log(e));
  }
  function deleteEmployee(e, id) {
    e.preventDefault();
    EmployeeService.deleteEmployee(id)
      .then(() => getAllEmployee())
      .catch((e) => console.log(e));
  }

  return (
    <div className="container">
      <Link to={"/add-employee"} className="btn btn-primary mb-2 mt-3" href="">
        Add Employee
      </Link>
      <h2 className="text-center mb-4">List Employee</h2>
      <table className="table table-bordered table striped">
        <thead>
          <th>Employee ID</th>
          <th>Employee First Name</th>
          <th>Employee Last Name</th>
          <th>Employee Email</th>
          <th>Actions</th>
        </thead>
        <tbody>
          {employeeArray
            .sort((a, b) => a.id - b.id)
            .map((employee) => (
              <tr key={employee.id} id={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.email}</td>
                <td>
                  <Link
                    to={`/add-employee/${employee.id}`}
                    className="btn btn-info"
                    href=""
                  >
                    Update
                  </Link>{" "}
                  <a
                    onClick={(e) => deleteEmployee(e, employee.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListEmployeeComponent;
