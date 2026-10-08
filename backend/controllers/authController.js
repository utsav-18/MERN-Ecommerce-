import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//signup
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

//login
export const loginUser = async (req,res) =>{

    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message : "User not found"});
        }

        //compare password
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        //Generate jwt token
        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRECT,
            {expiresIn:"7d"}
        );
        res.json({message: "Login Successful",
            token,
            user: {
                id : user._id,
                name : user.name,
                email : user.email
            }

        });


    }catch(err){
        res.status(500).json({message : "Server Error",err});
    }

};