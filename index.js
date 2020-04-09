const express = require('express');
const userRoute = require('./routes/userRoute')
const scheduleRoute = require('./routes/scheduleRoute')
const app = express();
require('./db/db');
const port = process.env.PORT;
app.use(express.json());



app.use(userRoute);
app.use(scheduleRoute);

app.listen(port, ()=> console.log(`App is running on ${port}`));