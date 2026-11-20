const { MongoClient } = require("mongodb");

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

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, department, sessionTitle, feedback, suggestions } = req.body || {};
  const values = [name, department, sessionTitle, feedback, suggestions];

  if (!values.every((value) => typeof value === "string" && value.trim())) {
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

    return res.status(200).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Unable to save feedback:", error.message);
    return res.status(500).json({
      message: "Unable to save feedback. Please try again later."
    });
  }
};
