const mongoose = require("mongoose");

const userRequestSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
    require: true,
  },
  UserStartPlace: {
    type: String,
    required: true,
  },
  UserDestination: {
    type: String,
    required: true,
  },
  UserData: {
    type: Date,
    required: true,
  },
  NuberOfDays: {
    type: Number,
    required: true,
  },
  UserBudget:{
    type:Number,
    required:true
  },
  UserTravelBy:{
    type:String,
    required:true
  },
  TotelNumberofPeoples:{
    type:Number,
    required:true
  }
});

const UserrequestModel = mongoose.model("UserRequest", userRequestSchema);

module.exports = UserrequestModel;



