const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "brj1xh515mz5mcb7eeqf-mysql.services.clever-cloud.com",
  user: "uvtjqdtrnbzhubov",
  password: "mnM0bVsyqR4MiIRChXW3",
  database: "brj1xh515mz5mcb7eeqf"
});

module.exports = connection; 
