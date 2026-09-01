document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("rainbrainTrialForm");
    const button = document.getElementById("rainbrainTrialSubmit");
    const status = document.getElementById("rainbrainTrialStatus");

    if (!form || !button || !status) return;

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        status.style.display = "none";
        status.textContent = "";

        button.disabled = true;
        button.textContent = "Sending...";

        try {

            const formData = new FormData(form);

            const response = await fetch(form.action, {
                method: "POST",
                body: new URLSearchParams(formData),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                }
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Unable to send request"
                );
            }

            status.textContent =
                "Thanks! Your trial request has been received. We'll be in touch shortly.";

            status.style.display = "block";
            status.style.color = "var(--green-d)";

            form.reset();

        } catch (error) {

            console.error("RainBrain trial form error:", error);

            status.textContent =
                "Sorry, we couldn't send your request. Please contact info@therainman.in directly.";

            status.style.display = "block";
            status.style.color = "#c0392b";

        } finally {

            button.disabled = false;
            button.textContent = "Send me the trial link";

        }

    });

});