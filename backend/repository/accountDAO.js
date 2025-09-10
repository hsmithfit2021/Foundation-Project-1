const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({region: "us-east-2"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "account";

async function getAccountByUsername(username) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {"#username": "username"},
        ExpressionAttributeValues: {":username" : username}
    });
    try {
        const data = await documentClient.send(command);
        return data.Items[0];
    }
    catch(error) {
        console.error(error);
        return null;
    }
}

async function addAccount(user) {
    const command = new PutCommand({
        TableName,
        Item: user
    });
    try {
        await documentClient.send(command);
        return user;
    }
    catch(error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    getAccountByUsername,
    addAccount
}