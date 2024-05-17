import mongoose, { Schema } from "mongoose";


const requestSchema = mongoose.Schema({
    emergencyBloodType: {
        type: String,
        default: "O",
        enum: ["O","A","B", "AB"]
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref:"Hospital"
    }
},
{
    timestamps: true
});


const requestModel = mongoose.model('Blood Request', requestSchema);

export default requestModel;