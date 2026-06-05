const express = require("express");
const cors = require("cors");
const DB = require("./config/DB");
const dotenv = require("dotenv");


//ROUTER SECTION
const Userroute = require('./routes/Userroute');
const requestroute = require('./routes/UserRequestRoute');



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

//COMMON ROUTES
app.use('/api' , Userroute);
app.use('/api', requestroute);

DB()
  .then(() => {
    app.listen(PORT,()=>{
        console.log(`Server is Running in the Port ${PORT}`);
    })
  })
  .catch((err) => {
    console.log(`Error While Starting the Server ${err}`);
  });
