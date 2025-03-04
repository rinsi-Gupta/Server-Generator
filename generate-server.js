const fs = require("fs");

function generateServer(configFile, outputFile) {
    const config = JSON.parse(fs.readFileSync(configFile, "utf8"));

    let serverCode = `
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
`;

    // Process nodes
    config.nodes.forEach(node => {
        if (node.properties.type === "middleware") {
            if (node.properties.allowed_origins) {
                serverCode += `app.use(cors({ origin: ${JSON.stringify(node.properties.allowed_origins)} }));\n`;
            }
        }
    });

    // Generate routes
    serverCode += `\n// Routes\n`;
    config.nodes.forEach(node => {
        if (node.properties.endpoint) {
            const { endpoint, method, auth_required } = node.properties;
            let routeHandler = `app.${method.toLowerCase()}("${endpoint}", `;
            if (auth_required) {
                routeHandler += "authMiddleware, ";
            }
            routeHandler += `(req, res) => res.json({ message: "${node.name} endpoint" }));\n`;
            serverCode += routeHandler;
        }
    });

    // Start the server
    serverCode += `\napp.listen(3000, () => console.log("Server running on port 3000"));\n`;

    // Write to server.js
    fs.writeFileSync(outputFile, serverCode);
    console.log(`✅ Server file generated successfully: ${outputFile}`);
}

// Generate server.js from config.json
generateServer("config.json", "server.js");
