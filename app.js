const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const connection = require("./connection");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// GET
app.get("/", (req, res) => res.json({ message: "Hello World!" }));
app.get("/bookmarks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  connection
    .query("select * from bookmark where id = ?", [id])
    .then(([bookmarks]) => {
      if (bookmarks[0] != null) {
        res.json(bookmarks[0]);
      } else {
        res.status(404).send("Bookmark not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
});

// POST
app.post("/bookmarks", (req, res) => {
  const { url, title } = req.body;
  if (!url || !title) {
    return res.status(422).json({ error: "required field(s) missing" });
  }
  connection.query("INSERT INTO bookmark SET ?", req.body, (err, stats) => {
    if (err) return res.status(500).json({ error: err.message, sql: err.sql });

    connection.query(
      "SELECT * FROM bookmark WHERE id = ?",
      stats.insertId,
      (err, records) => {
        if (err)
          return res.status(500).json({ error: err.message, sql: err.sql });
        return res.status(201).json(records[0]);
      },
    );
  });
});

module.exports = app;
