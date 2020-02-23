const express = require('express');
const mysql = require('mysql');

const app = express();

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

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);