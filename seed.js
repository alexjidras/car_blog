let mongoose=require("mongoose")

mongoose.Promise = global.Promise;
var con1 = mongoose.createConnection("mongodb://localhost/mydb");
var con2 = mongoose.createConnection("mongodb://heroku_cps05mql:gtqseiltorohb8optrgtc1p8vf@ds121331.mlab.com:21331/heroku_cps05mql");

let carSchema = new mongoose.Schema({
	    name: String,
	    image: String,
	    description: String,
	    comments: [{
	        type: mongoose.Schema.Types.ObjectId,
	        ref: "Comment"
	               }]
	}),
commentSchema = new mongoose.Schema({
        text: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        }
    }),
UserSchema = new mongoose.Schema({
    username: String,
    password: String
});


let Car1 = con1.model("Car", carSchema);
let Com1 = con1.model("Comment", commentSchema);
let User1 = con1.model("User", UserSchema);
let Car2 = con2.model("Car", carSchema);
let Com2 = con2.model("Comment", commentSchema);
let User2 = con2.model("User", UserSchema);

Promise.all([Car1.find({}).then((cars) => Car2.insertMany(cars)),
	Com1.find({}).then((cars) => Com2.insertMany(cars)),
	User1.find({}).then((cars) => User2.insertMany(cars))])
.catch((e)=> console.log(e));


