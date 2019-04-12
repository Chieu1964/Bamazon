drop DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
use bamazon;
CREATE table products(
id INT not null AUTO_INCREMENT,
product_name VARCHAR(200) not null,
department VARCHAR(100) not NULL,
price DECIMAL(5,2),
stock_quantity INTEGER,
PRIMARY KEY (id)
); 
SELECT * from products;
