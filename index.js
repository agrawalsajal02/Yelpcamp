var express=	require("express"),
	app=		express(),
	mongoose=	require("mongoose"),
		bodyparser=	require("body-parser"),
		comment=require("./models/comment"),
	Campground=require("./models/campground"),
	seed=require("./seed"),
	methodoverride=require("method-override"),
	passport=require("passport"),
	user=require("./models/user"),
	flash=require("connect-flash"),
	localstrategy=require("passport-local");

	var commentroutes=require("./routes/comment");
	var campgroundroutes=require("./routes/campground");
	var authroutes=require("./routes/index");
	
app.use(flash());
app.use(express.static(__dirname+"/public"));


mongoose.connect('mongodb+srv://sajalagrawal14:1999%40sajal@cluster0-r0es2.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

const port = process.env.PORT || 5000

//seed();

app.use(bodyparser.urlencoded({extended : true}));


///=========================
       //passport configuration
app.use(require("express-session")({
secret:"sajal is very good boy",
	saveUninitialized:false,
resave:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
passport.use(new localstrategy(user.authenticate()));

app.use(function(req,res,next){
res.locals.currentuser=req.user;
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
next();
//generally it is route handler
});
app.use(methodoverride("_method"));
app.use(authroutes);
app.use("/campground",campgroundroutes);
app.use("/campground/:id/comment",commentroutes);

 	
app.get("/contact",function(req,res){
res.render("contact.ejs");
});
 
//==========================


app.listen(port,function(){
	console.log("server is started");
						  });

