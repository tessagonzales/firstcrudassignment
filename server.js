var express = require('express');
var fs = require('fs')
var app = express();
var port = process.env.PORT || 8002;
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/users', function(req, res) {
  let newarr = fs.readFileSync('storage.json', 'utf8');
  newarr = JSON.parse(newarr);
  let newUser =
    {"name":`${req.body.name}`, "email": `${req.body.email}`, "state": `${req.body.state}`}

  newarr.push(newUser)

  let jsonStorage = JSON.stringify(newarr)
  fs.writeFile('storage.json', jsonStorage, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });


  res.json(newarr);
});

app.get('/users', function(req, res){
  let theData = fs.readFileSync('storage.json', 'utf8');
  theData = JSON.parse(theData)
  res.json(theData)
});

app.get('/users/:name', function(req, res) {
  let names = fs.readFileSync('storage.json')
  let parsedNames = JSON.parse(names)
  let filteredNames = parsedNames.filter(user => user.name === req.params.name)

  if(filteredNames.length >= 1) {
    res.json(filteredNames[0])
  } else {
    res.sendStatus(400)
}
});

app.put('/users/:name/:newname', function(req, res) {
  let names = fs.readFileSync('storage.json')
  let parsedNames = JSON.parse(names)
  let filteredNames = parsedNames.filter(user => user.name === req.params.name)

  if(filteredNames.length === 1) {

    filteredNames[0].name = req.params.newname
    let jsonStorage = JSON.stringify(parsedNames)
    fs.writeFile('storage.json', jsonStorage, function (err) {
      if (err) throw err;
      console.log('Saved!');
      res.json(filteredNames)
    });
  } else {
    res.sendStatus(400)
}
});

app.delete('/users/:name', function(req, res) {
  let names = fs.readFileSync('storage.json')
  let parsedNames = JSON.parse(names)
  let filteredNames = parsedNames.filter((user)=>{
     return user.name !== req.params.name
   });
   let jsonStorage = JSON.stringify(filteredNames)
   fs.writeFile('storage.json', jsonStorage, function (err) {
     if (err) throw err;
     console.log('Saved!');
   });
   res.json(filteredNames)
});






app.use(function(req, res) {
  res.sendStatus(404);
});

app.listen(port, function() {
  console.log('Listening on port', port);
});
