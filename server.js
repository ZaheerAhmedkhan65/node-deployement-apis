const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const cors = require('cors');
const { format } = require('date-fns');
const authRoutes = require("./routes/authRoutes")
const postsRoutes = require("./routes/postsRoutes")
const userRoutes = require("./routes/userRoutes")
const multer = require('multer');
const cookieParser = require('cookie-parser');
const authenticate = require('./middlware/authenticate');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(cors());
app.use(cors({
    origin: ['http://localhost', 'http://localhost:3000', 'http://your-cordova-app-url'], // Adjust with your Cordova app URL
    credentials: true
}));


app.use(express.static(path.join(__dirname, 'public')));

app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);
app.use("/users",userRoutes);
app.get("/", (req, res) => {
    res.json({ message: 'Welcome to the API' });
});
app.get("*", (req, res) => {
    res.status(404).json({ error: 'Page not found' });
});

app.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
});