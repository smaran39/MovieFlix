var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://smaran39:mLab39@ds163232.mlab.com:63232/movieflix');

var Schema = mongoose.Schema;
var Users = new Schema({
  name: {
    type: String,
    unique: true
  },
  pass: {
    type: String
  }
});
var movies=new Schema({
  title: String,
   year :Number,
   rated: String,
   released: Date,
   runtime: String,
   genre : String,
   director: String,
   writer:String,
   actors: String,
   plot : String,
   language: String,
   country: String,
   awards: String,
   poster: String,
   metaScore: Number,
   imdbRating: Number,
   imdbVotes: Number,
   imdbId: String,
   type: String
});
var movieModel = mongoose.model('moviecollection', movies);





var User = mongoose.model('userdetails', Users);
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var cookieParser = require('cookie-parser');
var app = express();
app.use(session({
  secret: 'this is secret',
  // connect-mongo session store
  proxy: true,
  resave: true,
  saveUninitialized: true
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(function(username, password, done) {
  console.log(username);
  User.findOne({name: username,pass:password }, function(err, user) {
    console.log(user);
     if (err) { return done(err); }
     if (!user || !user.pass) {
       return done(null, false, { message: 'Incorrect username.' });
     }
     return done(null, {username:user.name});
   }); //end of findOne


})); //passport.use() ends here

passport.serializeUser(function(user, done) {
  done(null, user);

});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//home page
app.get("/", function(req, res) {


movieModel.find({},function(err,data){
  if(err) console.log(err);
  //console.log(data);

});
  res.render("index", {
    user: req.user
  });

}); // end of home page

//for login functionality
app.post("/access", passport.authenticate('local', {
  failureRedirect: '/login'
}), function(req, res) {
  //console.log(req.body);
  res.json({
    msg: "success"
  });

  res.end();
});

app.get('/getmovies',function(req,res) {

movieModel.find({},function (err,data) {
  if(err){
    console.log(err);
  }else {
    //console.log(data);
    res.send(data);
  }
  res.end();
});


});


//for signup functionality
app.post('/signedup', function(req, res) {
  console.log(req.body);


    var user = User({
      name:req.body.username,
      pass:req.body.password,

    });
    user.save(function(err){
      //console.log(err);
      if(err){
      res.json({msg:"exists"});
      res.end();
    }
      else {
        res.json({msg:"Account created successfully!"});
        res.end();
      }
    });

}); // end of  '/signedup' code


app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/signup", function(req, res) {
  res.render("signup");
});
app.get('/logout', function(req, res) {
  req.logout(); //passports predefined logout function
  res.json({
    msg: "success"
  });
  res.end();
});
app.use(express.static(path.join(__dirname, '/client')));
app.listen(3000, function(req, res) {
  console.log('listening to the port 3000');
});
