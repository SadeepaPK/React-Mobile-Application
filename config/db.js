// import mongoose from 'mongoose';

// // Using CommonJS module
// const connetDB = async () => {
//     try{
//         const conn = await mongoose.connect(process.env.MONGO_URI);
//         console.log(`MongoDB Connected... $(conn.connection.host)`);
//     }catch{
//         console.error(`Error ${error.message}`);
//         process.exit(1);
//     }
// }

// module.exports = connetDB;

// Using ES Modules

import mongoose from 'mongoose';

export async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}


