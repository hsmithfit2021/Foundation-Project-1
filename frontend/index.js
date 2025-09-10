const controller = require("./frontend-controller.js");
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin, // Read from standard input (keyboard)
  output: process.stdout // Write to standard output (console)
});

console.log("Welcome.");
loginMenu();

function loginMenu() {
    rl.question("\n0. Quit\n1. Login\n2. Register\nSelect an option [0-2]: ", (input) => {
        switch(input) {
            case "0":
                console.log("\nGoodbye!");
                rl.close();
                return;
            case "1":
                login();
                break;
            case "2":
                register();
                break;
            default:
                console.log("\nUnknown command.");
        }
        loginMenu();
    });
}

function userMenu() {
    rl.question("\n0. Logout\n1. View Past Tickets\n2. Add Reimbursement Request\nSelect an option [0-2]: ", (input) => {
        switch(input) {
            case "0":
                loginMenu();
                break;
            case "1":
                userViewTickets();
                break;
            case "2":
                userAddTickets();
                break;
            default:
                console.log("\nUnknown command.");
        }
        userMenu();
    });
}

function adminMenu() {
    rl.question("\n0. Logout\n1. Filter by Status\n2. Approve/Deny Ticket\nSelect an option [0-2]: ", (input) => {
        switch(input) {
            case "0":
                loginMenu();
                return;
            case "1":
                adminFilterTickets();
                break;
            case "2":
                adminApproveTickets();
                break;
            default:
                console.log("\nUnknown command.");
        }
        adminMenu();
    });
}

function login() {
    console.log();
    const account = {};
    rl.question("Enter Username: ", (input) => {
        account.username = input;
        rl.question("Enter Password: ", (input) => {
            account.password = input;

            const result = controller.httpLogin(account);
            if(!result.content) {
                console.log("\nError");
                result.errors.forEach((e) => console.log(e));
                loginMenu();
                return;
            }
            const login = result.content;

            console.log(`Welcome, ${login.username}!`);
            if(!login.admin){
                userMenu();
                return;
            }
            adminMenu();
        })
    });
    loginMenu();

}


function register() {
    console.log();
    const account = {};
    rl.question("Enter Username: ", (input) => {
        if(!input) {
            console.log("Empty usernames are not allowed.")
            register();
            return;   
        }

        account.username = input;
        
        rl.question("Enter Password: ", (input) => {
            if(!input) {
                console.log("Empty passwords are not allowed.")
                register();
                return;   
            }

            account.password = input;
            //account.admin = false;

            const result = controller.httpRegister(account);
            if(!result.content) {
                console.log("\nError");
                console.log(result.error);
            }
            else {
                console.log("\nAccount registered successfully!");
            }
            loginMenu();
        })
    });
    loginMenu();
}



function userViewTickets() {
    const result = controller.httpViewUserTickets();
    if(!result.content) {
        console.log("\nError");
        console.log(result.error)
    }
    else {
        const listTickets = result.content;

        if(listTickets.length > 0) {
            console.log("\nTickets");
            listTickets.forEach((ticket) => console.log(`${ticket.id}: Amount - $${ticket.amount} Description - ${ticket.description} Status - ${ticket.status}`));
        }
        else {
            console.log("\nNo tickets found!");
        }
    }
    userMenu();
}

function userAddTickets() {
    console.log();
    let ticket = {};
    rl.question("Enter Amount : $", (input) => {
        if(Number.isNaN(Number(input))) {
            console.log("Input must be a number.");
            userAddTickets();
            return;   
        }
        ticket.amount = Number(input).toFixed(2);
        rl.question("Enter Description: ", (input) => {
            if(!input) {
                console.log("Empty descriptions are not allowed.");
                userAddTickets();
                return;   
            }
            ticket.description = input;
            ticket.status = "Pending";
            callbackAddTicket(ticket);
        });
    });
    userMenu();
}

function callbackAddTicket(ticket) {
    if(!ticket) {
        console.log("\nInvalid Fields");
        userMenu();
        return;
    }

    const result = controller.httpAddUserTicket(ticket);
    if(!result.content) {
        console.log("\nError");
        console.log(result.error);
    }
    else {
        console.log("\nTicket successfully added!");
    }
    userMenu();
}

function adminFilterTickets() {
    rl.question("\n0. Pending\n1. Accepted\n2. Denied\nSelect a status [0-2]: ", (input) => {
        let status = "";
        switch(input) {
            case "0":
                status = "Pending";
                break;
            case "1":
                status = "Accepted";
                break;
            case "2":
                status = "Denied";
                break;
            default:
                console.log("\nUnknown status");
                adminMenu();
                return;
        }
        const result = controller.httpFilterTickets(status);
        if(!result.content) {
            console.log("\nError");
            console.log(result.error);
        }
        else {
            const listTickets = result.content;
            if(listTickets.length > 0) {
                console.log("\nTickets");
                listTickets.forEach((ticket) => console.log(`${ticket.id}: User - ${ticket.username} Amount - $${ticket.amount} Description - ${ticket.description} Status - ${ticket.status}`));
            }
            else {
                console.log("\nNo tickets found!");
            }
        }
        adminMenu();
    });
}


function adminApproveTickets() {
    const result = controller.httpFilterTickets("Pending");
    const listTickets = result.content;
    if(listTickets.length > 0) {
        console.log("\n0. Cancel");
        console.log("Tickets");
        listTickets.forEach((ticket) => console.log(`${ticket.id}: User - ${ticket.username} Amount - $${ticket.amount} Description - ${ticket.description} Status - ${ticket.status}`));
        rl.question("Select a Ticket ID: ", (input) => {
            if(input === "0") {
                adminMenu();
                return;
            }

            const selectedId = parseInt(input);
            const selectedTicket = listTickets.find((t) => selectedId === t.id);
            if (!selectedTicket) {
                console.log("\nTicket not found.");
                adminMenu();
            }
            else {
                adminApproveCallback(selectedTicket);
            }
        });
    }
    else {
        console.log("No tickets found!");
    }

}

function adminApproveCallback(ticket) {
    rl.question("\n0. Cancel\n1. Accepted\n2. Denied\nSelect a status [1-2]: ", (input) => {
        let approve = null;
        switch(input) {
            case "0":
                adminMenu();
                return;
            case "1":
                approve = true;
                break;
            case "2":
                approve = false;
                break;
            default:
                console.log("\nUnknown status");
                adminApproveTickets();
                return;
        }
        const result = controller.httpUpdateTicket(ticket, approve);
        if(!result.content) {
            console.log("\nError");
            console.log(result.error);
        }
        adminMenu();
    });
}
