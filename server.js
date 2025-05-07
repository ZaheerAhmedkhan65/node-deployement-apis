const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const postsRoutes = require("./routes/postsRoutes");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost',
    'http://localhost:3000',
    'http://localhost:8000/', // cordova server
    'https://node-deployement-apis.vercel.app'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

app.get("*", (req, res) => {
    res.status(404).json({ error: 'Page not found' });
});

app.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
});
