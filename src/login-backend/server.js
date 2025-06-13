const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./users.db')

app.post('/login', (req, res) => {

    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ? AND password = ? ", [username, password], (err, found) => {

        if (err) return res.status(500).json({error: 'Database error'});
        if (found) return res.json({success: true, message: 'Login Successful'});
        else return res.status(401).json({success: false, message: "Login Failed"});

    });

});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});