const ticketService = require("../service/ticketService.js");
const express = require('express');
const router = express.Router();
const { authenticateToken } = require("../util/jwt");

// ADD A WAY TO GET STATUS (QUERY PARAMS, PATH PARAMS, etc)
router.get("/", authenticateToken, async (req, res) => {
    const user = res.locals.user;
    if(!user.admin) {
        res.status(400).json({content: null, error: "This feature is reserved for administrators."});
        return;
    }
    const data = await ticketService.getTicketsByStatus(status);
    res.status(data.content ? 200 : 400).json(data);
});


router.post("/", authenticateToken, validateTicket, async (req, res) => {
    const ticket = req.body;
    const user = res.locals.user;

    if(user.admin) {
        res.status(400).json({content: null, error: "This feature is reserved for employees."});
        return;
    }

    const data = await ticketService.addTicket(user.username, ticket);
    if(data.content) {
        res.status(201).json(data);
        return;
    }
    res.status(400).json(data);

});




async function validateTicket(req, res, next) {
    const ticket = req.body;
    if(!ticket) {
        res.status(400).json({content: null, error: "Ticket not entered."});
        return;
    }
    if(!ticket.description) {
        res.status(400).json({content: null, error: "Description can not be blank."});
        return;
    }
    if(!ticket.status == "Pending") {
        res.status(400).json({content: null, error: "Status must be Pending."});
        return;
    }
    if(Number.isNaN(Number(ticket.amount))) {
        res.status(400).json({content: null, error: "Amount must be a number."});
        return;
    }
    next();
}

module.exports = router;