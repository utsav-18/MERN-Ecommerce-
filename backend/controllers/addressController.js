import Address from "../models/Address.js";

//Save Address
export const saveAddress = async (req,res) => {
    try{
        const address = await Address.create(req.body);
        res.json({message : 'Address saved successfully', address});

    } catch(err){
        res.status(500).json({message :"Error Saving address",err});
    }
}

//Get Address by user ID
export const getAddressess = async (req,res) => {
    try{

        const addresses = await Address.find({
            userId : req.params.userId
        })
        res.json(addresses);

    }catch(err){
        res.status(500).json({message: "Error fetching addresses",err});
    }
};