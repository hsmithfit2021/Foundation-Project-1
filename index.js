const controller = require("./frontend-controller.js");
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin, // Read from standard input (keyboard)
  output: process.stdout // Write to standard output (console)
});


loginMenu();

function loginMenu() {
    rl.question("0. Quit\n1. Login\n2. Register\nSelect an option [0-2]: ", (input) => {
        switch(input) {
            case "0":
                rl.close();
                return;
            case "1":
                login();
                break;
            case "2":
                register();
                break;
            default:
                console.log("Unknown command.");
        }
        loginMenu();
    });
}

function userMenu() {
    rl.question("0. Logout\n1. View Past Tickets\n2. Add Reimbursement Request\nSelect an option [0-2]: ", (input) => {
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
                console.log("Unknown command.");
        }
        userMenu();
    });
}

function adminMenu() {
    rl.question("0. Logout\n1. Filter by Status\n2. Approve/Deny Ticket\nSelect an option [0-2]: ", (input) => {
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
                console.log("Unknown command.");
        }
        adminMenu();
    });
}

function login() {
    const account = {};
    rl.question("Enter Username: ", (input) => {
        account.username = input;
        rl.question("Enter Password: ", (input) => {
            account.password = input;

            const result = controller.httpLogin(account);
            if(!result.isSuccess()) {
                console.log("Invalid credentials.")
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

}


function register() {
    const account = {};
    rl.question("Enter Username: ", (input) => {
        account.username = input;
        rl.question("Enter Password: ", (input) => {
            account.password = input;
            rl.question("Admin? [y/n]: ", (input) => {
                account.admin = input === "y";

                const result = controller.httpRegister(account);
                if(!result.isSuccess()) {
                    console.log("Account creation failed.");
                }
                else {
                    console.log("Account registered successfully!");
                }
                loginMenu();
            })
        })
    });
}



function userViewTickets() {
    const result = controller.httpViewUserTickets();
    const listTickets = result.content;

    listTickets.forEach((ticket, i) => console.log(`${i}: Amount - $${ticket.amount} Description - ${ticket.description} Status - ${ticket.status}`));
    userMenu();
}

function userAddTickets() {
    const ticket = createTicket();
    if(!ticket) {
        console.log("Invalid Fields");
        userMenu();
        return;
    }

    const result = controller.httpAddUserTicket(ticket);
    if(!result.isSuccess()) {
        console.log("Ticket creation failed");
    }
    else {
        console.log("Ticket successfully added!");
    }
    userMenu();
}

function createTicket() {

}

function adminFilterTickets() {
    rl.question("0. Pending\n1. Accepted\n2. Denied\nSelect a status [0-2]: ", (input) => {
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
                console.log("Unknown status");
                adminMenu();
                return;
        }
        const result = controller.httpFilterTickets(status);
        const listTickets = result.isSuccess;
        listTickets.forEach((ticket, i) => console.log(`${i}: Amount - $${ticket.amount} Description - ${ticket.description} Status - ${ticket.status}`));
        adminMenu();
    });
}


function adminApproveTickets() {
    const ticket = selectTicket();

    rl.question("0. Go Back\n1. Accepted\n2. Denied\nSelect a status [1-2]: ", (input) => {
        let approve = null;
        switch(input) {
            case "0":
                adminApproveTickets();
                return;
            case "1":
                approve = true;
                break;
            case "2":
                approve = false;
                break;
            default:
                console.log("Unknown status");
                adminApproveTickets();
                return;
        }
        const result = controller.httpUpdateTicket(ticket, approve);
        if(!result.isSuccess()) {
            console.log("Invalid status")
        }
        adminMenu();
    });

}

function selectTicket() {

}
