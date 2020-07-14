const express = require("express");

const server = express();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`\n== API running on port ${PORT} ==\n`);
});

// database access using knex
const db = require("./data/dbConfig");

server.get("/api/", (req, res) => {
    // get a list of posts from the database
    // SELECT * FROM posts
    db.select("*")
        .from("accounts")
        .then((accounts) => {
            res.status(200).json({ data: accounts });
        })
        .catch((error) => {
            handleError(error, res);
        });

    // return the list of posts
});

server.get("/api/:id", (req, res) => {
    const { id } = req.params;

    // select * from posts where id=1;
    db.select("*")
        .from("accounts")
        // .where("id", "=", id)
        // .where("id", id)
        .where({ id })
        .first() // same as grabbing the first element from the array manuall with post[0]
        .then((account) => {
            res.status(200).json({ data: account });
        })
        .catch((error) => {
            handleError(error, res);
        });
});

// server.post("/api/", (req, res) => {
//     const accountData = req.body;
//     db("accounts")
//         .insert(accountData)
//         .then((account) => {
//             res.status(200).json(account);
//         })
//         .catch((error) => {
//             handleError(error, res);
//         });
// });

server.post("/api/", (req, res) => {
    const accountData = req.body;
    db("accounts")
        .insert(accountData)
        .then((account) => res.status(201).json(account))
        .catch((err) =>
            res.status(500).json({ message: "problem with the database" }),
        );
});

server.put("/api/:id", (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db("accounts")
        .where({ id })
        .update(changes) // don't forget to have a WHERE
        .then((count) => {
            // count is the number of records updated
            if (count > 0) {
                res.status(200).json({ data: count });
            } else {
                res.status(404).json({
                    message: "there was no record to update",
                });
            }
        })
        .catch((error) => {
            handleError(error, res);
        });
});

server.delete("/api/:id", (req, res) => {
    const { id } = req.params;

    db("accounts")
        .where({ id })
        .del() // don't forget to have a where
        .then((count) => {
            // count is the number of records deleted
            if (count > 0) {
                res.status(200).json({ data: count });
            } else {
                res.status(404).json({
                    message: "there was no record to delete",
                });
            }
        })
        .catch((error) => {
            handleError(error, res);
        });
});

function handleError(error, res) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
}
