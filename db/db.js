const mongoose = require('mongoose');



mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
     useUnifiedTopology: true
    })
    .then(()=>console.log('db successfully connected'))
    .catch(console.error());
    
    