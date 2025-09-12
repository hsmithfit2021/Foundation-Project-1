const ticketDAO = require("../repository/ticketDAO.js");
const {logger} = require("../util/logger.js");

async function getTicketById(ticket_id) {
    logger.info("Getting Tickets by id");
    const dbTicket = await ticketDAO.getTicketById(ticket_id);
    if(!dbTicket) {
        logger.warn("Failed to fetch Ticket");
        return {content: null, error: "Failed to fetch Ticket."};
    }
    logger.info(`Ticket: "${ticket_id}" found`);
    return {content: dbTicket};
}
async function getTicketsByStatus(status) {
    logger.info("Getting Tickets by status");
    const listItems = await ticketDAO.getTicketsByStatus(status);
    if(!listItems) {
        logger.warn("Failed to fetch Tickets");
        return {content: null, error: "Failed to fetch Tickets."};
    }
    logger.info(`${listItems.length} tickets found"`);
    return {content: listItems};
}
async function getTicketsByUsername(username) {
    logger.info("Getting Tickets by username");
    const listItems = await ticketDAO.getTicketsByUsername(username);
    if(!listItems) {
        logger.warn("Failed to fetch Tickets");
        return {content: null, error: "Failed to fetch Tickets."};
    }
    logger.info(`${listItems.length} tickets found"`);
    return {content: listItems};
}

async function addTicket(username, ticket) {
    logger.info("Adding ticket");
    ticket.username = username;
    ticket.ticket_id = crypto.randomUUID();
    ticket.status = "Pending";
    const dbTicket = await ticketDAO.addTicket(ticket);
    if(!dbTicket) {
        logger.warn("Failed to add Ticket");
        return {content: null, error: "Adding Ticket Failed"};
    }
    logger.info(`Ticket: "${ticket.ticket_id}" by User: "${username}" added`);
    return {content: dbTicket};
}

async function updateTicket(ticket) {
    logger.info("Updating ticket");
    if(!(ticket.status === "Accepted" || ticket.status === "Denied")) {
        logger.warn("Invalid status");
        return {content: null, error: "Ticket can only be set to Accepted or Denied."};
    }

    const dbTicket = await ticketDAO.updateTicket(ticket);
    if(!dbTicket) {
        logger.warn("Failed to update Ticket");
        return {content: null, error: "Updating Ticket Failed"};
    }
    logger.info(`Ticket: "${dbTicket.ticket_id}" by User: "${dbTicket.username}" updated`);
    return {content: dbTicket};
}

module.exports = {
    addTicket,
    updateTicket,
    getTicketsByStatus,
    getTicketsByUsername,
    getTicketById
}