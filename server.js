const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

let clientPromise;

async function getFeedbackCollection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect().catch((error) => {
      clientPromise = undefined;
      throw error;
    });
  }

  const client = await clientPromise;
  return client.db("feedback").collection("submissions");
}

app.post("/api/feedback", async (req, res) => {
  const { name, department, sessionTitle, feedback, suggestions } = req.body;

  if (![name, department, sessionTitle, feedback, suggestions].every(
    (value) => typeof value === "string" && value.trim()
  )) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const collection = await getFeedbackCollection();
    await collection.insertOne({
      name: name.trim(),
      department: department.trim(),
      sessionTitle: sessionTitle.trim(),
      feedback: feedback.trim(),
      suggestions: suggestions.trim(),
      date: new Date()
    });

    return res.json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Unable to save feedback:", error.message);
    return res.status(500).json({
      message: "Unable to save feedback. Please try again later."
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
