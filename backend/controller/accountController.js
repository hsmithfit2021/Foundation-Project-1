const accountService = require("../service/accountService.js");
const express = require('express');
const router = express.Router();


const jwt = require('jsonwebtoken');
const secretKey = "my-secret-key";


router.post("/", validatePostUser, async (req, res) => {
    const user = req.body;
    const data = await accountService.register(user);
    res.status(data.content ? 201 : 400).json(data)
})
router.post("/login", async (req, res) => {
    const user = req.body;
    const data = await accountService.login(user);
    if(data.content) {
        const token = jwt.sign(
            {
                user_id: data.content.user_id,
                username: user.username,
                admin: data.content.admin
            },
            secretKey,
            {
                expiresIn: "15m"
            }
        );
        data.token = token;
    }
    res.status(data.content ? 200 : 400).json(data)
});


async function validatePostUser(req, res, next){
    const user = req.body;
    if(!user.username || !user.password) {
        res.status(400).json({content: null, error: "Credentials not entered."})
        return;
    }
    if(await accountService.getUserByName(user.username)) {
        res.status(400).json({content: null, error: "Username already exists."});
        return;
    }
    next();
}


module.exports = router;


