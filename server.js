import app from "./services/app.js";

const startServer = async (a) => {
    try {
        await a;
    } catch (error) {
        console.log(error);
    }
}

startServer(app);