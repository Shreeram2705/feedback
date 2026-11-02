const form = document.getElementById("feedbackForm");

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const feedbackData = {

        name: document.getElementById("name").value,

        department: document.getElementById("department").value,

        sessionTitle: document.getElementById("sessionTitle").value,

        feedback: document.getElementById("feedback").value,

        suggestions: document.getElementById("suggestions").value

    };

    try {

        const response = await fetch("/api/feedback", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(feedbackData)

        });

        const result = await response.json();

        document.getElementById("message").innerText =
            result.message;

        if (response.ok) {
            document.getElementById("feedback").value = "";
            document.getElementById("suggestions").value = "";
        }

    } catch (error) {

        document.getElementById("message").innerText =
            "Server connection failed!";

    }

});
