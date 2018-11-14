const { Client } = require("pg");
const express = require("express");

// create an express application
const app = express();
app.use(express.json());
// create a postgresql client
const client = new Client({
  database: "social-media"
});

// route handlers go here
app.get("/users", (req, res) => {
  client.query("SELECT * FROM users", (err, result) => {
    res.send(result.rows);
  });
});

app.post("/users", (req, res) => {
  const queryRes =
    "INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *";
  const values = [req.body.username, req.body.bio];
  client.query(queryRes, values, (err, result) => {
    res.status(201).send(result.rows[0]);
    console.log(result.rows[0]);
  });
});

app.get("/users/:id", (req, res) => {
  const idValue = req.params.id;
  const queryText = `SELECT id FROM users WHERE id=${idValue}`;
  client.query(queryText, (err, result) => {
    if (res.rows.length === 0) {
      res.status(404).send(console.log(err, "User ID doesn't exist!"));
    }
    if (err) {
      return res.status(500).send(err, "Unexpected error");
    }
    console.log(result.rows[0]);
    res.status(201).send(result.rows[0]);
    console.log("Hello from the GET SELECT users id");
  });
});

app.get("/users", (req, res) => {});

// start a server that listens on port 3000 and connects the sql client on success
app.listen(3000, () => {
  client.connect();
  console.log("connected on port 3000");
});
