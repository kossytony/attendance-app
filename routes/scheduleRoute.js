const express = require('express');
const router = express.Router();
const Schedule = require('../models/shiftSchedule.js');




router.post('/addshift', async (req,res)=> {
    console.log(req.body)
   try{ const {emp_id, email, shiftStart, dayWorked, active} = req.body;
    await Schedule({emp_id, email, shiftStart, dayWorked, active}).save()
     res.status(201).send({emp_id, email, shiftStart, dayWorked, active})
}
catch(error){
    console.log(error)
    res.status(401).send({error:error})
  }
}) 



router.post('/getscheduleday', async (req,res)=>{
       try{
             const {dayDate} = req.body
            //  console.log(req.body)
              console.log(dayDate + "values")
             //res.status(200).send({dayDate})
        const empInDB = await Schedule.find({active: 1})
                    
            
         const empShifts = empInDB.map( (item)=>{
           //console.log((dayDate - item.shiftStart.getTime())/86400)
          const diffInDays = (dayDate - item.shiftStart.getTime())/86400
          console.log(diffInDays)
          const shiftDay = diffInDays % 9
                switch (shiftDay){
                    case 0:
                    case 1:
                    case 2:
                     result = {"day" : item.email};
                    break;
                    case 3:
                    case 4:
                    case 5:
                      result = {"night" : item.email};
                    break;
                    case 6:
                    case 7:
                    case 8:
                      result = {"off" : item.email};
                    break;
                 
                }
                  console.log(result)
                return result
      })
         
         const empShiftsJson = empShifts
         
        res.status(201).send(empShiftsJson)
       }
       catch(error){
           res.status(400).send(error)

       }
})

router.post('/getscheduleweek', async function (req, res){
        try {
          const {weekRange} = req.body
            const empInDB = await Schedule.find({active:1})
             let weekResult = []
              Date1 = parseInt(weekRange.dayDateLow)
              Date2 = parseInt(weekRange.dayDateHigh)
              variDate = Date1
          while ( variDate <= Date2 )
          {
            
            //console.log(variDate)
            variDate = variDate + 86400

           const empShifts = empInDB.reduce( function(result, item){
              
          const diffInDays = (variDate - item.shiftStart.getTime()/1000)/86400
          //console.log(item.shiftStart.getTime()/1000)
         // console.log(variDate)
          const shiftDay = diffInDays % 9
          console.log(shiftDay)
                switch (shiftDay){
                    case 0:
                    case 1:
                    case 2:
                      result["day"] =item.email;
                    break;
                    case 3:
                    case 4:
                    case 5:
                      result["night"] =item.email;
                    break;
                    case 6:
                    case 7:
                    case 8:
                      result["off"] =item.email;
                    break;
                 
                }
                
                return {result}

              }, {})
              //console.log(empShifts)
              weekResult.push(empShifts)
              console.log(weekResult)
          }
          
          res.status(200).send(weekResult)


        }
        catch(error){
            res.status(400).send(error)
        }
          


})

module.exports = router;