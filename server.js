var express=require('express');
var path=require('path');
var bodyParser=require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var cookieParser=require('cookie-parser');
var app=express();
app.use(session({ secret: 'this is secret',
    // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
 }));

 app.use(cookieParser());
app.use(passport.initialize());
   app.use(passport.session());
   passport.use(new LocalStrategy(function(username,password,done){
console.log(username);

if(username==password){
  return done(null,{username:username});
}
else{
   return done(null,false);

}
     /*appuser.find({username:username},function(err,user){
       if(user[0]==undefined){
         return done(null,false);
}
       else{
       if(user[0].password==password){

           return done(null,{username:username});
         }
         else{
           return done(null,false);
         }
   }
 });*/
}));
   passport.serializeUser(function(user, done) {
       done(null, user);

});
passport.deserializeUser(function(user, done) {
done(null, user);
       });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.set('views',__dirname + '/views');
app.set('view engine','ejs');
app.get("/",function(req,res){
  res.render("index",{user:req.user});
});
app.post("/access",passport.authenticate('local', { failureRedirect: '/login' }),function(req,res){
//console.log(req.body);
res.json({msg:"success"});

  res.end();
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/signup",function(req,res){
  res.render("signup");
});
app.get('/logout',function(req,res){
  req.logout(); //passports predefined logout function
  res.json({msg:"success"});
  res.end();
});
app.use(express.static(path.join(__dirname,'client')));
app.listen(3000,function(req,res){
  console.log('listening to the port 3000');
});
