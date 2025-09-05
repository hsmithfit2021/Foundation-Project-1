const controller = {
    httpLogin,
    httpRegister,
    httpViewUserTickets,
    httpAddUserTicket,
    httpFilterTickets,
    httpUpdateTicket
};
module.exports = controller;

let dummyUsers = [];
let dummyTickets = [];

let currentAccount = {};

// DUMMY FUNCTION
function httpLogin(account) {
    const foundAccount = dummyUsers.find((a) => a.username == account.username && a.password === account.password)
    if(!foundAccount) {
        return {content: null, errors: ["Account information invalid"], isSuccess() { return this.errors.length === 0; } };
    }
    currentAccount = foundAccount;
    return {content: foundAccount, errors: [], isSuccess() { return this.errors.length === 0; } };
}

//DUMMY FUNCTION
function httpRegister(account) {
    if(dummyUsers.find((a) => a.username === account.username)) {
        return {content: false, errors: ["Username already exists"], isSuccess() { return this.errors.length === 0; } };
    }
    dummyUsers.push(account);
    return {content: true, errors: [], isSuccess() { return this.errors.length === 0; } };
}

//DUMMY FUNCTION
function httpViewUserTickets() {
    return {
        content: dummyTickets.filter((ticket) => ticket.username === currentAccount.username), 
        errors: [], 
        isSuccess() { return this.errors.length === 0; }
    };
}

//DUMMY FUNCTION
function httpAddUserTicket(ticket) {
    dummyTickets.push(ticket);
    return {content: ticket, errors: [], isSuccess() { return this.errors.length === 0; }};
}

//DUMMY FUNCTION
function httpFilterTickets(status) {
    return {
        content: dummyTickets.filter((ticket) => ticket.status === status), 
        errors: [], 
        isSuccess() { return this.errors.length === 0; }
    };
}

//DUMMY FUNCTION
function httpUpdateTicket(ticket, approve) {
    if(ticket.status !== "Pending") {
        return {content: null, errors: ["Ticket must have status Pending"], isSuccess() { return this.errors.length === 0; } };
    }
    ticket.status = approve ? "Accepted" : "Denied";
    return {content: ticket, errors: [], isSuccess() { return this.errors.length === 0; } };
}