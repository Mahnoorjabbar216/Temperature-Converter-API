let mode = "" ;
//converter card
function showConverter(type) {
    mode = type;
    document.getElementById("conversion-container").style.display = "none";
    document.getElementById("converterCard").style.display = "block";
    document.getElementById("resultDisplay").innerText = "";

}

async function convertTemp() {
    const input = document.getElementById("tempInput").value;
    if (!input) return showModal("Please enter a temperature");
    const spinner = document.getElementById("loadingSpinner");
    spinner.style.display = "flex";

    //soap request
    const action = mode === "FtoC" ? "FahrenheitToCelsius" : "CelsiusToFahrenheit";
    const tag = mode === "FtoC" ? "Fahrenheit" : "Celsius";
    const xml = `
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
            <soap12:Body>
                <${action} xmlns="https://www.w3schools.com/xml/">
                    <${tag}>${input}</${tag}>
                </${action}>
            </soap12:Body>
        </soap12:Envelope>`;
    
    try{
        const res = await fetch("https://proxy.cors.sh/https://www.w3schools.com/xml/tempconvert.asmx", {
            method: "POST",
            headers: { 
                'x-cors-api-key': 'temp_e8a8b25b37067792c7cb2b809aabe2f3',
                "Content-Type": "application/soap+xml; charset=utf-8" } , 
            body: xml
        });

        const text = await res.text();
        const doc = new DOMParser().parseFromString(text , "text/xml");
        const resultTag = action + "Response";
        const resultNode = doc.getElementsByTagName(resultTag)[0];
        const result = resultNode?.getElementsByTagName(action + "Result")[0]?.textContent || "Error";

        document.getElementById("resultDisplay").innerText = `Result: ${result}`;

    } catch(e) {
        console.error(e);
        document.getElementById("resultDisplay").innerHTML = "failed to convert. try again";

    } finally {
        spinner.style.display = "none";
    }
}

function showModal(message) {
    document.getElementById("modalMessage").innerText = message;
    document.getElementById("customModal").style.display = "block";
}

// Close modal when clicking "X"
document.getElementById("closeModal").onclick = function() {
    document.getElementById("customModal").style.display = "none";
};

// Close modal when clicking outside the box
window.onclick = function(event) {
    if (event.target === document.getElementById("customModal")) {
        document.getElementById("customModal").style.display = "none";
    }
};