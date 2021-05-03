const express = require('express');
const path = require('path');
const fs = require("fs");

const app = express();

//listen on a port
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (_req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

app.get("/api/notes", (_req, res) => {
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});


app.post("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        const db = JSON.parse(data);
        const newDB = [];

        db.push(req.body);

        for (let i = 0; i < db.length; i++) {
            const newNote = {
                title: db[i].title,
                text: db[i].text,
                id: i
            };

            newDB.push(newNote);
        }

        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(newDB, null, 2), (err) => {
            if (err) throw err;
            res.json(req.body);
        });
    });
});

app.delete("/api/notes/:id", function (req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })

    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

// Starts the server to begin listening
// app.listen(3000)
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));