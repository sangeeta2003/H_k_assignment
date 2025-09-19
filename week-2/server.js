const express = require('express');

const app = express();

var Users = [{
    name:'sangeeta',
    kidneys:[{
        healthy:false
    },{
        healthy:true
    }]
   
}];

app.use(express.json());

app.get('/',(req,res)=>{
    let numbers = Users[0].kidneys.length;
    console.log(numbers);
    
    let healthyKidney = Users[0].kidneys.filter(s => s.healthy).length;
    

     const unHealthyKidenyes = numbers - healthyKidney;
 res.json({numbers , healthyKidney , unHealthyKidenyes});
})



app.post('/',(req,res)=>{
    const isHealthy = req.body.isHealthy;
    Users[0].kidneys.push({
        healthy:isHealthy
    })
    res.json({
        msg:'Done'
        });
});

// PUT - Replace (make all kidneys healthy)
app.put('/', (req, res) => {
  Users[0].kidneys = Users[0].kidneys.filter(kidney => {
    if (!kidney.healthy) {
      // convert unhealthy kidney to healthy
      kidney.healthy = true;
    }
    return true; // keep all kidneys
  });

  res.json({ msg: 'All kidneys are now healthy!' });
});


function isTheirAtleastOneUnhealthyKidney() {
  return Users[0].kidneys.some(kidney => !kidney.healthy);
}

// DELETE - Remove all unhealthy kidneys
app.delete('/', (req, res) => {
  if (isTheirAtleastOneUnhealthyKidney()) {
    Users[0].kidneys = Users[0].kidneys.filter(kidney => kidney.healthy);
    res.json({ msg: 'Unhealthy kidneys removed!' });
  } else {
    res.status(400).json({ msg: 'No unhealthy kidneys to remove!' });
  }
});




app.listen(3000, () => {
console.log("Server Running on 3000 !");
});
