const mongoose = require('mongoose');
 
const {Schema} = mongoose;

const schedule = Schema ({ 
            emp_id :
            {
                type : String,
            },
            email : {
                type : String,
                    },
            shiftStart :{
                type : Date
            },
            dayWorked : Number ,
            active : Number,

        

})
const Schedule = mongoose.model('Schedule', schedule)

module.exports = Schedule