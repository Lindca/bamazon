//display all the items available for sale including id's names and prices
//what product id would you like to buy?
//how many units of this product would you like?
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
    database: "bamazon_db",
});
connection.connect(function (err) {
    if (err) throw err;
    showProducts();
});

function showProducts(){
    connection.query("SELECT * FROM products", function (err, data) {
        if (err) throw err;
        console.table(data);
        runSearch();
    })
}

function runSearch() {
    inquirer
        .prompt([
            {
                name: "itemID",
                type: "input",
                message: "Please provide the id of the item you would like to purchase.",

            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to purchase?",
            }
        ])
        .then(function (answer) {
            connection.query("SELECT * FROM products WHERE id=" + answer.itemID, function (err, data) {
                if (err) throw err;
                if (answer.quantity < data[0].stock_quantity) {
                    var newQuant = data[0].stock_quantity - answer.quantity;
                    console.log("You purchased "+answer.quantity+" of these!");
                    connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: newQuant }, { id: answer.itemID }], function (err, data) {
                        if (err) throw err;
                        // connection.query("SELECT * FROM products WHERE id=" + answer.itemID, function (err, data) {
                        //     console.log(data[0]);
                        // })
                    })
                } else {
                    console.log("Not enough inventory, try again later!")
                }
                showProducts();
            })
        });
}