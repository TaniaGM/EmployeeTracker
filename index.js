const orm = require("./config/orm.js");
const inquirer = require("inquirer");

// View employees, view departments, view roles, add employee, add department, add role, update role, update manager, 
// view employees by manager, delete employee, delete role, delete department, quit


// This function generates the top-level choices for the user.  Upon selecting any of them, a new function is executed
// specific to that choice.  Upon completion of the selected task, this function is called once again.
function mainMenu() {
    console.log("Welcome to the Employee Tracker!\n")
    inquirer.prompt({
        type: "list",
        message: "Choose what you would like to do",
        choices: [
            "View employees",
            "View departments",
            "View roles",
            "Add employee",
            "Add department",
            "Add role",
            "Update role",
            "Update manager",
            "Display employees by manager",
            "Delete an employee",
            "Delete a role",
            "Delete a department",
            "View utilized budget for a department",
            "Quit"
        ],
        name: "choice"
    }).then(function({ choice }) {
        if (choice === "View employees") {
            orm.viewEmployees()
            .then(function() {
                console.log("\n");
                mainMenu();
            });
        } else if (choice === "View departments") {
            orm.viewDepartments()
            .then(function() {
                console.log("\n");
                mainMenu();
            });
        } else if (choice === "View roles") {
            orm.viewRoles()
            .then(function() {
                console.log("\n");
                mainMenu();
            });
        } else if (choice === "Add employee") {
            addEmployeePrompt();
        } else if (choice === "Add department") {
            addDepartmentPrompt();
        } else if (choice === "Add role") {
            addRolePrompt();
        } else if (choice === "Update role") {
            updateRolePrompt();
        } else if (choice === "Update manager") {
            updateManagerPrompt();
        } else if (choice === "Display employees by manager") {
            displayByMgrPrompt();
        } else if (choice === "Delete an employee") {
            deleteEmployeePrompt();
        } else if (choice === "Delete a role") {
            deleteRolePrompt();
        } else if (choice === "Delete a department") {
            deleteDepartmentPrompt();
        } else if (choice === "View utilized budget for a department") {
            displayUtilizedBudgetPrompt();
        } else {
            orm.endConnection();
        }
    });
}

// Prompt user for information about new employee, calls ORM function to add it to the database
function addEmployeePrompt() {
    orm.getEmployees()
    .then(function(res) {
        const managerArray = [];
        for (let i=0; i<res.length; i++) {
            managerArray.push(res[i].name);
        }
        managerArray.push("none");
        orm.getRoles()
        .then(function(response) {
            const roleTitleArray = [];
            for (let i=0; i<response.length; i++) {
                roleTitleArray.push(response[i].title);
            }
            inquirer.prompt([{
                type: "input",
                message: "Enter employee's first name",
                name: "firstName"
            },
            {
                type: "input",
                message: "Enter employee's last name",
                name: "lastName"
            },
            {
                type: "list",
                message: "Select employee's role",
                choices: roleTitleArray,
                name: "role"
            },
            {
                type: "list",
                message: "Select employee's manager",
                choices: managerArray,
                name: "manager"
            }]).then(function({firstName, lastName, role, manager}) {
                const roleId = response[roleTitleArray.indexOf(role)].id;
                if (manager === "none") {
                    orm.addEmployee(firstName, lastName, roleId)
                    .then(function() {
                        console.log("\n");
                        mainMenu();
                    });
                } else {
                    const managerId = res[managerArray.indexOf(manager)].id;
                    orm.addEmployee(firstName, lastName, roleId, managerId)
                    .then(function() {
                        console.log("\n");
                        mainMenu();
                    });
                }
            });
    });
    });
}

// Prompts user for information needed to make new department, then calls ORM function to add it to the database
function addDepartmentPrompt() {
    orm.getDepartments()
    .then(function(response) {
        const deptArray = [];
        for (let i=0; i<response.length; i++) {
            deptArray.push(response[i].name);
        }
        inquirer.prompt({
            type: "input",
            message: "Enter the name of new department you'd like to add",
            name: "deptName"
        }).then(function({deptName}) {
            if (deptArray.includes(deptName)) {
                console.log("There is already a department with that name!\n");
                mainMenu();
            } else {
                orm.addDepartment(deptName)
                .then(function() {
                    console.log("\n");
                    mainMenu();
                });
            }
        });
    });
}

// Prompts user for information needed to make a new role, then calls ORM function to add it to the database
function addRolePrompt() {
    orm.getRoles()
    .then(function(roles) {
        const roleArray = [];
        for (let i=0; i<roles.length; i++) {
            roleArray.push(roles[i].title);
        }
        orm.getDepartments()
        .then(function(deptArray) {
            const deptNames = [];
            for (let i=0; i<deptArray.length; i++) {
                deptNames.push(deptArray[i].name);
            }
            inquirer.prompt([{
                type: "input",
                message: "Enter the name of the role you would like to add",
                name: "title"
            },
            {
                type: "input",
                message: "Enter the annual salary of the new role",
                name: "salary"
            },
            {
                type: "list",
                message: "Select the department in which the new role will work",
                choices: deptNames,
                name: "department"
            }]).then(function({title, salary, department}) {
                const deptId = deptArray[deptNames.indexOf(department)].id;
                if (roleArray.includes(title)) {
                    console.log("Error - that title already exists!\n");
                    mainMenu();
                } else {
                    orm.addRole(title, salary, deptId)
                    .then(function() {
                        console.log("\n");
                        mainMenu();
                    });
                }
            });
        });
    }); 
}

// Grabs all employees, asks user which one they want to update, asks what role the employee should have, then calls ORM function to update the database
function updateRolePrompt() {
    orm.getEmployees()
    .then(function(res) {
        const empArray = [];
        for (let i=0; i<res.length; i++) {
            empArray.push(res[i].name);
        }
        orm.getRoles()
        .then(function(response) {
            const roleArray = [];
            for (let i=0; i<response.length; i++) {
                roleArray.push(response[i].title);
            }
            inquirer.prompt([{
                type: "list",
                message: "Choose the employee whose role you'd like to update",
                choices: empArray,
                name: "employee"
            },
            {
                type: "list",
                message: "Select the employee's new role",
                choices: roleArray,
                name: "role"
            }]).then(function({employee, role}) {
                const empId = res[empArray.indexOf(employee)].id;
                orm.updateRole(empId, role)
                .then(function() {
                    console.log("\n");
                    mainMenu();
                })
            })
        })
    })
}

// Grabs all employees, asks user which one they want to update, asks what manager the employee should have, then calls ORM function to update the database
function updateManagerPrompt() {
    orm.getEmployees()
    .then(function(employees) {
        const empArray = [];
        for (let i=0; i<employees.length; i++) {
            empArray.push(employees[i].name);
        }
        inquirer.prompt([{
            type: "list",
            message: "Select the employee whose manager you would like to update",
            choices: empArray,
            name: "employee"
        },
        {
            type: "list",
            message: "Select the employee's new manager",
            choices: empArray,
            name: "manager"
        }]).then(function({employee, manager}) {
            if (employee === manager) {
                console.log("Error - you cannot assign an employee to manage him/herself!");
                mainMenu();
            } else {
                const empId = employees[empArray.indexOf(employee)].id;
                const mgrId = employees[empArray.indexOf(manager)].id;
                orm.updateManager(empId, mgrId)
                .then(function() {
                    console.log("\n");
                    mainMenu();
                });
            }
        });
    });
}

// Grabs all employees, asks the user for which one they want to see direct reports, then calls ORM function to query database and display results
function displayByMgrPrompt() {
    orm.getEmployees()
    .then(function(employees) {
        const empArray = [];
        for (let i=0; i<employees.length; i++) {
            empArray.push(employees[i].name);
        }
        inquirer.prompt({
            type: "list",
            message: "Select the manager whose employees you would like to view",
            choices: empArray,
            name: "manager"
        }).then(function({manager}) {
            const mgrId = employees[empArray.indexOf(manager)].id;
            orm.viewEmpsByMgr(mgrId)
            .then(function() {
                console.log("\n");
                mainMenu();
            });
        });
    });
}

// Grabs all employees, asks user which one they want to delete, then calls ORM function to delete it from the database
function deleteEmployeePrompt() {
    orm.getEmployees()
    .then(function(employees) {
        const empArray = [];
        for (let i=0; i<employees.length; i++) {
            empArray.push(employees[i].name);
        }
        inquirer.prompt({
            type: "list",
            message: "Which employee would you like to delete?",
            choices: empArray,
            name: "employee"
        }).then(function({employee}) {
            const empId = employees[empArray.indexOf(employee)].id;
            orm.deleteRecord("employees", empId)
            .then(function() {
                console.log("\n");
                mainMenu();
            });
        });
    });
}

// Grabs all roles, asks user which one they want to delete, then calls ORM function to delete it from the database
function deleteRolePrompt() {
    orm.getRoles()
    .then(function(roles) {
        const roleArray = [];
        for (let i=0; i<roles.length; i++) {
            roleArray.push(roles[i].title);
        }
        inquirer.prompt({
            type: "list",
            message: "Which role would you like to delete?",
            choices: roleArray,
            name: "role"
        }).then(function({role}) {
            const roleId = roles[roleArray.indexOf(role)].id;
            orm.deleteRecord("roles", roleId)
            .then(function() {
                console.log("\n");
                mainMenu();
            });
        });
    });
}

// Grabs all departments, asks user which one they want to delete, then calls ORM function to delete it from the database
function deleteDepartmentPrompt() {
    orm.getDepartments()
    .then(function(depts) {
        const deptArray = [];
        for (let i=0; i<depts.length; i++) {
            deptArray.push(depts[i].name);
        }
        inquirer.prompt({
            type: "list",
            message: "Which department would you like to delete?",
            choices: deptArray,
            name: "dept"
        }).then(function({dept}) {
            const deptId = depts[deptArray.indexOf(dept)].id;
            orm.deleteRecord("departments", deptId)
            .then(function() {
                console.log("\n");
                mainMenu();
            });
        });
    });
}

// Grabs all departments, asks user for which one they want to see sum of salaries, then calls ORM function to query database and display results
function displayUtilizedBudgetPrompt() {
    orm.getDepartments()
    .then(function(depts) {
        const deptArray = [];
        for (let i=0; i<depts.length; i++) {
            deptArray.push(depts[i].name);
        }
        inquirer.prompt({
            type: "list",
            message: "For which department would you like to view the utilized budget?",
            choices: deptArray,
            name: "dept"
        }).then(function({dept}) {
            const deptId = depts[deptArray.indexOf(dept)].id;
            orm.viewUtilizedBudget(deptId)
            .then(function() {
                console.log("\n");
                mainMenu();
            });
        });
    });
}

mainMenu();