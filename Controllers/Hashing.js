const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');
secret="asdasdffghjkl"

const hashing= async(value)=>{
    try{
        const salt= await bcrypt.genSalt(10);
        const hash= await bcrypt.hash(value,salt);
        return hash
    }
    catch(error){
        return error;
    }
}
module.exports={hashing}