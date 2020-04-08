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

app.post('/user/session', (req, res) => {

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
        
        bcrypt.compare(password, user[0].password, function(err, result) {
          if (result == true) {
            var name = user[0].name;
            var lastName = user[0].lastname;

            var avatarName = name.charAt(0);
            console.log(avatarName);

            var avatarLastName = lastname.charAt(0);
            console.log(avatarLastName);


            res.json(user[0].id);
          } 
          else {
          res.json("wrong_pass");
          console.log("Incorrect password");
          }
        });

      }
      else {
        res.json("wrong_user");
        console.log("wrong_user")
      }
    }
  });




  console.log(email);
  console.log(password);



  // res.json();
});

app.post('/user/new', (req, res) => {

  var name = req.body.name;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    console.log("Registration: " + hash)

    var sql = "INSERT INTO users (name, lastname, email, password) VALUES (?, ?, ?, ?);";
    connection.query(sql, [name, lastname, email, hash], (error, rows, fields) =>{
      if(!!error) {
        console.log('Error in query');
        res.json(false)
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



  // console.log(name);
  // console.log(lastname);
  // console.log(email);
  // console.log(password);



  // res.json();
});

app.post('/review/new', (req, res) => {

  var user_id = req.body.user_id;
  var drug = req.body.drug;
  var rating = req.body.rating;
  var title = req.body.title;
  var review = req.body.review;

  var sql = "INSERT INTO reviews (user_id, drug, rating, title, review) VALUES (?, ?, ?, ?, ?);";
  connection.query(sql, [user_id, drug, rating, title, review], (error, rows, fields) =>{
    if(!!error) {
      console.log('Error in query');
      console.log(error);
      res.json('Error in query')
    } else {
      console.log('Succesfull query \n');
      var msg = "success"
      res.json(msg);
}
  });






  console.log(drug);
  console.log(rating);
  console.log(title);
  console.log(review);




});
const port = 5000;

app.listen(port, () => `Server running on port ${port}`);