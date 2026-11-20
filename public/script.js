const form = document.getElementById("feedbackForm");
const submitButton = document.getElementById("submitButton");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const feedbackData = {
    name: document.getElementById("name").value.trim(),
    department: document.getElementById("department").value.trim(),
    sessionTitle: document.getElementById("sessionTitle").value.trim(),
    feedback: document.getElementById("feedback").value.trim(),
    suggestions: document.getElementById("suggestions").value.trim()
  };

  message.textContent = "";
  message.dataset.state = "";
  submitButton.disabled = true;
  submitButton.querySelector("span:first-child").textContent = "Sending…";

  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      credentials: "same-origin",
      body: JSON.stringify(feedbackData)
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("The server returned an unexpected response.");
    }

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Your feedback could not be saved.");
    }

    message.textContent = result.message || "Thank you! Your feedback has been saved.";
    message.dataset.state = "success";
    document.getElementById("feedback").value = "";
    document.getElementById("suggestions").value = "";
  } catch (error) {
    message.textContent = error.message === "Failed to fetch"
      ? "Could not connect to the feedback service. Please try again."
      : error.message;
    message.dataset.state = "error";
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span:first-child").textContent = "Send feedback";
  }
});
