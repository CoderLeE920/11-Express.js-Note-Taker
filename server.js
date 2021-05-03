const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require("uuid");
const data = require("./db/db.json");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//get the css
app.use(express.static(__dirname + '/public'));

// HTML Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

//API Routes, Displays all notes
app.get('/api/notes', (req, res) => res.json(data));

// Post a new note
app.post("/api/notes", (req, res) => {
    const newnote = req.body;
    newnote.id = uuidv4();
    data.push(newnote);
    fs.writeFile("./db/db.json", JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log("New note added");
    });
    res.json(newnote);
});

// Deletes existing notes
app.delete("/api/notes/:id", (req, res) => {
    for (index of data) {
        if (index.id == req.params.id) {
            const removedIndex = data.indexOf(index);
            data.splice(removedIndex, 1);
            fs.writeFile("./db/db.json", JSON.stringify(data), (err) => {
                if (err) throw err;
            });
            console.log("Note deleted");
        }
    }
    res.json();
});

// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));