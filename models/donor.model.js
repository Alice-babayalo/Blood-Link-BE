import mongoose, { Schema } from "mongoose"

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
        min: [18, 'Minimum age should be 18 years'] 
    },

    gender:{
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    weight:{
        type: Number,
        required:true,
        min: [50, 'Weight must be at least 50 kg']
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

donorSchema.pre('save', function (next) {
    const donor = this;
    const nationalID = donor.nationalID;

    if (nationalID && nationalID.length === 16) {
        const sixthDigit = nationalID.charAt(5);

        if (sixthDigit === '8') {
            donor.gender = 'Male';
        } else if (sixthDigit === '7') {
            donor.gender = 'Female';
        }
    }

    next();
});

const donorModel = mongoose.model('donor', donorSchema);

export default donorModel;
