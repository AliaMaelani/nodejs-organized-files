const app = require("./app"); 
const command = process.argv[2];

switch (command) {
    case "make-folder":
        app.makeFolder();
        break;
    case "make-file":
        app.makeFile();
        break;
    case "ext-sorter":
        app.extSorter();
        break;
    case "read-folder":
        app.readFolder();
        break;
    case "read-file":
        app.readFile();
        break;
    default:
        throw new Error("Invalid command");
}
