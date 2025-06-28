const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
app.use(cors())
app.use(express.json());
connectDB();
app.use(express.json());
app.use('/', require('./router/userRouter'));

const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
