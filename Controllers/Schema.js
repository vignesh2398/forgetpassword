const mongoose = require('mongoose');
const { dbUrl } = require('./DbConfig');

const dbConnect=async()=>{
    try {
        await mongoose.connect(
            dbUrl,
            {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              autoIndex: true,
            }
          );
          console.log("DB Connected");
    } catch (error) {
        console.log(e.message, "error in connecting db");
    }
}

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
      },
      email: {
        type: String,
        required: true,
        max: 255,
      },
      token:{
        type:String,
        default:' '
      }
});

const Users= mongoose.model("User",userSchema);
module.exports={Users}
