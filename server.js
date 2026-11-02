const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const filePath = path.join(__dirname, "data", "feedback.json");

// Submit feedback
app.post("/api/feedback", (req, res) => {

    const {
        name,
        department,
        sessionTitle,
        feedback,
        suggestions
    } = req.body;

    if (!name || !department || !sessionTitle ||
        !feedback || !suggestions) {
        return res.status(400).json({
            message: "Please fill all fields"
        });
    }

    fs.readFile(filePath, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Unable to read feedback file"
            });
        }

        let feedbackList = JSON.parse(data || "[]");

        const newFeedback = {
            id: Date.now(),
            name,
            department,
            sessionTitle,
            feedback,
            suggestions,
            date: new Date().toLocaleString()
        };

        feedbackList.push(newFeedback);

        fs.writeFile(
            filePath,
            JSON.stringify(feedbackList, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "Error saving feedback"
                    });
                }

                res.json({
                    message: "Feedback submitted successfully!"
                });
            }
        );
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
