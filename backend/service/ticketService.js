const ticketDAO = require("../repository/ticketDAO.js");

async function getTicketsByStatus(status) {
    const listItems = await ticketDAO.getTicketsByStatus(status);
    if(!listItems) {
        return {content: null, error: "Failed to fetch Tickets."};
    }
    return {content: listItems};
}
async function getTicketsByUsername(username) {
    const listItems = await ticketDAO.getTicketsByUsername(username);
    if(!listItems) {
        return {content: null, error: "Failed to fetch Tickets."};
    }
    return {content: listItems};
}

async function addTicket(username, ticket) {
    ticket.username = username;
    ticket.ticket_id = crypto.randomUUID();
    const dbTicket = await ticketDAO.addTicket(ticket);
    if(!dbTicket) {
        return {content: null, error: "Adding Ticket Failed"};
    }
    return {content: dbTicket};
}

async function updateTicket(ticket) {
    if(ticket.status === "Pending") {
        return {content: null, error: "Ticket can only be set to Accepted or Denied."};
    }

    const dbTicket = await ticketDAO.addTicket(ticket);
    if(!dbTicket) {
        return {content: null, error: "Adding Ticket Failed"};
    }
    return {content: dbTicket};
}

module.exports = {
    addTicket,
    updateTicket,
    getTicketsByStatus,
    getTicketsByUsername
}