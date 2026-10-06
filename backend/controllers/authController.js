import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signupUser = async (req, res) => {
    try{
        
        const {name, email, password} = req.body;

        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({message : "User already exists"});
        }

        //Hash Password
        const hashPassword = await bcrypt.hash(password, 10);

        //Create USer 
        await User.create({
            name,
            email,
            password : hashPassword
        });

        res.json({message : "User Registered Successfully"});

    } catch(error){
        res.status(500).json({message : "Server Error", error });
    }
};