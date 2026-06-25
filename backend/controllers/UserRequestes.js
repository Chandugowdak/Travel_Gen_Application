const UserRequestModel = require("../model/UserRequest");
const aiService = require("../services/aiService");

const createUserRequest = async (req, res) => {
    try{
        const { userID, UserStartPlace, UserDestination, UserData, NuberOfDays, UserBudget, UserTravelBy, TotelNumberofPeoples } = req.body;
        if(!userID || !UserStartPlace || !UserDestination || !UserData || !NuberOfDays || !UserBudget || !UserTravelBy || !TotelNumberofPeoples){
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Generate detailed trip plan using AI service
        let generatedPlan = "";
        try {
            generatedPlan = await aiService.generatePlan({
                UserStartPlace,
                UserDestination,
                UserData,
                NuberOfDays,
                UserBudget,
                UserTravelBy,
                TotelNumberofPeoples
            });
        } catch (aiErr) {
            console.error("AI Generation failed, creating request without it:", aiErr.message);
        }

        const newSentRequest = new UserRequestModel({
            userID,
            UserStartPlace,
            UserDestination,
            UserData,
            NuberOfDays,
            UserBudget,
            UserTravelBy,
            TotelNumberofPeoples,
            generatedPlan
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


const getUserRequests = async (req, res) => {
    try {
        const { userID } = req.params;
        if (!userID) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const requests = await UserRequestModel.find({ userID }).sort({ createdAt: -1 });
        return res.status(200).json({ data: requests });
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching user requests', error: err.message });
    }
};

const regenerateUserRequest = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "User request ID is required" });
        }
        const trip = await UserRequestModel.findById(id);
        if (!trip) {
            return res.status(404).json({ message: "User request not found" });
        }

        const newPlan = await aiService.generatePlan({
            UserStartPlace: trip.UserStartPlace,
            UserDestination: trip.UserDestination,
            UserData: trip.UserData,
            NuberOfDays: trip.NuberOfDays,
            UserBudget: trip.UserBudget,
            UserTravelBy: trip.UserTravelBy,
            TotelNumberofPeoples: trip.TotelNumberofPeoples
        });

        trip.generatedPlan = newPlan;
        await trip.save();

        return res.status(200).json({ message: "User request plan regenerated successfully", data: trip });
    } catch (err) {
        return res.status(500).json({ message: "Error regenerating plan", error: err.message });
    }
};

module.exports = { createUserRequest, EditUserRequst, DeleteUserRequest, getUserRequests, regenerateUserRequest };