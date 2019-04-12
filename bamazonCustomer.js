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

// function which prompts the user for which item they would like to buy
function start() {
    // query the database for all items on sale
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // console.log(results);
        // once we have the list of items, 
        //prompt the user which one they would like to buy.
        inquirer
            .prompt([
                {
                    name: "choice", 
                    type: "rawlist",
                    choices: function () {
                        var itemList = [];
                        for (var i = 0; i < results.length; i++) {
                            itemList.push(results[i].product_name);
                        }
                        return itemList;
                    },
                    message: "Which item would you like to order?"
                },
                {
                    name: "order",
                    type: "input",
                    message: "How many items would you like to order?"
                }
            ])
            .then(function (answer) {
                // get information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenItem = results[i];
                        // console.log(chosenItem.product_name);
                        // console.log(chosenItem.stock_quantity);
                    }
                }
                // console.log(answer.order);

                // determine if there is enough in stock
                var update_stock = chosenItem.stock_quantity - parseInt(answer.order);
                // console.log(update_stock);
                if (chosenItem.stock_quantity >= parseInt(answer.order)) {
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
                            console.log("Your order has been successfully placed");
                            console.log("Total cost of this order is: $" + chosenItem.price * parseInt(answer.order));
                            console.log("====================================================================");
                            setTimeout(() => {
                                reStart()
                            }, 2000);
                        }
                    );
                }
                else {
                    // the stock was not enough, so appoligize and start over
                    console.log("Insufficient quantity!");
                    setTimeout(() => {
                        reStart();
                    }, 2000);
                }
            });
    })
};
// ====
// restart function
function reStart() {
    inquirer
    .prompt([
        {
            name: "shopOrQuit",
            type: "list",
            message: "Would you like to continue shopping?",
            choices: ["YES", "NO"]
        }
    ])
    .then(function(reply) {
        if (reply.shopOrQuit === "YES") {
            start();
        }
        else {
            console.log("Thank you for your visit. Hope to see you again!");
            connection.end();
        }
    })
}
    
