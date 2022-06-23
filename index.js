const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to the MySQL database.
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "studentplanner",
});

// Return login information - returns name of user if success, null if fail.
app.get("/login", (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  db.query("SELECT logIn(?, ?)", [email, password], (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(result);
    }
  });
});

// Create a new user.
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

// Create a new class.
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

// Create a new homework.
app.post("/create-homework", (req, res) => {
  const user = req.body.user;
  const code = req.body.code;
  const name = req.body.name;
  const description = req.body.description;
  const dueDate = req.body.dueDate;
  const dueTime = req.body.dueTime;
  db.query(
    "CALL createHomework(?, ?, ?, ?, ?, ?)",
    [user, code, name, description, dueDate, dueTime],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// Create a new goal.
app.post("/create-goal", (req, res) => {
  const user = req.body.user;
  const goal = req.body.goal;
  db.query("CALL createGoal(?, ?)", [user, goal], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// Create a new exam.
app.post("/create-exam", (req, res) => {
  const user = req.body.user;
  const course = req.body.course;
  const name = req.body.name;
  const date = req.body.date;

  db.query(
    "CALL createExam(?, ?, ?, ?)",
    [user, course, name, date],
    (err, result) => {
      if (err) {
        //console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// Read classes.
app.get("/classes", (req, res) => {
  const email = req.query.email;
  db.query(
    "SELECT name, code, location, daysOfWeek, startTime, endTime FROM class WHERE class.user = ?",
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

// Read homework.
app.get("/homework", (req, res) => {
  const email = req.query.email;
  db.query(
    "SELECT * FROM homework WHERE homework.user = ?",
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

// Read goals.
app.get("/goals", (req, res) => {
  const email = req.query.email;
  db.query("SELECT * FROM goal WHERE goal.user = ?", [email], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// Read exams.
app.get("/exams", (req, res) => {
  const email = req.query.email;
  db.query("SELECT * FROM exam WHERE exam.user = ?", [email], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// edit class.
app.put("/edit-class", (req, res) => {
  const user = req.body.user;
  const name = req.body.name;
  const code = req.body.code;
  const location = req.body.location;
  const days = req.body.days;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;

  db.query(
    "UPDATE class SET class.name = ?, class.location = ?, class.daysOfWeek = ?, class.startTime = ?, class.endTime = ? WHERE class.user = ? AND class.code = ?",
    [name, location, days, startTime, endTime, user, code],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// Update homework.
app.put("/edit-homework");

// Update goal.
app.put("/edit-goal");

// Update exam.
app.put("/edit-exam");

// Update status of a homework assignment.
app.put("/update-check", (req, res) => {
  const email = req.body.email;
  const course = req.body.course;
  const name = req.body.name;
  const dueDate = req.body.dueDate;
  const truthValue = req.body.truthValue;

  db.query(
    "UPDATE homework SET isDone = ? WHERE user = ? AND classCode = ? AND name = ? and dueDate = ?",
    [truthValue, email, course, name, dueDate],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// Delete a class with given user email and class code from the database.
app.delete("/delete-class", (req, res) => {
  const email = req.query.email;
  const code = req.query.code;
  console.log(email, code);
  db.query(
    "DELETE FROM class WHERE class.user = ? AND class.code = ?",
    [email, code],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// Delete a homework with given homework ID from the database.
app.delete("/delete-homework", (req, res) => {
  const hwId = req.query.id;
  db.query("DELETE FROM homework WHERE hwId = ?", [hwId], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// Delete a goal from the database.
app.delete("/delete-goal");

// Delete an exam from the database.
app.delete("/delete-exam");

app.get("/", function (req, res) {
  res.send("Test");
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
