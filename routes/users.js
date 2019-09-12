const express = require('express');
const usersRouter = express.Router();
const db = require('../database');

usersRouter.get('/', (req, res) => {
    res.send('Users');
});
usersRouter.get('/:id', (req, res) => {
    let paramID = req.params.id;
    if (!isNaN(paramID)) {
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
    } else {
        return res.redirect('/', 500)
    }
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
    if (email && pw) {
        db.raw("SELECT * FROM users WHERE email = ?", [email])
            .then((results) => {
                if (results.rows.length !== 0) {
                    return res.send({ "message": "User already exists." });
                } else {
                    return db.raw(`INSERT INTO users (email, password) VALUES (?, ?) RETURNING *;`, [email, pw])
                        .then((results) => {
                            res.json(results.rows[0]);
                        })
                };
            })
            .catch((err) => {
                console.log(err);
                res.status(500);
            })
    } else {
        return res.send(500, "Email & Password required.");
    }
});
usersRouter.put('/:id/forgot-password', (req, res) => {
    let userId = req.params.id;
    let newPw = req.body.password;
    if (!isNaN(userId) && newPw) {
        db.raw("SELECT * FROM users WHERE id = ?", [userId])
            .then((results) => {
                if (results.rows.length == 0) {
                    return res.send("User not found");
                } else {
                    return db.raw("UPDATE users SET password = ? WHERE id = ? RETURNING *", [newPw, userId])
                        .then((results) => {
                            res.json({ "message": "New password created!" });
                        })
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500);
            });
    } else {
        return res.redirect('/user/:id', 500);
    }
});
usersRouter.delete('/:id', (req, res) => {
    let userId = req.params.id;
    if (!isNaN(userId)) {
        db.raw("SELECT * FROM users WHERE id = ?", [userId])
            .then((results) => {
                if (results.rows.length == 0) {
                    return res.send(400, 'Not found');
                } else {
                    return db.raw("DELETE FROM users WHERE id = ? RETURNING *", [userId])
                        .then((results) => {
                            res.json({ "message": `User_id: ${userId} successfully deleted.` })
                        })
                };
            })
            .catch((err) => {
                console.log(err);
                res.status(500);
            })
    } else {
        return res.send(400, "Invalid User ID");
    }
});
module.exports = usersRouter;