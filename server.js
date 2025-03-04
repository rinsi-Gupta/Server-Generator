
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());

// Middleware functions
const authMiddleware = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};

const adminMiddleware = (req, res, next) => {
    if (req.headers.authorization !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};

// Applying middleware
app.use(cors({ origin: ["*"] }));

// Routes
app.post("/login", (req, res) => res.json({ message: "Login Route endpoint" }));
app.post("/signup", (req, res) => res.json({ message: "Signup Route endpoint" }));
app.get("/user", authMiddleware, (req, res) => res.json({ message: "User Route endpoint" }));

app.listen(3000, () => console.log("Server running on port 3000"));
