import mongoose from "mongoose";

const hospitalSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'the hospital name is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    phone: {
        type: String,
        required: [true, 'Phone is required']
    },
    hospitalCode: {
        type: String,
        required: [true, 'Hospital code is required']
    },
    province: {
        type: String
    },
    district: {
        type: String
    },
    sector: {
        type: String
    },
    role: {
        type: String,
        default: 'hospital',
        required: true
    },
    status:{
        type: String,
        default: 'Unaproved',
        enum: ['Unapproved', 'approved']
    }
},
    {
        timestamps: true,
    });

const hospitalModel = mongoose.model('Hospital', hospitalSchema);

export default hospitalModel;