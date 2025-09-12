const ticketService = require("../service/ticketService.js");
const express = require('express');
const router = express.Router();
const { authenticateToken } = require("../util/jwt");

router.get("/", authenticateToken, async (req, res) => {
    const user = res.locals.user;
    if(!user.admin) {
        res.status(403).json({content: null, error: "This feature is reserved for administrators."});
        return;
    }
    const status = req.query.status;
    if(!status || !(status === "Pending" || status === "Accepted" || status === "Denied")) {
        res.status(400).json({content: null, error: "Invalid Status."});
        return;
    }
    const data = await ticketService.getTicketsByStatus(status);
    res.status(data.content ? 200 : 400).json(data);
});

router.get("/account/:user_id", authenticateToken, async(req, res) => {
    const user_id = req.params.user_id;
    const user = res.locals.user;
    if(user.admin) {
        res.status(403).json({content: null, error: "This feature is reserved for employees."});
        return;
    }

    if(user_id !== user.user_id) {
        res.status(400).json({content: null, error: "You do not have access to this user's information."});
        return;
    }
    const data = await ticketService.getTicketsByUsername(user.username);
    res.status(data.content ? 200 : 400).json(data);
})

router.put("/:ticket_id", authenticateToken, async(req, res) => {
    const ticket_id = req.params.ticket_id;
    const ticket = req.body;
    const user = res.locals.user;

    if(!user.admin) {
        res.status(403).json({content: null, error: "This feature is reserved for administrators."});
        return;
    }
    
    const getCheck = await ticketService.getTicketById(ticket_id);
    const dbTicket = getCheck.content;

    if(!dbTicket) {
        res.status(404).json({content: null, error: "Ticket not found."});
        return;
    }

    if(!(dbTicket.status === "Pending" || dbTicket.status === ticket.status)) {
        res.status(400).json({content: null, error: "Can only update Tickets with status: \"Pending\"."});
        return;
    }

    dbTicket.status = ticket.status;
    const data = await ticketService.updateTicket(dbTicket);
    res.status(data.content ? 200 : 400).json(data);
})

router.post("/", authenticateToken, validateTicket, async (req, res) => {
    const ticket = req.body;
    const user = res.locals.user;

    if(user.admin) {
        res.status(403).json({content: null, error: "This feature is reserved for employees."});
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
    if(Number.isNaN(Number(ticket.amount))) {
        res.status(400).json({content: null, error: "Amount must be a number."});
        return;
    }
    next();
}

module.exports = router;