# Bamazon
Amazon-like online store

# Node.js & MySQL

## Overview

This is an Amazon-like storefront application, which will take in orders from customers and update stock from the store's inventory.
It includes two parts:

* bamazonCustomer.js, to be used for customer to order products in the store; and
* bamazonManager.js, to be used for the store manager to monitor the store inventory.

#1: Customer View 

- This `bamazonCustomer.js` app is for customers to order item(s) in the store. When running the app, it will show a list of product available in the store and ask customer which product and how many unit of it that they would like to buy.
- After customer made their choice, the app will check if the quantity the chosen item in stock is the enough to meet the customer's needs.
- If the store's stock is enough, the app will inform customer that their order ` has been successfully placed ` and the total cost of that order as well.
- If the stock is lower than the customer's order, a message `Insufficient quantity!` will be shown.
- After processing the said order, the app will ask customer if they would like to continue shopping. If yes, they are free to do so, otherwise the process will start over.

#2: Manager View 

- This `bamazonManager.js` app is for the store's manager to manage their inventory.
 
 Running this application will:

  * List a set of menu options:

    * View Products for Sale
    
    * View Low Inventory
    
    * Add to Inventory
    
    * Add New Product

  * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

  * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

  * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

  * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

