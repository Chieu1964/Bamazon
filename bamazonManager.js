var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection info for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,

    // Your username:
    user: "root",
    // Password and database
    password: "Huyenchau@05",
    database: "bamazon"
});

//=============================================================//
// connect to the mysql servver and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made
    start();
});

// function which display the menu for manager view
function start() {
    // query the database all items
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // console.log(results);

    })
    inquirer
        .prompt(
            {
                name: "menu",
                type: "list",
                message: "Chose a list you want to view",
                choices: ["Products for Sale", "Products in Low Inventory"]
            }
        )
        .then(function (answer) {
            if (answer.menu === "Products for Sale") {
                // view Products for Sale
                connection.query("SELECT * FROM products", function (err, results) {
                    if (err) throw err;
                    console.log(results);
                    inquirer
                        .prompt({
                            name: "add",
                            message: "Want to add new product?",
                            type: "confirm"
                        })
                        .then(function (reply) {
                            return (reply.add ? addNew() : connection.end());
                        })
                })
            } else {
                // low inventory view and add more product
                
                addMore();
            }
        })

    // Function to add new product
    function addNew() {
        connection.query("SELECT * FROM products", function (err, results) {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: "item",
                        type: "input",
                        message: "Name of the item to be added:"
                    },
                    {
                        name: "department",
                        type: "list",
                        message: "Which department that item will be placed in?",
                        choices: ["Electronics", "Appliances", "Kitchen"]
                    },
                    {
                        name: "price",
                        type: "input",
                        message: "what is the price of that item?"
                    },
                    {
                        name: "quantity",
                        type: "input",
                        message: "How many items will be placed in stock?"
                    }
                ])
                .then(function (add) {
                    // when finished prompting, insert new item into DB
                    connection.query(
                        "INSERT INTO products SET ?",
                        {
                            product_name: add.item,
                            department: add.department,
                            price: add.price,
                            stock_quantity: add.quantity
                        },
                        function (err) {
                            if (err) throw err;
                            console.log("====================================================================");
                            console.log("This new item has been successfully added");
                            console.log("====================================================================");
                            setTimeout(() => {
                                reStart()
                            }, 2000);
                        }
                    );

                })
        })
    }

    // function to add more product

    function addMore() {
        connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, lowStock) {
            if (err) throw err;
            console.log(lowStock);
            inquirer
                .prompt([
                    {
                        name: "lowInvenList",
                        type: "rawlist",
                        choices: function () {
                            var lowStockList = [];
                            for (var i = 0; i < lowStock.length; i++) {
                                lowStockList.push(lowStock[i].product_name);
                            }
                            return lowStockList;
                        },
                        message: "Item to be stocked more: "
                    },
                    {
                        name: "stockMore",
                        type: "input",
                        message: "Quantity added: "
                    }
                ])
                .then(function (answer) {
                    // get information of the chosen item
                    var chosenItem;
                    for (var i = 0; i < lowStock.length; i++) {
                        if (lowStock[i].product_name === answer.lowInvenList) {
                            chosenItem = lowStock[i];
                            // console.log(chosenItem.product_name);
                            // console.log(chosenItem.stock_quantity);
                        }
                    }
                    // console.log(answer.order);

                    // update stock
                    var update_stock = chosenItem.stock_quantity + parseInt(answer.stockMore);
                    // console.log(update_stock);

                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: update_stock
                            },
                            {
                                id: chosenItem.id
                            },
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("====================================================================");
                            console.log("DONE! The up-to-date quantity of this item is: " + update_stock);
                            console.log("====================================================================");
                        
                            setTimeout(() => {
                                reStart()
                            }, 2000);
                        }
                    );
                });
            //========
        })
    }
}

// ==== Restart function


function reStart() {
    inquirer
    .prompt([
        {
            name: "continueOrQuit",
            type: "list",
            message: "Would you like to continue?",
            choices: ["YES", "NO"]
        }
    ])
    .then(function(letMeThink) {
        if (letMeThink.continueOrQuit === "YES") {
            start();
        }
        else {
            console.log("You're DONE! Have a great day!");
            connection.end();
        }
    })
}