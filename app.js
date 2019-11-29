"use strict";
exports.__esModule = true;
var mysql = require("mysql");
var inquirer = require("inquirer");
var config = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.PW,
    database: "bamazon"
};
var db = mysql.createConnection(config);
db.connect(function (err) {
    if (err)
        throw err;
    console.log("Success!");
    menu();
});
var getDepartment = function (department) {
    db.query("select * from products where department like ?", department, function (err, res) {
        if (err)
            throw err;
        console.table(res);
        menu();
    });
};
var timer = function (ms) {
    return new Promise(function (res) { return setTimeout(res, ms); });
};
var getProducts = function () {
    db.query("select * from products", function (err, res) {
        if (err)
            throw err;
        console.table(res);
        menu();
    });
};
var buyProduct = function (id) {
    db.query("update products set stock = stock - 1 where id = ?", id, function (err, res) {
        if (err)
            throw err;
        console.log("Succesful purchase!");
        menu();
    });
};
var searchDepartment = function () {
    inquirer
        .prompt([
        {
            name: "department",
            message: "What department do you want to search?"
        }
    ])
        .then(function (ans) {
        getDepartment(ans.department);
    });
};
var purchaseProduct = function () {
    inquirer
        .prompt([
        {
            name: "id",
            message: "What's the id of the product you wan't to buy?"
        }
    ])
        .then(function (ans) {
        buyProduct(ans.id);
    });
};
var menu = function () {
    inquirer
        .prompt([
        {
            type: "list",
            name: "action",
            message: "what do you want to do?",
            choices: ["see everything", "search department", "buy product", "exit"]
        }
    ])
        .then(function (ans) {
        switch (ans.action) {
            case "search department":
                searchDepartment();
                break;
            case "buy product":
                purchaseProduct();
                break;
            case "see everything":
                getProducts();
                break;
            case "exit":
                console.log("Good Bye!");
                db.end();
                break;
        }
    });
};
