// server.js
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
require("./config/db");

const PORT = process.env.PORT || 5030;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
