require('dotenv').config();
const router = require("express").Router();
const { User, Category } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require("crypto");
const validateSession = require("../middleware/validateSession");

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
      api_key: process.env.SENDGRID_KEY
  }
}))

router.get('/test', (req,res)=>res.send('Download a Trial???'));

router.post("/register", async (req, res) => {
    try {
      let { email, username, password, role } = req.body;
      const newUser = await User.create({
        email,
        username,
        password: bcrypt.hashSync(password, 13),
        role: role || "user",
      });
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24,
      });
      res.status(201).json({
        status: "SUCCESS",
        user: newUser,
        sessionToken: token,
      });
      const myGamesCategory = await Category.create({
        name: 'My Games',
        userId: newUser.id
      });
      transporter.sendMail({
        to: newUser.email,
        from: "jmgamingcompany@gmail.com",
        subject: "Welcome To Game Stash App",
        html: "<h1>Welcome Homie!</h1>",
      }).catch(err=>console.log(err));
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        res.status(409).json({
          status: 'ERROR',
          message: "Email or Username already in use.",
        });
      } else {
        res.status(500).json({
          status: 'ERROR',
          message: "Failed to register user.",
        });
      }
    }
  });

  router.post("/login", async (req, res) => {
    let { username, password } = req.body;
    try {
      let loginUser = await User.findOne({
        where: { username },
      });
      if (loginUser && (await bcrypt.compare(password, loginUser.password))) {
        const token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24,
        });
        res.status(200).json({
          status: "SUCCESS",
          user: loginUser,
          sessionToken: token,
        });
      } else {
        res.status(401).json({
          status: 'ERROR',
          message: "Login Failed: Userinformation incorrect.",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'ERROR',
        message: "Error Logging In.",
      });
    }
  });

router.get('/usergamestuff', validateSession, async (req, res)=>{
  try {
    let userGameStuff = await User.findOne({
      where: {id: req.user.id},
      include: ['games', 'categories']
    });
    res.status(200).json({
      status: 'SUCCESS',
      userGameStuff: userGameStuff,
      message: `${req.user.username}'s Game Stuff Is Here!`
    });
  } catch (error) {
    res.status(500).json({
      error: error
    })
  }
})

router.post("/resetpassword", (req, res) => {
  let { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({
      where: { email: email },
    }).then((user) => {
      if (!user) {
        return res.status(422).json({ 
          status: 'ERROR',
          success: '',
          error: "Something Went Wrong, Cannot Rest The Requested User's Password: (No User With That Eamil)"
        });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then(() => {
        transporter.sendMail({
          to: user.email,
          from: "jmgamingcompany@gmail.com",
          subject: "Reset Password Request",
          html: `
                                <h1>Password Reset Requested</h1>
                                <p>There was a request to reset your password. Use the link to reset your password</p>
                                <h4>Click this <a href="http://localhost:3000/resetpassword/${token}">LINK</a>to reset your password</h4>
                                `,
        });
        res.json({
          status: 'SUCCESS',
          success: 'Check Your Email To Reset Password',
          error: ''
        });
      });
    });
  });
});

router.post('/newpassword', (req, res)=>{
  let {newPassword,sentToken} = req.body;
  // const newPassword = req.body.password;
  // const sentToken = req.body.resetToken;
  User.findOne({
    where: {resetToken: sentToken}
  })
    .then(user=>{
      if(!user){
        return res.status(422).json({
          status: 'ERROR',
          success: '',
          error: 'Session Expired, Request To Reset Password Again'
        })
      }
      bcrypt.hash(newPassword, 13)
        .then(hashedPassword=>{
          user.password = hashedPassword;
          user.resetToken = null;
          user.expireToken = null;
          user.save().then(()=>{
            res.json({
              status: 'SUCCESS',
              success: 'Password updated Successfully',
              error: ''
            })
          })
        })
          .catch(err => {
            console.log(err)
          })
    })
});

router.delete('/:id', validateSession, async (req,res)=>{
  let currentUser = await User.findOne({where: {id: req.params.id}});
  try {
    await User.destroy({
      where: {id: currentUser.id}
    });
    res.status(200).json({
      status:'SUCCESS',
      message: 'User Deleted'
    })
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Something went wrong'
    })
  }
})

module.exports = router;