const accountDAO = require("../repository/accountDAO.js");
const bcrypt = require("bcrypt");

async function login(user) {
    const dbAccount = await accountDAO.getAccountByUsername(user.username);
    if(!dbAccount) {
        console.log("not found");
        return {content: null, error: "Account not found."};
    }
    if(!await bcrypt.compare(user.password, dbAccount.password)) {
        console.log("bad password");
        return {content: null, error: "Incorrect password."};
    }
    console.log("success")
    return {content: dbAccount};
}


async function register(user) {
    user.password = await bcrypt.hash(user.password, 10);
    user.user_id = crypto.randomUUID();
    user.admin = false;

    console.log(user);
    const dbAccount = await accountDAO.addAccount(user);
    if(!dbAccount) {
        return {content: null, error: "Registration Failed"};
    }
    return {content: dbAccount};
    
}

async function getUserByName(username) {
    return await accountDAO.getAccountByUsername(username);
}

module.exports = {
    login,
    register,
    getUserByName
}