const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Creates Express App
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("Develop/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Creating GET routes

// GET route sending user to INDEX page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});

// GET route sending user to NOTES page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});

// GET route using DB.JSON file
app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "Develop/db/db.json"));
});

// Creating POST route- takes JSON input, "title" "text" and adds a new note object to the db.json file
app.post("/api/notes", function (req, res) {
  fs.readFile(
    path.join(__dirname, "Develop/db/db.json"),
    "utf8",
    function (error, response) {
      if (error) {
        console.log(error);
      }
      const notes = JSON.parse(response);
      const noteRequest = req.body;
      const newNoteID = uuidv4(); // Generate a unique ID using uuid
      const newNote = {
        id: newNoteID,
        title: noteRequest.title,
        text: noteRequest.text,
      };
      notes.push(newNote);
      res.json(newNote);
      fs.writeFile(
        path.join(__dirname, "Develop/db/db.json"),
        JSON.stringify(notes, null, 2),
        function (err) {
          if (err) throw err;
        }
      );
    }
  );
});

// Creates DELETE function- deleting the note object with the id from the DB.JSON FILE
app.delete("/api/notes/:id", function (req, res) {
  const deleteID = req.params.id;
  fs.readFile("Develop/db/db.json", "utf8", function (error, response) {
    // Corrected the path here
    if (error) {
      console.log(error);
    }
    let notes = JSON.parse(response);
    notes = notes.filter((note) => note.id !== deleteID); // Filter notes by id, not array index
    fs.writeFile(
      "Develop/db/db.json",
      JSON.stringify(notes, null, 2),
      function (err) {
        if (err) throw err;
        res.json(notes); // Respond with the updated notes
      }
    );
  });
});

// Creates listener which starts the server
app.listen(PORT, function () {
  console.log(`App is listening on Port ${PORT}`);
});
