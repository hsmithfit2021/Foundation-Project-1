const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({region: "us-east-2"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "ticket";

async function getTicketById(ticket_id) {
    const command = new GetCommand({
        TableName,
        Key: {ticket_id}
    });
    try {
        const data = await documentClient.send(command);
        return data.Item;
    }
    catch(error) {
        console.error(error);
        return null;
    }
}

async function getTicketsByStatus(status) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#status = :status",
        ExpressionAttributeNames: {"#status": "status"},
        ExpressionAttributeValues: {":status" : status}
    });
    try {
        const data = await documentClient.send(command);
        return data.Items;
    }
    catch(error) {
        console.error(error);
        return null;
    }
}

async function getTicketsByUsername(username) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {"#username": "username"},
        ExpressionAttributeValues: {":username" : username}
    });
    try {
        const data = await documentClient.send(command);
        return data.Items;
    }
    catch(error) {
        console.error(error);
        return null;
    }
}

// GET TICKET BY STATUS function

async function addTicket(ticket) {
    const command = new PutCommand({
        TableName,
        Item: ticket
    });
    try {
        await documentClient.send(command);
        return ticket;
    }
    catch(error) {
        console.error(error);
        return null;
    }
}

async function updateTicket(ticket) {
    const command = new PutCommand({
        TableName,
        Item: ticket
    });
    try {
        await documentClient.send(command);
        return ticket;
    }
    catch(error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    addTicket,
    updateTicket,
    getTicketsByStatus,
    getTicketsByUsername,
    getTicketById
}