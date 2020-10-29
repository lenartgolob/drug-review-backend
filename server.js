var express = require('express');
var cors = require('cors');
var bodyParser = require("body-parser");
var mysql = require('mysql');
var validator = require("email-validator");


const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'id15261833_drug0review0username',
    password: 'AusOZeWA7d',
    database: 'id15261833_drug0review0name'
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
      res.text("error")
    } else {
      console.log('Succesfull query \n');
      console.log(rows);
      res.json(rows)
    }
  });
});

app.get('/reviews/recent', (req, res) => {
  connection.query("SELECT * FROM reviews ORDER BY created_at DESC LIMIT 3", (error, rows, fields) =>{
    if(!!error) {
      console.log('Error in query');
    } else {
      console.log('Succesfull query \n');
    }
    var user_id1 = rows[0].user_id;
    var user_id2 = rows[1].user_id;
    var user_id3 = rows[2].user_id;

    var users = {}
    
    var sql1 = "SELECT * FROM users WHERE id = ?";
    connection.query(sql1, user_id1, (error, user1, fields) =>{
      if(!!error) {
        console.log('Error in query');
      } else {
        var name = user1[0].name;
        var lastName = user1[0].lastname;
        var avatarName = name.charAt(0);
        var avatarLastName = lastName.charAt(0);

        var initials = avatarName + avatarLastName;

        var obj1 = {"drug" : rows[0].drug, "rating" : rows[0].rating, "title" : rows[0].title, "review" : rows[0].review,
        "avatar_color" : user1[0].avatar_color, "avatar_font_color" : user1[0].avatar_font_color, "initials" : initials};

        var sql2 = "SELECT * FROM users WHERE id = ?";
        connection.query(sql2, user_id2, (error, user2, fields) =>{
          if(!!error) {
            console.log('Error in query');
          } else {
            var name = user2[0].name;
            var lastName = user2[0].lastname;
            var avatarName = name.charAt(0);
            var avatarLastName = lastName.charAt(0);

            var initials = avatarName + avatarLastName;

            var obj2 = {"drug" : rows[1].drug, "rating" : rows[1].rating, "title" : rows[1].title, "review" : rows[1].review,
            "avatar_color" : user2[0].avatar_color, "avatar_font_color" : user2[0].avatar_font_color, "initials" : initials};

            var sql3 = "SELECT * FROM users WHERE id = ?";
            connection.query(sql3, user_id3, (error, user3, fields) =>{
              if(!!error) {
                console.log('Error in query');
              } else {
                var name = user3[0].name;
                var lastName = user3[0].lastname;
                var avatarName = name.charAt(0);
                var avatarLastName = lastName.charAt(0);
    
                var initials = avatarName + avatarLastName;

                var obj3 = {"drug" : rows[2].drug, "rating" : rows[2].rating, "title" : rows[2].title, "review" : rows[2].review, 
                "avatar_color" : user3[0].avatar_color, "avatar_font_color" : user3[0].avatar_font_color, "initials" : initials};


                array = [obj1, obj2, obj3];
                res.json(array)

              }
            });
          }
        });
      }
    });
    // console.log(userArray)
  });
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
            var avatarLastName = lastName.charAt(0);

            var initials = avatarName + avatarLastName;
            console.log(initials);
            console.log(user[0].id);

            var avatarColor = user[0].avatar_color;
            var avatarFontColor = user[0].avatar_font_color;

            console.log(avatarColor);
            console.log(avatarFontColor);


            var obj = {"id" : user[0].id, "initials" : initials, "avatar_color" : avatarColor, "avatar_font_color" : avatarFontColor, "admin" : user[0].admin};


            res.json(obj);
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
});

app.post('/user/new', (req, res) => {

  var rand = Math.floor(Math.random() * 4); 

  switch(rand) {
    case 0:
      var avatarColor = "#FCEAD5";
      var avatarFontColor = "#AA6410"
      break;
    case 1:
      var avatarColor = "#C4F1FF";
      var avatarFontColor = "#328AB4";
      break;
    case 2:
        var avatarColor = "#DBFFE2";
        var avatarFontColor = "#3B7C48"
        break;
    case 3:
        var avatarColor = "#F7DAFA";
        var avatarFontColor = "#892994"
        break;
    default:
      // code block
  }

  var name = req.body.name;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;

  if(validator.validate(email)) {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      console.log("Registration: " + hash)
  
      var sql = "INSERT INTO users (name, lastname, email, password, avatar_color, avatar_font_color) VALUES (?, ?, ?, ?, ?, ?);";
      connection.query(sql, [name, lastname, email, hash, avatarColor, avatarFontColor], (error, rows, fields) =>{
        if(!!error) {
          console.log('Error in query');
          res.json(false)
        } else {
          console.log('Succesfull query \n');
          res.json(rows)
        }
      });
    });
  } 
  else {
    res.json("wrong_type")
  }
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
});

app.post('/reviews', (req, res) => {

  var drug = req.body.drug;
  console.log(drug);

  var sql = "SELECT r.*, u.name, u.lastname, u.avatar_color, u.avatar_font_color FROM reviews r INNER JOIN users u ON u.id = r.user_id WHERE (r.drug = ?) ORDER BY r.id DESC";
  connection.query(sql, drug, (error, reviews, fields) =>{
    if(!!error) {
      console.log('Error in query');
      console.log(error);
      res.json('Error in query')
    } else {
      console.log('Succesfull query \n');
      // var reviewsArray = Object.keys(reviews).map(i => reviews[i])
      console.log(reviews[0]);

      // var array = [reviews[0], reviews[1], reviews[2]]
      res.json(reviews);
}
  });
});

app.get('/all/reviews', (req, res) => {

  var sql = "SELECT r.*, u.name, u.lastname, u.avatar_color, u.avatar_font_color FROM reviews r INNER JOIN users u ON u.id = r.user_id ORDER BY r.id DESC";
  connection.query(sql, (error, reviews, fields) =>{
    if(!!error) {
      console.log('Error in query');
      console.log(error);
      res.json('Error in query')
    } else {
      console.log('Succesfull query \n');
      console.log(reviews[0]);
      res.json(reviews);
}
  });
});

app.post('/my/reviews', (req, res) => {

  var id = req.body.id;
  console.log(id);

  var sql = "SELECT r.*, u.name, u.lastname FROM reviews r INNER JOIN users u ON u.id = r.user_id WHERE (user_id=?) ORDER BY r.id DESC";
  connection.query(sql, id, (error, reviews, fields) =>{
    if(!!error) {
      console.log('Error in query');
      console.log(error);
      res.json('Error in query')
    } else {
      console.log('Succesfull query \n');
      // var reviewsArray = Object.keys(reviews).map(i => reviews[i])
      console.log(reviews[0]);

      // var array = [reviews[0], reviews[1], reviews[2]]
      res.json(reviews);
}
  });
});

app.post('/user/profile', (req, res) => {

  var id = req.body.id;

  var sql = "SELECT * FROM users WHERE (id=?)";
  connection.query(sql, id, (error, user, fields) =>{
    if(!!error) {
      console.log('Error in query');
      console.log(error);
      res.json('Error in query')
    } else {
      console.log('Succesfull query \n');
      // var reviewsArray = Object.keys(reviews).map(i => reviews[i])
      // var array = [reviews[0], reviews[1], reviews[2]]
      res.json(user);
}
  });
});

app.post('/user/profile/edit', (req, res) => {

  var id = req.body.id;
  var name = req.body.name;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;

  if(validator.validate(email)) {
    var sql = "SELECT * FROM users WHERE id = ?";
    connection.query(sql, id, (error, user, fields) =>{
      if(!!error) {
        console.log('Error in query');
      } else {
        console.log('Succesfull query \n');        
          bcrypt.compare(password, user[0].password, function(err, result) {
            if (result == true) {
  
              var sql = "UPDATE users SET name = ?, lastname = ?, email = ? WHERE id = ?";
              connection.query(sql, [name, lastname, email, id], (error, rows, fields) =>{
                if(!!error) {
                  console.log('Error in query');
                  res.json(false)
                } else {
                  console.log('Succesfull query \n');
                  res.json(true)
                }
              });
  
              console.log("yessir")
              // res.json(obj);
            } 
            else {
            res.json("wrong_pass");
            }
          });
  
      }
    });
  }
  else {
    res.json("wrong_type")
  }

});

app.post('/edit/review', (req, res) => {

  var id = req.body.id;
  console.log(id);

  var sql = "SELECT * FROM reviews WHERE (id = ?)";
  connection.query(sql, id, (error, review, fields) =>{
    if(!!error) {
      console.log('Error in query');
      console.log(error);
      res.json('Error in query')
    } else {
      console.log('Succesfull query \n');
      res.json(review);
}
  });
});

app.post('/review/edit', (req, res) => {

  var id = req.body.id;
  var drug = req.body.drug;
  var rating = req.body.rating;
  var title = req.body.title;
  var review = req.body.review;

  var sql = "UPDATE reviews SET drug = ?, rating = ?, title = ?, review = ? WHERE id = ?";
  connection.query(sql, [drug, rating, title, review, id], (error, rows, fields) =>{
    if(!!error) {
      console.log('Error in query');
      console.log(error);
      res.json(false)
    } else {
      console.log('Succesfull query \n');
      res.json(true);
  }
  });
});

app.post('/review/delete', (req, res) => {

  var id = req.body.id;

  console.log(id)

  var sql = "DELETE FROM reviews WHERE id = ?";
  connection.query(sql, id, (error, rows, fields) =>{
    if(!!error) {
      console.log('Error in query');
      console.log(error);
      res.json(false)
    } else {
      console.log('Succesfull query \n');
      res.json(true);
  }
  });
});

const port = process.env.PORT || 5000;
app.listen(port);
