const express = require('express');
const usersRouter = express.Router();
const db = require('../database');

usersRouter.get('/', (req, res) => {
    res.send('Users');
});
usersRouter.get('/:id', (req, res) => {
    db.raw(`SELECT * FROM users WHERE id = ?;`, [req.params.id])
        .then((results) => {
            if (results.rows.length === 0) {
                res.send(400, 'Not found')
            } else {
                res.json(results.rows);
            }
        })
        .catch((err) => {
            res.send('This is an error.')
        });
});
usersRouter.post('/login', (req, res) => {
    let email = req.body.email;
    let pw = req.body.password;
    db.raw("SELECT * FROM users WHERE email = ?;", [email])
        .then((results) => {
            if (results.rows.length === 0) {
                return res.send({ "message": "User not found." })
            } else if (results.rows[0].password === pw) {
                return res.json(results.rows);
            } else {
                return res.send({ "message": "Incorrect password." });
            };
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
        });
});
usersRouter.post('/register', (req, res) => {
    let email = req.body.email;
    let pw = req.body.password;
    db.raw("SELECT * FROM users WHERE email = ?", [email])
        .then((results) => {
            if (results.rows.length !== 0) {
                return res.send({ "message": "User already exists." });
            }
            db.raw(`INSERT INTO users (email, password) VALUES (?, ?) RETURNING *;`, [email, pw])
                .then((results) => {
                    res.json(results.rows[0]);
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
        });
});
usersRouter.put('/:id/forgot-password', (req, res) => {
    let userId = req.params.id;
    let newPw = req.body;
    db.raw("SELECT * FROM users WHERE id = ?", [userId])
        .then((results) => {
            if (results.rows.length == 0) {
                return res.send("User not found");
            }
            db.raw("UPDATE users SET password = ? WHERE id = ? RETURNING *", [newPw.password, userId])
                .then((results) => {
                    res.json({ "message": "New password created!" });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
        });

});
usersRouter.delete('/:id', (req, res) => {
    let userId = req.params.id;
    db.raw("SELECT * FROM users WHERE id = ?", [userId])
        .then((results) => {
            console.log(results);
            if (results.rows.length == 0) {
                return res.send(400, 'Not found');
            }
            db.raw("DELETE FROM users WHERE id = ? RETURNING *", [userId])
                .then((results) => {
                    res.json({ "message": `User_id: ${userId} successfully deleted.` })
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
        });
});
module.exports = usersRouter;