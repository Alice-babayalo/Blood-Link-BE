import asyncWrapper from "../middleware/async.js";

  export const getAge = asyncWrapper(async (req, res, next) => {

    
    const integerStr = req.body.nationalID.toString();

  const yearStr = integerStr.slice(1, 5);

  // Convert the extracted string to an integer
  const yearOfBirth = parseInt(yearStr, 10);
  
    const currentYear = new Date().getFullYear();
  
    const ageDifference = currentYear - yearOfBirth;
    if (ageDifference<0){
      return res.status(400).json({message:"Invalid age based on the national Id information"})
    }
    else if (ageDifference>70){
      return res.status(400).json({message:"Your age is too old for a blood transfusion"});
    }
    else{
      req.body.age = ageDifference;
    }
    next();
  })
  