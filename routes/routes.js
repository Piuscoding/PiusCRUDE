const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const fs = require("fs")

//image upload
var storage = multer.diskStorage({
    destination: function(req, res, cb){
        cb(null, './uploads');
    },
    filename: function(req, file,cb){
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
})

var upload = multer({
    storage: storage,
}).single("image");

//insert an user into database
router.post("/add",upload,(req, res)=>{
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:req.file.filename
    });
    user.save()
    
    if(!user){
        res.json({message: err.message, type: 'danger'})
    } else{
        req.session.message = {
            type: 'success',
            message: "User added Successfully"
        }
        res.redirect("/")
    }
})

router.get("/", async(req, res)=>{
const users = await User.find().exec()
if(!users){
    res.json({message: err.message});
}else{
    res.render("index",{
        title: "HomePage",
        users: users
    })
}
})

router.get("/add", (req, res)=>{
    res.render('add',{title: 'Add Users'});
})

//Edit an user route
router.get("/edit/:id", async(req, res)=>{
    let id = req.params.id;
   const user = await User.findById(id)
   if(!user){
    res.redirect("/")
   }else{
    res.render("edit", {          
         title: "Edit User",
          user: user
         })
   }
})

//udpdate user route
// router.post("/update/:id",upload, (req, res)=>{
//     let id = req.params.id
//     let new_image =  "";

//     if(req.file){
//         new_image = req.file.filename;
//         try{
//             fs.unlinkSync("./uploads"+req.body.old_image)
//         }catch(err){
//             console.log(err)
//         }
    
//     }else{
//         new_image = req.body.old_image;
//     }
//    const user = User.findByIdAndUpdate(id, {
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         image: new_image,
//     })
//     if(!user){
//         res.json({message: err.message, type: "danger"})
//     }else{
//         req.session.message ={
//         type: "success",
//         message: "User updated successfully"
//         }
//         res.redirect("/")
//     }
// } )

// if(err){
//     res.json({message: err.message, type: "danger"})
// }else{
//     req.session.message ={
//         type: "success",
//         message: "User updated successfully"
//     }
//     res.redirect("/")
// }

router.get("/delete/:id", async(req, res)=>{
    let id = req.params.id
    const user = await User.findByIdAndDelete(id)
    if(user.image !=''){
        try{
            fs.unlinkSync('./uploads/'+user.image)
        }catch(err){
            console.log(err)
        }
    }else{
        req.session.message = {
            type: "info",
            message: "User deleted successfully"
        }
    }
    res.redirect("/")
})
module.exports = router;