import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("Missing MONGODB_URI in environment variables");
    }

    mongoose.connection.on("connected", () => {
        console.log("Database connected");
    });

    const baseUri = process.env.MONGODB_URI.trim();
    const dbName = process.env.MONGODB_DB_NAME?.trim();

    const connectionUri =
        dbName && !baseUri.endsWith(`/${dbName}`)
            ? `${baseUri.replace(/\/+$/, "")}/${dbName}`
            : baseUri;

    await mongoose.connect(connectionUri);
};

export default connectDB;
