document.addEventListener("DOMContentLoaded", function () {
    const bpmSlider = document.getElementById("bpmSlider");
    const bpmInput = document.getElementById("bpmInput");
    
    document.getElementById("toggleBtn").addEventListener("click", toggleMetronome);
    document.getElementById("applyLoopBtn").addEventListener("click", applySettings);
    document.getElementById("increaseBpm").addEventListener("click", increase_bpm);
    document.getElementById("decreaseBpm").addEventListener("click", decrease_bpm);
    //document.getElementById("resetBtn").addEventListener("click", resetToDefault);

    bpmSlider.addEventListener("input", function () {
        bpmInput.value = bpmSlider.value;
        updateBPM(bpmSlider.value);
    });

    bpmInput.addEventListener("input", function () {
        bpmSlider.value = bpmInput.value;
    });

    // Listen for "Enter" key press in bpmInput
    bpmInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission if inside a form
            const bpmValue = parseInt(bpmInput.value, 10);
            if (!isNaN(bpmValue) && bpmValue > 0) {
                updateBPM(bpmValue);
            } else {
                console.log("Invalid BPM value");
            }
        }
    });

    document.addEventListener("keydown", function(event) {
        // Prevent space key from triggering the metronome when typing in input or textarea
        if (event.code === "Space" && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) {
            return; // Do nothing if an input field or textarea is active
        }
    
        if (event.code === "Space") {
            event.preventDefault(); // Prevent scrolling when pressing space
            toggleMetronome();
        }
    });
    document.getElementById("volume").addEventListener("input", function() {
        fetch("/update_volume", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ volume: this.value })
        });
    });
});

function toggleMetronome() {
    fetch("/toggle", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            //document.getElementById("status").innerText = data.status;
           if(data.status == "stopped"){
            document.getElementById("toggleBtn").innerHTML = "Start";
           }else{
            document.getElementById("toggleBtn").innerHTML = "Stop";
           }
        });
}
function increase_bpm() {
    fetch("/increase_bpm", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("bpmInput").value = data.bpm;
            document.getElementById("bpmSlider").value = data.bpm;
        }
    });
}

function decrease_bpm() {
    fetch("/decrease_bpm", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("bpmInput").value = data.bpm;
            document.getElementById("bpmSlider").value = data.bpm;
        }
    });
}
function updateBPM(bpmValue) {
    fetch("/update_bpm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bpm: bpmValue })
    })
    .then(response => response.json());
}

function applySettings() {
    const bpmValue = document.getElementById("loopInput").value;
    fetch("/update_loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bpm: bpmValue })
    })
    .then(response => response.json());
}

function checkServerStatus() {
    $.get("/status", function(data) {
        if (data.running) {
            $("#serverStatus").text("Running").css("color", "lightgreen");
            //document.getElementById("toggleBtn").innerHTML = "Stop";
        } else {
            $("#serverStatus").text("Running").css("color", "lightgreen");
            //document.getElementById("toggleBtn").innerHTML = "Start";
        }
    }).fail(function() {
        $("#serverStatus").text("Disconnected").css("color", "red");
        location.reload();

    });
}

// Check server status every 1 second
setInterval(checkServerStatus, 1000);
checkServerStatus();
if (performance.getEntriesByType("navigation")[0].type === "reload") {
    fetch("/refreshed", { method: "POST" }); 
}
/*function resetToDefault() {
    fetch("/reset", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            document.getElementById("bpmInput").value = data.bpm;
            document.getElementById("status").innerText = "Reset to default BPM: " + data.bpm;
        });
}*/
