const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const port = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "studentplanner",
});

app.get("/login", (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  db.query(
    "SELECT * FROM user WHERE user.email = ? AND user.password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/create-user", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  db.query(
    "CALL createUser(?, ?, ?)",
    [name, email, password],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/create-class", (req, res) => {
  const user = req.body.user;
  const name = req.body.name;
  const code = req.body.code;
  const location = req.body.location;
  const days = req.body.days;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;

  db.query(
    "CALL createClass(?, ?, ?, ?, ?, ?, ?)",
    [user, name, code, location, days, startTime, endTime],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/classes", (req, res) => {
  const email = req.query.email;
  db.query(
    "SELECT * FROM class WHERE class.user = ?",
    [email],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// var email = "test@test.com";

// db.query("SELECT * FROM class WHERE class.user = ?", [email], (err, result) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(result);
//   }
// });

app.get("/", function (req, res) {
  res.send("Test");
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
