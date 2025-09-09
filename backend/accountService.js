const accountDAO = require("./accountDAO.js");

async function login(user) {
    const dbAccount = await accountDAO.getAccount(user.username);
    if(!dbAccount) {
        console.log("not found")
        return {content: null, errors: ["Account not found."]};
    }
    if(dbAccount.password !== user.password) {
        console.log("bad password")
        return {content: null, errors: ["Incorrect password."]};
    }
    console.log("success")
    console.log(dbAccount)
    return {content: dbAccount, errors: []};
}


async function register(user) {
    if(await accountDAO.getAccount(user.username)) {
        return {content: null, errors: [`Username "${user.username}" already exists.`]};
    }
    // Some other checks...


    user.admin = false;
    const dbAccount = await accountDAO.addAccount(user);
    if(!dbAccount) {
        return {content: null, errors: ["Registration Failed"]};
    }
    return {content: dbAccount, errors: []};
    
}

module.exports = {
    login,
    register
}