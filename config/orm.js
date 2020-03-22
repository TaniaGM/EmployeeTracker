const connection = require("./connection.js");

const orm = {
    addDepartment: function(deptName) {
        return new Promise(function(resolve, reject) {
            const queryString = `INSERT INTO departments (name) VALUES (?)`;
            connection.query(queryString, deptName, function(err, result) {
                if (err) {
                    return reject(err);
                }
                console.log("Department successfully added!");
                return resolve();
            });
        });
        
    },
    addRole: function(roleTitle, roleSalary, deptId) {
        return new Promise(function(resolve, reject) {
            const queryString = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
            connection.query(queryString, [roleTitle, roleSalary, deptId],function (err, result) {
                if (err) {
                    return reject(err);
                }
                console.log("Role successfully added!");
                return resolve();
            });
        });
        
    },
    addEmployee: function(firstName, lastName, roleId, mgrId) {
        return new Promise(function(resolve, reject) {
            const queryString = "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
            connection.query(queryString, [firstName, lastName, roleId, mgrId], function(err, result) {
                if (err) {
                    return reject(err);
                }
                console.log("Employee successfully added!");
                return resolve();
            });
        });
        
    },
    viewEmployees: function() {
        return new Promise(function(resolve, reject) {
            const queryString = 'SELECT employees.id, first_name, last_name, title, salary, name, manager_id FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id';
            connection.query(queryString, function(err, result) {
                if (err) {
                    return reject(err);
                }
                let newTable = [];
                for (let i=0; i< result.length; i++) {
                    let manager_name = "";
                    if (result[i].manager_id !== null) {
                        for (let j=0; j<result.length; j++) {
                            if (result[j].id === result[i].manager_id) {
                                manager_name = result[j].first_name + " " + result[j].last_name;
                            }
                        }
                    } else {
                        manager_name = "Not available";
                    }
                    const tableElement = {
                        "Employee ID": result[i].id,
                        "First Name": result[i].first_name,
                        "Last Name": result[i].last_name,
                        "Title": result[i].title,
                        "Salary": result[i].salary,
                        "Department": result[i].name,
                        "Manager": manager_name
                    };
                    newTable.push(tableElement);
                }
                console.table(newTable);
                return resolve();
            });
        });
        
    },
    getEmployees: function() {
        return new Promise(function(resolve, reject) {
            const queryString = "SELECT * FROM employees";
            connection.query(queryString, function(err, result) {
                if (err) {
                    return reject(err);
                }
                const empArray = [];
                for (let i=0; i<result.length; i++) {
                    const empObj = {
                        id: result[i].id,
                        name: result[i].first_name + " " + result[i].last_name
                    };
                    empArray.push(empObj);
                }
                return resolve(empArray);
            });
        });
    },
    viewRoles: function() {
        return new Promise(function(resolve, reject) {
            const queryString = "SELECT roles.id, title, salary, name FROM roles LEFT JOIN departments ON roles.department_id = departments.id";
            connection.query(queryString, function(err, result) {
                if (err) {
                    return reject(err);
                }
                const newTable = [];
                for (let i=0; i<result.length; i++) {
                    const roleObj = {
                        "ID": result[i].id,
                        "Title": result[i].title,
                        "Salary": result[i].salary,
                        "Department": result[i].name
                    };
                    newTable.push(roleObj);
                }
                console.table(newTable);
                return resolve();
            });
        });
        
    },
    getRoles: function() {
        return new Promise(function(resolve, reject) {
            const queryString = "SELECT * FROM roles";
            connection.query(queryString, function(err, result) {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    },
    viewDepartments: function() {
        return new Promise(function(resolve, reject) {
            const queryString = "SELECT * FROM departments";
            connection.query(queryString, function(err, result) {
                if (err) {
                    return reject(err);
                }
                console.table(result);
                return resolve();
            });
        });
        
    },
    getDepartments: function() {
        return new Promise(function(resolve, reject) {
            const queryString = "SELECT * FROM departments";
            connection.query(queryString, function(err, result) {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    },
    updateRole: function(empId, newRole) {
        return new Promise(function(resolve, reject) {
            const queryString = "SELECT id FROM roles WHERE title = ?";
            connection.query(queryString, newRole, function(err, result) {
                if (err) {
                    return reject(err);
                }
                const newRoleId = result[0].id;
                const queryString = "UPDATE employees SET ? WHERE ?";
                connection.query(queryString,
                    [{
                        role_id: newRoleId
                    },
                    {
                        id: empId
                    }],
                    function(err, result) {
                        if (err) {
                            return reject(err);
                        }
                        console.log("Employee's role successfully updated!");
                        return resolve();
                    });
            });
        });
        
    },
    updateManager: function(empId, newMgrId) {
        return new Promise(function(resolve, reject) {
            const queryString = "UPDATE employees SET ? WHERE ?";
            connection.query(queryString,
                [{
                    manager_id: newMgrId
                },
                {
                    id: empId
                }],
                function(err, result) {
                    if (err) {
                        return reject(err);
                    }
                    console.log("Employee's manager successfully updated!");
                    return resolve();
                });
        });
        
    },
    viewEmpsByMgr: function(mgrId) {
        return new Promise(function(resolve, reject) {
            const queryString = 'SELECT employees.id, first_name, last_name, title, salary, name, manager_id FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id WHERE manager_id = ?';
            connection.query(queryString, mgrId, function(err, result) {
                if (err) {
                    return reject(err);
                }
                let newTable = [];
                for (let i=0; i< result.length; i++) {
                    const tableElement = {
                        "Employee ID": result[i].id,
                        "First Name": result[i].first_name,
                        "Last Name": result[i].last_name,
                        "Title": result[i].title,
                        "Salary": result[i].salary,
                        "Department": result[i].name
                    };
                    newTable.push(tableElement);
                }
                console.table(newTable);
                return resolve();
            });
        });
        
    },
    deleteRecord: function(tableInput, recordId) {
        return new Promise(function(resolve, reject) {
            const queryString = "DELETE FROM ?? WHERE id = ?";
            connection.query(queryString, [tableInput, recordId], function(err, result) {
                if (err) {
                    return reject(err);
                }
                console.log("Record successfully deleted");
                return resolve();
            });
        });
        
    },
    viewUtilizedBudget: function(deptId) {
        return new Promise(function(resolve, reject) {
            const queryString = "SELECT * FROM roles WHERE department_id = ?";
            connection.query(queryString, deptId, function(err, roleResult) {
                if (err) {
                    return reject(err);
                }
                let utilizedBudget = 0;
                for (let i=0; i<roleResult.length; i++) {
                    const roleId = roleResult[i].id;
                    const salary = roleResult[i].salary;
                    const queryString = "SELECT * FROM employees WHERE role_id = ?";
                    connection.query(queryString, roleId, function(err, empResult) {
                        if (err) {
                            return reject(err);
                        }
                        utilizedBudget += empResult.length * salary;
                        if (i === roleResult.length-1) {
                            console.log("Total department utilized budget: " + utilizedBudget);
                            return resolve();
                        }
                    });
                }
            });
        });
        
    },
    endConnection: function() {
        connection.end();
    }
};

module.exports = orm;