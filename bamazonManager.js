var mysql = require("mysql");
var inquirer = require("inquirer");

// Create a "Prompt" with a series of questions.
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_db"
})
startManager();
function startManager() {
    connection.connect(function (err) {
        if (err) throw err;
        showOptions();
    });
}

function showOptions() {
    inquirer
        .prompt(
            {
                name: "menuOption",
                type: 'list',
                message: "Please select from the following menu:",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            }
        )
        .then(function (answer) {
            if (answer.menuOption === "View Products for Sale") {
                connection.query("SELECT * FROM products", function (err, data) {
                    if (err) throw err;
                    console.table(data);
                    showOptions();
                })
            }
            else if (answer.menuOption === "View Low Inventory") {
                connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN '0' AND '5'", function (err, data) {
                    if (err) throw err;
                    if (data.length < 1 || data == undefined) {
                        console.log("There aren't any products with a low inventory!")
                    }
                    else {
                        console.table(data)
                    }
                    showOptions();
                })
            }
            else if (answer.menuOption === "Add to Inventory") {
                inquirer
                    .prompt([
                        {
                            name: "id",
                            type: 'input',
                            message: "Which Id would you like to update the quantity of?",
                        },
                        {
                            name: "addUnits",
                            type: 'input',
                            message: "How many units would you like to add?",
                        },
                    ])
                    .then(function (answer) {
                        connection.query("SELECT * FROM products WHERE id=" + answer.id, function (err, data) {
                            if (err) throw err;
                            console.table(data);
                            var quant = data[0].stock_quantity + answer.addUnits;
                            var newQuant = parseInt(quant);
                            connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: newQuant }, { id: answer.id }], function (err, data) {
                                if (err) throw err;
                                console.log("You have updated the stock quantity!");
                                showOptions();
                            })
                        })
                    })
            }
            else if (answer.menuOption === "Add New Product") {
                inquirer
                    .prompt([
                        {
                            name: "productName",
                            type: 'input',
                            message: "What is the name of the product?",
                        },
                        {
                            name: "department",
                            type: 'input',
                            message: "Which department does this fall into?",
                        },
                        {
                            name: "price",
                            type: 'input',
                            message: "What would you like the price to be?",
                        },
                        {
                            name: "units",
                            type: 'input',
                            message: "How many units do you have?",
                        },
                    ])
                    .then(function (answer) {
                        connection.query("INSERT INTO products SET ?", { product_name: answer.productName, department_name: answer.department, price: answer.price, stock_quantity: answer.units }, function (err, data) {
                            if (err) throw err;
                            console.log("You have added a product!");
                            showOptions();
                        })
                    })
            }
        });
}

