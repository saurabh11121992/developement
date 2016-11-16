var express = require('express');
var app = express();
 var fs = require("fs");
 var mysql      = require('mysql');
 var bodyParser = require('body-parser');
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'task_manager'
 });
 var app = express();
 
 connection.connect(function(err){
 if(!err) {
     console.log("Database is connected ... \n\n");  
 } else {
	 console.log(err);
     console.log("Error connecting database ... \n\n");  
 }
 });
 
 // Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/style',  express.static(__dirname + '/style'));
app.use('/script',  express.static(__dirname + '/script'));

app.get('/',function(req,res){
	res.sendFile('home.html',{'root': __dirname + '/templates'});
})

app.get('/showSignInPage',function(req,res){
	res.sendFile('signin.html',{'root': __dirname + '/templates'});
})

app.get('/showSignUpPage',function(req,res){
  res.sendFile('signup.html',{'root':__dirname + '/templates'})
})


app.post('/login',urlencodedParser, function (req, res){
	response = {
      email:req.body.email,
	  password:req.body.password
   }; 
   
  var query =  connection.query('SELECT * from users WHERE email ='+connection.escape(req.body.email)+' AND password = '+connection.escape(req.body.password) , function(err, rows, fields) {
 console.log(query.sql);
   if (!err){
	    console.log('The solution is: ', rows);
		res.sendFile('home.html',{'root': __dirname + '/templates'});
   }else{
	  console.log('Error while performing Query.');  
	  
	  	res.sendFile('signin.html',{'root': __dirname + '/templates'});
   }
      });
   console.log(response);
	
});

app.post('/register',urlencodedParser, function (req, res) {
   // Prepare output in JSON 
    response = {
      name:req.body.name,
      email:req.body.email,
	  password:req.body.password
   }; 
var query  = connection.query('INSERT INTO users SET ?', response, function(err) {
 console.log(query.sql);
   if (!err){
	   console.log('user details inserted successfully.');
	   res.sendFile('home.html',{'root': __dirname + '/templates'});
		// res.sendFile(path.join(_'home.html'));
   }else{
	   console.log(query.sql);
	  console.log('Error while performing Query.');  
   }   
   });
  // connection.end(); 
})

app.listen(3000);

