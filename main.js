var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var request = require('request'); 
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended: true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 43005);
app.set('mysql', mysql);
app.use('/classes', require('./classes.js'));
app.use('/music', require('./music.js'));
app.use('/products', require('./products.js'));
app.use('/students', require('./students.js'));
app.use('/addmusictoclass', require('./addmusictoclass.js'));
app.use('/orders', require('./orders.js', './products.js'));
app.use('/', function (req, res) {
	var context = { title: 'home', active: { home: true } };
	res.render('home', context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
 
