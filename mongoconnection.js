const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

mongoose.connect("mongodb://localhost:27017/natours" , {
    useNewUrlParser : true,
    useFindAndModify : false,
    useCreateIndex : true,
    useUnifiedTopology : true,
}).then(()=>{
    console.log("Connection Succesfully..");
}).catch((err)=>{
    console.log(err);
});

const userSchema = new mongoose.Schema({
    Name : {
        type : String,
        required : true,
    },
    Email : {
        type : String,
        unique : true,
        required : true,
    },
    Number : {
        type : Number,
        unique : true,
        required : true
    },
    Message : {
        type : String,
        required : true,
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }] 
});

userSchema.methods.authenticuser = async function(){
    try {
      const token = jwt.sign({_id : this._id.toString()} , "helloguysmynameisyashdubeystudent");
      this.tokens = this.tokens.concat({token : token});
      await this.save();
      return token;  
    } catch (error) {
        console.log(`${error.message}`);
    };
}; 

const users = mongoose.model("user" , userSchema);

module.exports = users;