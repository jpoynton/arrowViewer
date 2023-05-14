import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective@2.1.1/dist/cdn/perspective.js";

window.addEventListener("DOMContentLoaded", function () {
    const worker = perspective.worker();

    // Get `dropArea` element from the DOM.
    var dropArea = document.getElementById("drop-area");

    // Get `input` element from the DOM.
    var input = document.getElementById("fileElem");

    // Add event listeners to `dropArea`.
    dropArea.addEventListener("dragenter", () => {}, false);
    dropArea.addEventListener("dragleave", () => {}, false);
    dropArea.addEventListener("dragover", () => {}, false);
    dropArea.addEventListener("drop", (x) => console.log(x), false);

    // Prevent defaults for drag / drop events.
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight `dropArea` on drag enter and over.
    ["dragenter", "dragover"].forEach(function (eventName) {
        dropArea.addEventListener(eventName, highlight, false);
    });

    // Remove highlight `dropArea` on drag leave and drop.
    ["dragleave", "drop"].forEach(function (eventName) {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    // Add class for highlighting drop area.
    function highlight() {
        dropArea.classList.add("highlight");
    }

    // Remove class for highlighting drop area.
    function unhighlight() {
        dropArea.classList.remove("highlight");
    }

    // Add event listener for drop.
    dropArea.addEventListener("drop", handleDrop, false);

    // Add event listener for file change on `input`.
    input.addEventListener("change", function () {
        handleFiles(this.files);
    });

    // Handle files attached to the drop.
    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;

        handleFiles(files);
    }

    // Iterate over files and call upload on each.
    function handleFiles(files) {
        [...files].forEach(uploadFile);
    }

    // On file load, remove the `dropArea` and replace it with a `<perspective-viewer>`.
    function uploadFile(file) {
        let reader = new FileReader();
        reader.onload = function (fileLoadedEvent) {
            let arrowBuffer = fileLoadedEvent.target.result;

            // Remove the `dropArea` from the DOM.
            const parent = dropArea.parentElement;
            parent.removeChild(dropArea);

            // Create a `<perspective-viewer>` and append it to the DOM.
            const psp = document.createElement("perspective-viewer");
            parent.appendChild(psp);

            // Load the Arrow data into `<perspective-viewer>`.

                psp.load(worker.table(arrowBuffer));

        };

        // Read the contents of the CSV - triggering the onload when finished.
        reader.readAsArrayBuffer(file);
    }
});