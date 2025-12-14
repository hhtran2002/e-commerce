require("dotenv").config();
const sql = require("mssql");

const email = process.argv[2] || "test@example.com";

const config = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "1433", 10),
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
  },
};

(async () => {
  try {
    await sql.connect(config);
    const result =
      await sql.query`SELECT resetToken, resetTokenExpiry FROM users WHERE email = ${email}`;
    console.log(result.recordset);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
