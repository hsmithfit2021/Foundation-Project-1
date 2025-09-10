const controller = {
    httpLogin,
    httpRegister,
    httpViewUserTickets,
    httpAddUserTicket,
    httpFilterTickets,
    httpUpdateTicket
};
module.exports = controller;

let dummyUsers = [{ username: "admin", password: "admin", admin: true }];
let dummyTickets = [];

let currentAccount = {};
let id = 1;

// DUMMY FUNCTION
function httpLogin(account) {
    const foundAccount = dummyUsers.find((a) => a.username == account.username && a.password === account.password)
    if(!foundAccount) {
        return {content: null, error: "Account information invalid"};
    }
    currentAccount = foundAccount;
    return {content: foundAccount};
}

//DUMMY FUNCTION
function httpRegister(account) {
    if(dummyUsers.find((a) => a.username === account.username)) {
        return {content: false, error: "Username already exists"};
    }
    dummyUsers.push(account);
    return {content: true};
}

//DUMMY FUNCTION
function httpViewUserTickets() {
    return {content: dummyTickets.filter((ticket) => ticket.username === currentAccount.username)};
}

//DUMMY FUNCTION
function httpAddUserTicket(ticket) {
    ticket.username = currentAccount.username;
    ticket.id = id;
    dummyTickets.push(ticket);
    id++;
    return {content: ticket};
}

//DUMMY FUNCTION
function httpFilterTickets(status) {
    return {content: dummyTickets.filter((ticket) => ticket.status === status)};
}

//DUMMY FUNCTION
function httpUpdateTicket(ticket, approve) {
    if(ticket.status !== "Pending") {
        return {content: null, error: "Ticket must have status Pending" };
    }
    ticket.status = approve ? "Accepted" : "Denied";
    return {content: ticket };
}