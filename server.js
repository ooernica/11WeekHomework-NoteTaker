const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
const uuid = require('./helpers/uuid');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});



app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"))
});

app.post("/api/notes", (req, res) => {
    const {title, text} = req.body;
    if (title&&text) {
        const saveNote = {
            title: title,
            text: text,
            id: uuid()
        };
        fs.readFile("./db/db.json", "utf8", (err, data) => {
            if(err){
                console.log("help me obiwan kenobi");
            } else {
                const saveData = JSON.parse(data);
                saveData.push(saveNote);
                const dataJson = JSON.stringify(saveData);
                fs.writeFile("./db/db.json", dataJson, (err) => 
                err ?
                console.error(err) :  console.log("great success")
                )
                res.json(JSON.parse(dataJson));
            }
        })
    }
    
});

app.delete("/api/notes/:id", (req, res) => {
    const deleteJson = fs.readFileSync("./db/db.json", "utf8");
    const deleteNote = JSON.parse(deleteJson);
    const deleteString = (req.params.id).toString();
    newNotes=deleteNote.filter(note => {
        return note.id != deleteString;  
    })
    fs.writeFileSync("./db/db.json", JSON.stringify(newNotes))
    res.json(newNotes);
})

app.get("*", (req,res) => {
    res.redirect("index.html")
});

app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`)
});

