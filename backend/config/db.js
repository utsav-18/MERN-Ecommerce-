import mongoose from 'mongoose';

const connectDB = async () => {

    try{
        
        await mongoose.connect(procces.env.MONGO_URL);
        console.log("MongoDB Is Connected Successfully");

    }catch(error){
        console.error(`Error: ${error.message}`);
    }

};


export default connectDB;