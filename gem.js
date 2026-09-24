async function askQuestion() {

    var question = document.getElementById("question").value.trim();

    if (question == "") {
        alert("Please enter a question");
        return;
    }

    var chatBox = document.getElementById("chatBox");

    chatBox.innerHTML +=
        '<div class="user-message"><b>You:</b><br>' +
        question +
        '</div>';

    document.getElementById("question").value = "";

    chatBox.innerHTML +=
        '<div class="ai-message" id="loading">Thinking...</div>';

    chatBox.scrollTop = chatBox.scrollHeight;

    // ==============================
    // PUT YOUR NEW API KEY HERE
    // ==============================
    var apiKey = "AQ.Ab8RN6LuT7BLCoOQnMl3sjLaYZlvrCuXkfnCGfUPaHq0PebqoQ";

    // Current Gemini model
    var url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";

    try {

        var response = await fetch(url, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            },

            body: JSON.stringify({

                contents: [
                    {
                        parts: [
                            {
                                text:
                                    "You are an AI Learning Assistant. " +
                                    "Answer the student's question clearly and simply. " +
                                    "Give a simple definition and example when useful. " +
                                    "Question: " + question
                            }
                        ]
                    }
                ]

            })
        });

        var data = await response.json();

        console.log("Status:", response.status);
        console.log("Gemini Response:", data);

        var loading = document.getElementById("loading");

        if (loading) {
            loading.remove();
        }

        if (response.ok && data.candidates) {

            var answer =
                data.candidates[0].content.parts[0].text;

            chatBox.innerHTML +=
                '<div class="ai-message"><b>AI:</b><br>' +
                answer.replace(/\n/g, "<br>") +
                '</div>';

        } else {

            var errorMessage = "Gemini could not generate an answer.";

            if (data.error && data.error.message) {
                errorMessage = data.error.message;
            }

            chatBox.innerHTML +=
                '<div class="ai-message"><b>Error:</b><br>' +
                errorMessage +
                '</div>';
        }

    } catch (error) {

        var loading = document.getElementById("loading");

        if (loading) {
            loading.remove();
        }

        chatBox.innerHTML +=
            '<div class="ai-message"><b>Error:</b><br>' +
            error.message +
            '</div>';

        console.log("JavaScript Error:", error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}


// Press Enter to send
function checkEnter(event) {

    if (event.key == "Enter") {
        askQuestion();
    }

}