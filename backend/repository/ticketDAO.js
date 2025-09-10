const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({region: "us-east-2"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "ticket";

// THINK ABOUT PARTITION/SORT KEY AND ALSO LEARN TO SCAN

// SELECT SINGLE TICKET function

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

async function deleteTicket(id) {
    const command = new DeleteCommand({
        TableName,
        Key: {id}
    });
    try {
        await documentClient.send(command);
        return true;
    }
    catch(error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    addTicket,
    updateTicket,
    deleteTicket
}