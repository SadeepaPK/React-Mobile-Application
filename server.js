const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const routes = require("./routes/authRoutes");

//connect to databaase
connectDB();

const app = express();

//Body parser middleware
app.use(express.json());

// Register all API routes
app.use("/api/auth", routes);

app.get('/', (req, res) => {
    res.status(500).json({
        message: "Server Error",
        vesion: "1.0.0"
    })
});

app.use((error, req, res, next) => {
    console.error(error.stack)
    res.status(500).json({
        seccess: false,
        message: "Server Error",
        error: error.message
    })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
