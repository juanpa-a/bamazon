import * as mysql from "mysql";
import * as inquirer from "inquirer";

let config = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.PW,
  database: "bamazon"
};

let db = mysql.createConnection(config);

db.connect((err: any) => {
  if (err) throw err;
  console.log("Success!");
  menu();
});

const getDepartment = (department: string): void => {
  db.query(
    "select * from products where department like ?",
    department,
    (err: string, res: string) => {
      if (err) throw err;
      console.table(res);
      menu();
    }
  );
};

const timer = ms => {
  return new Promise(res => setTimeout(res, ms));
};

const getProducts = (): void => {
  db.query("select * from products", (err: string, res: any) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
};

const buyProduct = (id: string): void => {
  db.query(
    "update products set stock = stock - 1 where id = ?",
    id,
    (err: string, res: any) => {
      if (err) throw err;
      console.log("Succesful purchase!");
      menu();
    }
  );
};

const searchDepartment = () => {
  inquirer
    .prompt([
      {
        name: "department",
        message: "What department do you want to search?"
      }
    ])
    .then((ans: any) => {
      getDepartment(ans.department);
    });
};

const purchaseProduct = () => {
  inquirer
    .prompt([
      {
        name: "id",
        message: "What's the id of the product you wan't to buy?"
      }
    ])
    .then(ans => {
      buyProduct(ans.id);
    });
};

const menu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "what do you want to do?",
        choices: ["see everything", "search department", "buy product", "exit"]
      }
    ])
    .then((ans: string) => {
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
					console.log("Good Bye!")
          db.end();
					break;
      }
    });
};
