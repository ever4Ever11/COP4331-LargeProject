require('express');
require('mongodb');

exports.setApp = function (app, client) {

    app.post('/api/register', async (req, res, next) => {
        // incoming: firstName, lastName, login, password
        // outgoing: message, error

        let error = '';
        const { firstName, lastName, login, password } = req.body;

        try {
            const db = client.db('Vacation');

            // Check if a user with the same login already exists
            const existingUser = await db.collection('Users').findOne({ Login: login });
            if (existingUser) {
                error = 'User already exists';
            } else {
                // Retrieve the current maximum UserId in the Users collection.
                // If no users exist, newUserId will default to 1.
                const maxUser = await db.collection('Users')
                    .find()
                    .sort({ UserId: -1 })
                    .limit(1)
                    .toArray();

                const newUserId = maxUser.length > 0 ? maxUser[0].UserId + 1 : 1;

                // Create a new user record with the auto-incremented id
                const newUser = {
                    UserId: newUserId,
                    FirstName: firstName,
                    LastName: lastName,
                    Login: login,
                    Password: password
                };

                await db.collection('Users').insertOne(newUser);
            }
        } catch (e) {
            error = e.toString();
        }

        const message = error === '' ? 'Successfully registered' : '';
        res.status(200).json({ message, error });
    });

    app.post('/api/login', async (req, res, next) => {
        // incoming: login, password
        // outgoing: id, firstName, lastName, error

        var error = '';

        const { login, password } = req.body;

        const db = client.db('Vacation');
        const results = await db.collection('Users').find({ Login: login, Password: password }).toArray();

        var id = -1;
        var fn = '';
        var ln = '';

        if (results.length > 0) {
            id = results[0].UserId;
            fn = results[0].FirstName;
            ln = results[0].LastName;
        }

        var ret = { id: id, firstName: fn, lastName: ln, error: '' };
        res.status(200).json(ret);
    });
}

