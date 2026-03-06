// ==========================
// Auto resize function for export (optional safeguard)
function autoResizeText(el, maxFont, minFont){
    let fontSize = maxFont;
    el.style.fontSize = fontSize + "px";
    while ((el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) && fontSize > minFont){
        fontSize--;
        el.style.fontSize = fontSize + "px";
    }
}

// ==========================
// Generate live preview and apply font size
function generateCard(){
    const headlineText = document.getElementById("headlineText");
    const subheadlineText = document.getElementById("subheadlineText");

    // Set headline and subheadline
    headlineText.innerText = document.getElementById("headlineInput").value;
    subheadlineText.innerText = document.getElementById("subheadlineInput").value;

    // Apply user-defined font size
    const fontSize = parseInt(document.getElementById("headlineFontInput").value) || 64;
    headlineText.style.fontSize = fontSize + "px";

    // Optional: ensure it fits the preview container
    autoResizeText(headlineText, fontSize, 32);

    // Set background image if user uploaded
    const bgInput = document.getElementById("bgInput");
    if(bgInput.files[0]){
        const reader = new FileReader();
        reader.onload = function(e){
            document.getElementById("bgImage").src = e.target.result;
        }
        reader.readAsDataURL(bgInput.files[0]);
    }
}

// ==========================
// Download/export card as image
function downloadCard(){
    const card = document.getElementById("card");
    const clone = card.cloneNode(true);

    // Force fixed export size
    clone.style.width = "1080px";
    clone.style.height = "800px";
    clone.style.position = "fixed";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.transform = "none";

    document.body.appendChild(clone);

    const headline = clone.querySelector("#headlineText");
    const subheadline = clone.querySelector("#subheadlineText");

    // Apply exact font size for export
    const fontSize = parseInt(document.getElementById("headlineFontInput").value) || 64;
    if(headline){
        headline.style.fontSize = fontSize + "px";
        autoResizeText(headline, fontSize, 32); // optional safeguard
    }
    if(subheadline){
        subheadline.style.fontSize = "28px";
    }

    // Wait for images to load
    const images = clone.querySelectorAll("img");
    const imagePromises = Array.from(images).map(img => {
        if(img.complete) return Promise.resolve();
        return new Promise(res => { img.onload = img.onerror = res; });
    });

    document.fonts.ready.then(()=>{
        Promise.all(imagePromises).then(()=>{
            html2canvas(clone,{
                width:1080,
                height:800,
                windowWidth:1080,
                windowHeight:800,
                scale:1,
                useCORS:true,
                backgroundColor:null
            }).then(canvas=>{
                const link = document.createElement("a");
                link.download = "news-post.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
                document.body.removeChild(clone);
            });
        });
    });
}

// ==========================
// Set today's date
const today = new Date();
const options = { year:'numeric', month:'long', day:'numeric' };
document.getElementById("todayDate").innerText =
today.toLocaleDateString('en-US', options);

// ==========================
// Event listeners
document.getElementById("headlineInput").addEventListener("input", generateCard);
document.getElementById("subheadlineInput").addEventListener("input", generateCard);
document.getElementById("headlineFontInput").addEventListener("input", generateCard);
document.getElementById("bgInput").addEventListener("change", generateCard);

// Initial preview
generateCard();