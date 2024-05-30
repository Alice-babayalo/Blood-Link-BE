import mongoose from "mongoose";

import config from "../configs/index.js";

const connectDb = () => {
  mongoose
    .connect(config.CONNECTION_STRING)
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {
      console.log(err);
    });
};
export default connectDb;
