const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const postsRoutes = require("./routes/postsRoutes");
const userRoutes = require("./routes/userRoutes");
const corsMiddleware = require('./middlware/corsMiddleware');

const cookieParser = require('cookie-parser');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(corsMiddleware);

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
