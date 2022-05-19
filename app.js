require('dotenv').config();
const express = require('express');
const app = express();
const controllers = require('./controllers');
const db = require('./db');

app.use(require('./middleware/headers'));
app.use(express.json());
app.use('/user', controllers.usercontroller);
app.use('/game', controllers.gamecontroller);
app.use('/category', controllers.categorycontroller);

db.authenticate()
.then(()=>db.sync())
.then(()=>{
    app.listen(process.env.PORT || 3000, ()=> console.log(`[SERVER:] App is listening on Port ${process.env.PORT}`))
})
.catch((err)=>{
    console.log('[SERVER:] Server Crashed');
    console.error(err);
})