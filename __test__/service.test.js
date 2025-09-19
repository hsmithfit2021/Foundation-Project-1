const ticketService = require("../backend/service/ticketService.js");
const ticketDAO = require("../backend/repository/ticketDAO.js");
const accountService = require("../backend/service/accountService.js");
const accountDAO = require("../backend/repository/accountDAO.js");

const bcrypt = require("bcrypt");

test("Login Success", async () => {
    const spyFind = jest.spyOn(accountDAO, 'getAccountByUsername');
    spyFind.mockImplementation(async () => {return {user_id: "1", username: "username", password: await bcrypt.hash("password", 10)}})

    const user = {username: "username", password: "password"};
    const result = await accountService.login(user);

    expect(result.content).toBeTruthy();
    expect(result.content.username).toBe("username");
    expect(spyFind).toHaveBeenCalledTimes(1);

    spyFind.mockClear();
});

test("Login DynamoDB Fail", async () => {
    const spyFind = jest.spyOn(accountDAO, 'getAccountByUsername');
    spyFind.mockImplementation(async () => {return null})

    const user = {username: "username", password: "password"};
    const result = await accountService.login(user);

    expect(result.content).toBeFalsy();
    expect(spyFind).toHaveBeenCalledTimes(1);

    spyFind.mockClear();
});

test("Login Bad Username", async () => {
    const spyFind = jest.spyOn(accountDAO, 'getAccountByUsername');
    spyFind.mockImplementation(() => {return null})

    const user = {username: "invalid", password: "password"};
    const result = await accountService.login(user);

    expect(result.content).toBeFalsy();
    expect(result.error).toBe("Invalid credentials.");
    expect(spyFind).toHaveBeenCalledTimes(1);

    spyFind.mockClear();
});

test("Login Bad Password", async () => {
    const spyFind = jest.spyOn(accountDAO, 'getAccountByUsername');
    spyFind.mockImplementation(async () => {return {user_id: "1", username: "username", password: await bcrypt.hash("password", 10)}})

    const user = {username: "username", password: "invalid"};
    const result = await accountService.login(user);

    expect(result.content).toBeFalsy();
    expect(result.error).toBe("Invalid credentials.");
    expect(spyFind).toHaveBeenCalledTimes(1);

    spyFind.mockClear();
});


test("Register", async () => {
    const spyAdd = jest.spyOn(accountDAO, 'addAccount');
    spyAdd.mockImplementation(() => {return {username:"username", password:"password"}});

    const user = {username: "username", password: "password"};
    const result = await accountService.register(user);

    expect(result.content).toBeTruthy();
    expect(result.content.username).toBe("username");
    expect(spyAdd).toHaveBeenCalledTimes(1);

    spyAdd.mockClear();
});

test("Register Dynamo DB Fail", async () => {
    const spyAdd = jest.spyOn(accountDAO, 'addAccount');
    spyAdd.mockImplementation(() => {return null});

    const user = {username: "username", password: "password"};
    const result = await accountService.register(user);

    expect(result.content).toBeFalsy();
    expect(spyAdd).toHaveBeenCalledTimes(1);

    spyAdd.mockClear();
});



test("Add ticket", async () => {
    const spyAdd = jest.spyOn(ticketDAO, 'addTicket');
    spyAdd.mockImplementation(() => {return {ticket_id: "1", amount: 4.45, description: "hello", username: "username", status: "Pending"}});

    const ticket = {amount: 4.45, description: "hello", username: "username"};
    const result = await ticketService.addTicket("username", ticket);

    expect(result.content).toBeTruthy();
    expect(result.content.ticket_id).toBeTruthy();
    expect(result.content.amount).toBe(4.45);
    expect(result.content.description).toBe("hello");
    expect(result.content.status).toBe("Pending");
    expect(spyAdd).toHaveBeenCalledTimes(1);

    spyAdd.mockClear();
});

test("Add DynamoDB Fail", async () => {
    const spyAdd = jest.spyOn(ticketDAO, 'addTicket');
    spyAdd.mockImplementation(() => {return null});

    const ticket = {amount: 4.45, description: "hello", username: "username"};
    const result = await ticketService.addTicket("username", ticket);

    expect(result.content).toBeFalsy();
    expect(spyAdd).toHaveBeenCalledTimes(1);

    spyAdd.mockClear();
});

test("Update ticket", async () => {
    const spyUpdate = jest.spyOn(ticketDAO, 'updateTicket');
    spyUpdate.mockImplementation(() => {
        return {ticket_id: "1", amount: 4.45, description: "hello", username: "username", status: "Accepted"}});

    const ticket = {amount: 4.45, description: "hello", username: "username", status: "Accepted"};
    const result = await ticketService.updateTicket(ticket);

    expect(result.content).toBeTruthy();
    expect(result.content.ticket_id).toBeTruthy();
    expect(result.content.amount).toBe(4.45);
    expect(result.content.description).toBe("hello");
    expect(result.content.status).toBe("Accepted");
    expect(spyUpdate).toHaveBeenCalledTimes(1);

    spyUpdate.mockClear();
});

test("Update ticket DynamoDB Fail", async () => {
    const spyUpdate = jest.spyOn(ticketDAO, 'updateTicket');
    spyUpdate.mockImplementation(() => {return null});

    const ticket = {amount: 4.45, description: "hello", username: "username", status: "Accepted"};
    const result = await ticketService.updateTicket(ticket);

    expect(result.content).toBeFalsy();
    expect(spyUpdate).toHaveBeenCalledTimes(1);

    spyUpdate.mockClear();
});

test("Update ticket invalid status", async () => {
    const spyUpdate = jest.spyOn(ticketDAO, 'updateTicket');
    spyUpdate.mockImplementation(() => {return {ticket_id: "1", amount: 4.45, description: "hello", username: "username", status: "Pending"}});

    const ticket = {amount: 4.45, description: "hello", username: "username", status: "Pending"};
    const result = await ticketService.updateTicket(ticket);

    expect(result.content).toBeFalsy();
    expect(spyUpdate).toHaveBeenCalledTimes(0);

    spyUpdate.mockClear();
});

test("Get tickets by username", async () => {
    const spyFind = jest.spyOn(ticketDAO, 'getTicketsByUsername');
    spyFind.mockImplementation(() => {return [{ticket_id: "1", amount: 4.45, description: "hello", username: "username", status: "Pending"}]});

    const username = "username";
    const result = await ticketService.getTicketsByUsername(username);

    expect(result.content).toBeTruthy()
    expect(result.content[0]).toBeTruthy()
    expect(spyFind).toHaveBeenCalledTimes(1);

    spyFind.mockClear();
});

test("Get tickets by username DynamoDB Fail", async () => {
    const spyFind = jest.spyOn(ticketDAO, 'getTicketsByUsername');
    spyFind.mockImplementation(() => {return null});

    const username = "username";
    const result = await ticketService.getTicketsByUsername(username);

    expect(result.content).toBeFalsy()
    expect(spyFind).toHaveBeenCalledTimes(1);

    spyFind.mockClear();
});

test("Get tickets by status", async () => {
    const spyFind = jest.spyOn(ticketDAO, 'getTicketsByStatus');
    spyFind.mockImplementation(() => {return [{ticket_id: "1", amount: 4.45, description: "hello", username: "username", status: "Pending"}]});

    const status = "Pending";
    const result = await ticketService.getTicketsByStatus(status);

    expect(result.content).toBeTruthy()
    expect(result.content[0]).toBeTruthy()
    expect(spyFind).toHaveBeenCalledTimes(1);

    spyFind.mockClear();
});

test("Get tickets by status DynamoDB Fail", async () => {
    const spyFind = jest.spyOn(ticketDAO, 'getTicketsByStatus');
    spyFind.mockImplementation(() => {return null});

    const status = "Pending";
    const result = await ticketService.getTicketsByStatus(status);

    expect(result.content).toBeFalsy()
    expect(spyFind).toHaveBeenCalledTimes(1);

    spyFind.mockClear();
});