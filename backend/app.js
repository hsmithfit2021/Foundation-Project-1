const express = require('express');
const { logger, loggerMiddleware } = require("./util/logger.js")
const app = express();
const accountController = require('./controller/accountController');
const ticketController = require('./controller/ticketController');
const { authenticateToken } = require("./util/jwt");

const PORT = 3000;

app.use(express.json());
app.use(loggerMiddleware)
app.use("/account", accountController);
app.use("/ticket", ticketController);

app.get("/", authenticateToken, (req, res) => {
    const user = res.locals.user;
    res.status(200).json({content: user});
});

app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`);
})