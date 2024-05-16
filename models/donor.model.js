import mongoose from "mongoose"

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const donorSchema =  mongoose.Schema({
    fullName: { 
        type: String, 
        required: true 
    },
    mobileNumber: { 
        type: String, 
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'] // Example validation
    },
    nationalID:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] // Example validation
    },
    province: { 
        type: String, 
        required: true
    },
    district: {
        type: String,
        required: true
    },
    sector: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: bloodGroups
    },
    age:{
        type: Number,
        required: true,
        min: [18, 'Minimum age should be 18 years'] // Example validation
    },
    gender:{
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    donationAvailability:{ 
        type: Date, 
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected'],
        default: 'pending'
    },
    rejectionReason: {
        type: String
    }
}, {
    timestamps: true
});

const donorModel = mongoose.model('donor', donorSchema);

export default donorModel;