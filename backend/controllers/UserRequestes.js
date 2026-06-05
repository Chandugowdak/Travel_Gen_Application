const UserrequestModel = require("../model/UserRequest");

const createUserRequest = async (req, res) => {
    try{
        const { userID, UserStartPlace, UserDestination, UserData, NuberOfDays, UserBudget, UserTravelBy, TotelNumberofPeoples } = req.body;
        if(!userID || !UserStartPlace || !UserDestination || !UserData || !NuberOfDays || !UserBudget || !UserTravelBy || !TotelNumberofPeoples){
            return res.status(400).json({ message: "All fields are required" });
        }
        const newSentRequest = new UserrequestModel({
            userID,
            UserStartPlace,
            UserDestination,
            UserData,
            NuberOfDays,
            UserBudget,
            UserTravelBy,
            TotelNumberofPeoples
        });
       const VerifySave =  await newSentRequest.save();
       if(!VerifySave){
        return res.status(500).json({ message: "Failed to save user request" });
       }
        return res.status(201).json({ message: "User request created successfully", data: newSentRequest });
    }
    catch(err){
        return res.status(500).json({ message: "Error creating user request", error: err.message });
    }
};


const EditUserRequst = async(req,res)=>{
    try{
        const { id} = req.params;
        if(!id){
            return res.status(400).json({ message: "User request ID is required" });
        }
        const UpdateData = req.body;
        UpdateData.UserData = new Date(UpdateData.UserData);
        const updatedRequest = await UserRequestModel.findByIdAndUpdate(id, UpdateData, { new: true });
        if(!updatedRequest){
            return res.status(404).json({ message: "User request not found" });
        }else{
            return res.status(200).json({ message: "User request updated successfully", data: updatedRequest });
        }   
    }
    catch(err){
        return res.status(500).json({ message: "Error editing user request", error: err.message });
    }
}


const DeleteUserRequest = async (req,res)=>{
    try{
        const  { id} = req.params;
        if(!id){
            return res.status(400).json({ message: "User request ID is required" });
        }
        const deleteRequest = await UserRequestModel.findByIdAndDelete(id);
        if(!deleteRequest){
            return res.status(404).json({ message: "User request not found" });
        }else{
            return res.status(200).json({ message: "User request deleted successfully" });
        }
    }
    catch(err){
        return res.status(500).json({ message: "Error deleting user request", error: err.message });
    }
}


module.exports = { createUserRequest, EditUserRequst, DeleteUserRequest };