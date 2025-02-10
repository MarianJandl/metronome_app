document.addEventListener("DOMContentLoaded", function () {
    const bpmSlider = document.getElementById("bpmSlider");
    const bpmInput = document.getElementById("bpmInput");
    document.getElementById("toggleBtn").addEventListener("click", toggleMetronome);
    document.getElementById("applyBtn").addEventListener("click", applySettings);
    //document.getElementById("resetBtn").addEventListener("click", resetToDefault);

    bpmSlider.addEventListener("input", function () {
        bpmInput.value = bpmSlider.value;
        updateBPM(bpmSlider.value);
    });

    bpmInput.addEventListener("input", function () {
        bpmSlider.value = bpmInput.value;
    });

    document.addEventListener("keydown", function(event) {
        if (event.code === "Space") {
            event.preventDefault(); // Prevent scrolling when pressing space
            toggleMetronome();
        }
    });
});

function toggleMetronome() {
    fetch("/toggle", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            document.getElementById("status").innerText = data.status;
        });
}

function updateBPM(bpmValue) {
    fetch("/update_bpm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bpm: bpmValue })
    })
    .then(response => response.json())
    
    
}

function applySettings() {
    const bpmValue = document.getElementById("loopInput").value;
    fetch("/update_loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bpm: bpmValue })
    })
    .then(response => response.json())
    
}

/*function resetToDefault() {
    fetch("/reset", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            document.getElementById("bpmInput").value = data.bpm;
            document.getElementById("status").innerText = "Reset to default BPM: " + data.bpm;
        });
}*/
