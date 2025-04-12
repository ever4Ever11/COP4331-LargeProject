require('express');
require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const
{
  sendEmailWithSwaks
} = require('./mailgunMailer');

const PORT = 5000;

const itinerary = require('./itinerary.js');


exports.setApp = function(app, client)
{
  app.use(cors());
  app.use(bodyParser.json());

  app.post('/api/register', async (req, res, next) =>
  {
    // incoming: firstName, lastName, login, password
    // outgoing: message, error
    let error = '';
    const
    {
      firstName,
      lastName,
      login,
      password
    } = req.body;

    try
    {
      const db = client.db('Vacation');
      const existingUser = await db.collection('Users').findOne(
      {
        Login: login
      });
      if (existingUser)
      {
        error = 'User already exists';
      }
      else
      {
        const maxUser = await db.collection('Users')
          .find()
          .sort(
          {
            UserId: -1
          })
          .limit(1)
          .toArray();

        const newUserId = maxUser.length > 0 ? maxUser[0].UserId + 1 : 1;
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const newUser = {
          UserId: newUserId,
          FirstName: firstName,
          LastName: lastName,
          Login: login,
          Password: password,
          verificationToken,
          verificationTokenExpiresAt,
          isVerified: false
        };

        await db.collection('Users').insertOne(newUser);

        
        const verifyUrl = `${process.env.FRONTEND_URL}/api/verify-email?token=${verificationToken}`;

        
        sendEmailWithSwaks(
          login,
          'Email Verification',
          `Thank you for registering. Please verify your email by clicking on this link: ${verifyUrl}`
        );
      }
    }
    catch (e)
    {
      error = e.toString();
    }

    const message = error === '' ? 'Successfully registered. Please check your email for verification.' : '';
    res.status(200).json(
    {
      message,
      error
    });
  });

  app.post('/api/login', async (req, res, next) =>
  {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error
    let error = '';
    const
    {
      login,
      password
    } = req.body;
    const db = client.db('Vacation');
    const results = await db.collection('Users').find(
    {
      Login: login,
      Password: password
    }).toArray();

    let id = -1,
      fn = '',
      ln = '';
    let ret;

    if (results.length > 0)
    {
      id = results[0].UserId;
      fn = results[0].FirstName;
      ln = results[0].LastName;
      try
      {
        const token = require('./createJWT.js');
        ret = token.createToken(fn, ln, id);
      }
      catch (e)
      {
        ret = {
          error: e.message
        };
      }
    }
    else
    {
      ret = {
        error: 'Login/Password incorrect'
      };
    }
    res.status(200).json(ret);
  });

  app.get('/api/verify-email', async (req, res) =>
  {
    const
    {
      token
    } = req.query;
    if (!token)
    {
      return res.status(400).send('<h1>Error</h1><p>Verification token is missing.</p>');
    }
    try
    {
      const db = client.db('Vacation');

      const user = await db.collection('Users').findOne(
      {
        verificationToken: token,
        verificationTokenExpiresAt:
        {
          $gt: new Date()
        }
      });

      if (!user)
      {
        return res.status(400).send('<h1>Error</h1><p>Invalid or expired token.</p>');
      }

      await db.collection('Users').updateOne(
      {
        _id: user._id
      },
      {
        $set:
        {
          isVerified: true
        },
        $unset:
        {
          verificationToken: '',
          verificationTokenExpiresAt: ''
        }
      });

      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
              <title>Email Verified</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #333; }
                p { font-size: 18px; }
              </style>
          </head>
          <body>
              <h1>Welcome ${user.FirstName}</h1>
              <p>Your email has been successfully verified. You can now close this tab.</p>
          </body>
        </html>
      `);
    }
    catch (err)
    {
      console.error('Verification error:', err);
      res.status(500).send('<h1>Internal Server Error</h1><p>An error occurred during email verification.</p>');
    }
  });

  app.post('/api/request-password-reset', async (req, res) =>
  {
    const
    {
      email
    } = req.body;
    const db = client.db('Vacation');
    const user = await db.collection('Users').findOne(
    {
      Login: email
    });

    if (!user)
    {
      return res.status(400).json(
      {
        error: 'No account with that email found.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await db.collection('Users').updateOne(
    {
      Login: email
    },
    {
      $set:
      {
        resetPasswordToken: resetToken,
        resetPasswordExpiresAt: resetTokenExpiresAt
      }
    });


    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;


    sendEmailWithSwaks(
      email,
      'Password Reset',
      `Click here to reset your password: ${resetUrl}`
    );

    res.json(
    {
      message: 'Password reset email sent.'
    });
  });

  app.post('/api/reset-password', async (req, res) =>
  {
    const
    {
      token,
      newPassword
    } = req.body;
    const db = client.db('Vacation');


    const user = await db.collection('Users').findOne(
    {
      resetPasswordToken: token,
      resetPasswordExpiresAt:
      {
        $gt: new Date()
      }
    });

    if (!user)
    {
      return res.status(400).json(
      {
        error: 'Invalid or expired token.'
      });
    }


    await db.collection('Users').updateOne(
    {
      _id: user._id
    },
    {
      $set:
      {
        Password: newPassword
      },
      $unset:
      {
        resetPasswordToken: '',
        resetPasswordExpiresAt: ''
      }
    });

    res.json(
    {
      message: 'Password successfully reset.'
    });
  });

  app.post('/api/get-itinerary', async (req, res) => {
      try {
          const ret = await itinerary.getItinerary(req.body);
  
          if (ret.error) {
              return res.status(401).json({ error: ret.error });
          }
  
          res.status(200).json(ret);
      } catch (e) {
          res.status(500).json({ error: 'Internal server error' });
      }
  });
};
