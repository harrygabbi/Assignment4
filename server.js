const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const path = require("path");
const officeData = require("./modules/officeData"); // Update the path if needed
const app = express();

// Add this line before defining any routes
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "views" directory
app.use(express.static(path.join(__dirname, "views")));

// Add this line after the static middleware for "views"
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Serve Bootstrap files
app.use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist")));

// Initialize the officeData module before starting the server
officeData.initialize()
  .then(() => {
    // GET /PartTimer
    app.get("/PartTimer", (req, res) => {
      officeData.getPartTimers()
        .then(employees => {
          res.json(employees);
        })
        .catch(() => {
          res.json({ message: "no results" });
        });
    });

    // GET /
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "home.html"));
    });

    // GET /employee/num
    app.get("/employee/:num", (req, res) => {
      const num = parseInt(req.params.num);
      officeData.getEmployeeByNum(num)
        .then(employee => {
          res.json(employee);
        })
        .catch(() => {
          res.json({ message: "no results" });
        });
    });

    // GET /audio
    app.get("/audio", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "audio.html"));
    });

    // GET /sotreFront
    app.get("/storeFront", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "storeFront.html"));
    });

    // GET /video
    app.get("/video", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "video.html"));
    });

    // GET /table
    app.get("/table", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "table.html"));
    });

    // GET /list
    app.get("/list", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "list.html"));
    });

    // 404 Not Found
    app.use((req, res) => {
      res.status(404).send("Page Not Found");
    });

    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.error("Error initializing officeData:", err);
  });
