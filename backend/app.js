const express = require("express");
const dotenv = require("dotenv");
const route = require('./routes/index');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());
dotenv.config(".env");
app.use(cors({
  origin: 'http://localhost:3001' // React app URL
}));

route.initialize(app);

app.listen(process.env.PORT, "127.0.0.1", () => {
  console.log(`Server is running at port ${process.env.PORT}`);
});
