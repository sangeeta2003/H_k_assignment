const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();


const FILES_DIR = path.join(__dirname, 'files');

// get files

app.get('/files',(req,res)=>{
    fs.readdir(FILES_DIR,(err,files)=>{
        if(err){
            return res.status(500).send('Error reading files directory');
        }
        res.json(files);
    })
});


// second part
app.get('/file/:filename', (req, res) => {
  const filepath = path.join(FILES_DIR, req.params.filename);

  fs.readFile(filepath, 'utf-8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        return res.status(404).send('File not found');
      }
      // Other errors
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
});





app.listen(3000, () => {
console.log("Server Running on 3000 !");
});
