//display all the items available for sale including id's names and prices
//what product id would you like to buy?
//how many units of this product would you like?
var mysql = require("mysql");

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
// connection.connect(function (err) {
//     if (err) throw err;
//     connection.query("SELECT * FROM products", function (err, data) {
//         if (err) throw err;
//         console.log(data)
//         // if (err) throw err;
//         console.log(data);
//         connection.query("SELECT * FROM products", function (err, data) {
//             if (err) throw err;
//             console.log(data);
//             connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: -5 }, { product_name: answer.item }], function (err, data) {
//                 if (err) throw err;

//                 connection.end();
//             })
//         })

//     })
// })
connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt(
            {
                name: "itemID",
                type: "input",
                message: "Please provide the id of the item you would like to purchase.",

            },
            {
                type: "input",
                message: "How many would you like to purchase?",
                name: "quantity"
            }
        )
        .then(function (answer) {
            connection.query("SELECT * FROM products", function (err, data) {
                if (err) throw err;
                // var newQuant = answer.stock_quantity; // quantity for updated quantity in database

                    connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: newQuant }, { id: answer.itemID }], function (err, data) {
                        if (err) throw err;

                        connection.end();
                    })

            })
        });
}