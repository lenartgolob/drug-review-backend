var express = require('express');
var cors = require('cors');
var bodyParser = require("body-parser");
var mysql = require('mysql');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'drug-review'
});

connection.connect(function(error){
  if(!!error) {
    console.log('Error');
  }
  else {
    console.log('Connected');
  }
})

app.get('/users', (req, res) => {
  connection.query("SELECT * FROM users", (error, rows, fields) =>{
    if(!!error) {
      console.log('Error in query');
    } else {
      console.log('Succesfull query \n');
      console.log(rows);
    }
  });
});


app.get('/api/customers', (req, res) => {
  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Brad', lastName: 'Traversy'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];

  res.json(customers);
});

app.post('/session', (req, res) => {

  var email = req.body.email;
  var password = req.body.password;

  // Checks if email is valid
  var sql = "SELECT * FROM users WHERE email = ?";
  connection.query(sql, email, (error, user, fields) =>{
    if(!!error) {
      console.log('Error in query');
    } else {
      console.log('Succesfull query \n');
      if(user != ''){
        console.log();
        
        bcrypt.compare(password, user[0].password, function(err, result) {
          if (result == true) {
            res.send(user);
            res.redirect('/');
          } 
          else {
          res.send('Incorrect password');
          res.redirect('/');
          }
        });

      }
      else {
        console.log("ne obsstaja")
      }
    }
  });




  console.log(email);
  console.log(password);



  // res.json();
});

app.post('/registration', (req, res) => {

  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    console.log("Registration: " + hash)

    var sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?);";
    connection.query(sql, [name, email, hash], (error, rows, fields) =>{
      if(!!error) {
        console.log('Error in query');
      } else {
        console.log('Succesfull query \n');
        if(rows != ''){
          res.json(rows)
        }
        else {
          console.log("crnc")
        }
        console.log(rows);
      }
    });

  });



  console.log(name);
  console.log(email);
  console.log(password);



  // res.json();
});
const port = 5000;

app.listen(port, () => `Server running on port ${port}`);