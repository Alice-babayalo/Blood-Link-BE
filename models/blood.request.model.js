import mongoose, { Schema } from "mongoose";


const requestSchema = mongoose.Schema({
    emergencyBloodType: {
        type: String,
        default: "AB-",
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref:"Hospital",
        required: true
    },
    quantity:{
        type: Number,
        required: [true,"The quantity of the blood requested is required\nThe quantity of the blood is in Units"],
        default: 1,
    },
    status:{
        type: String,
        required: true,
        enum:[
            "Sent",
            "Pending",
            "Matched",
            "Fulfilled"
        ],
        default:"Sent"
    }
},
{
    timestamps: true
});


const requestModel = mongoose.model('Blood Request', requestSchema);

export default requestModel;