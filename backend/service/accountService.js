const accountDAO = require("../repository/accountDAO.js");
const bcrypt = require("bcrypt");
const {logger} = require("../util/logger.js");

async function login(user) {
    logger.info("Logging in")
    const dbAccount = await accountDAO.getAccountByUsername(user.username);
    if(!dbAccount) {
        logger.warn(`Failed to find Account: "${user.username}"`);        
        return {content: null, error: "Invalid credentials."};
    }
    logger.info(`Account: "${user.username}" found successfully`);

    if(!await bcrypt.compare(user.password, dbAccount.password)) {
        logger.warn("Invalid password");
        return {content: null, error: "Invalid credentials."};
    }
    logger.info(`Successfully logged in to Account: "${dbAccount.username}"`);
    return {content: dbAccount};
}


async function register(user) {
    logger.info("Registering Account");
    user.password = await bcrypt.hash(user.password, 10);
    user.user_id = crypto.randomUUID();
    user.admin = false;

    const dbAccount = await accountDAO.addAccount(user);
    if(!dbAccount) {
        logger.warn(`Failed to register Account "${user.username}"`);
        return {content: null, error: "Registration Failed"};
    }
    logger.info(`Successfully registered Account: "${dbAccount.username}"`);
    return {content: dbAccount};
    
}

async function getUserByName(username) {
    logger.info("Fetching Account by username");
    return await accountDAO.getAccountByUsername(username);
}

module.exports = {
    login,
    register,
    getUserByName
}