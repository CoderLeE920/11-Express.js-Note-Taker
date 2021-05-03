const express = require("express");
const path = require("path");
const fs = require("fs");

// creating an "express" server
const app = express();
const PORT = process.env.PORT || 3000;

// Express app - parsing data
app.use(express.urlencoded({extended:true}));
app.use(express.json());


const noteData = require("./Develop/db/db.json"); 

app.use(express.static("Develop/public"));

//notes.html
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "Develop\public\notes.html"));
});

app.get("/api/notes" , function(req, res) {
  return res.json(noteData);
});

app.post("/api/notes", function(req,res) {
  const newNote = req.body;
  let maxID = 0;
  for(const note of noteData) {
    let currentID = note.id;
    if (currentID > maxID) {
      maxID = currentID;
    }
  }
  newNote.id = maxID + 1;
  let tempNoteData = noteData;
  tempNoteData.push(newNote);
  fs.writeFile("Develop\db\db.json", JSON.stringify(tempNoteData), err => {
    if(err){
      console.log(err);
    } else {
      console.log("Added new note");
      console.log(noteData)
      res.json(newNote);
    }
  });
});

// Delete a note

app.delete("/api/notes/:id", function(req, res) {
  const chosenID = req.params.id;
  let tempDB = noteData;
  for (let i = 0; i < tempDB.length; i++) {
    if (chosenID === tempDB[i].id.toString()) {
      tempDB.splice(i, 1);
    }
  }
  // Rewrite the notes to the 'db.json' file
  fs.writeFile("./Develop/db/db.json", JSON.stringify(tempDB), err => {
    if (err) {
      res.sendStatus(500);
    } else {
      console.log(`Deleted id # ${chosenID} from the database.`);
      console.log(noteData);
      res.sendStatus(200);
    }
  });
});



// Start the server on the port
app.listen(PORT, function() {
  console.log("server is ok: " + PORT);
});