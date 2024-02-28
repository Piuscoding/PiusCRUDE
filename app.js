require("dotenv").config()
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();


const PORT = process.env.PORT || 5500

//middlewares
app.use(express.urlencoded({extended: false}));

//session
app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: false
}))

app.use((req, res, next)=>{
res.locals.message = req.session.message
delete req.session.message
next();
});

//static files
app.use(express.static('uploads'));
//set template engine
app.set("view engine", "ejs");

//db
mongoose.connect('mongodb+srv://pius1:pius123@webdevelopment.xav1dsx.mongodb.net/imgae-upload')
.then(app.listen(PORT, () => console.log(`server started on port http://localhost:${PORT} `)) ).catch(error =>{
    console.log(error);  
  })

//route prefix
app.use("", require("./routes/routes"));
