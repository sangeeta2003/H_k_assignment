const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const {JWT_SECRET} = require("../config");
const { User } = require("../db");
const router = Router();

// Admin Routes
router.post('/signup', async(req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    await Admin.create({
        username:username,
        password:password
    })
    res.json({
        message:'Admin create successfully'
    })
});

router.post('/signin', async(req, res) => {
    // Implement admin signup logic

    const username = req.body.username;
    const password = req.body.password;


    const user = await User.find({
        username,
        password
    })

    if(user){
const token =  jwt.sign({
        username
    },JWT_SECRET);
    res.json({token})
    }else{
        res.status(411).json({msg:"Incorrect email and password"})
    }

   
});

router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
});

module.exports = router;