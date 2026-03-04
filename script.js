
function generateCard(){

    document.getElementById("headlineText").innerText =
        document.getElementById("headlineInput").value;

   /* document.getElementById("subheadlineText").innerText =
        document.getElementById("subheadlineInput").value;*/

    document.getElementById("footerText").innerText =
        document.getElementById("footerInput").value;

    const bgInput=document.getElementById("bgInput");
    if(bgInput.files[0]){
        const reader=new FileReader();
        reader.onload=function(e){
            document.getElementById("bgImage").src=e.target.result;
        }
        reader.readAsDataURL(bgInput.files[0]);
    }

    const logoInput=document.getElementById("logoInput");
    if(logoInput.files[0]){
        const reader=new FileReader();
        reader.onload=function(e){
            document.getElementById("logoImage").src=e.target.result;
        }
        reader.readAsDataURL(logoInput.files[0]);
    }
}

function downloadCard() {
    const card = document.getElementById("card");

    // Clone the card
    const clone = card.cloneNode(true);
    clone.style.width = "1080px";
    clone.style.height = "720px";
    clone.style.transform = "scale(1)";
    clone.style.position = "absolute";
    clone.style.left = "-9999px"; // move off-screen
    clone.style.top = "0";
    clone.style.margin = "0";
    clone.style.zIndex = "9999";

    document.body.appendChild(clone);

    // Wait for fonts and images to load
    const images = clone.querySelectorAll("img");
    const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(res => { img.onload = img.onerror = res; });
    });

    document.fonts.ready.then(() => {
        Promise.all(imagePromises).then(() => {
            html2canvas(clone, { scale: 2 }).then(canvas => {
                const link = document.createElement("a");
                link.download = "news-post.png";
                link.href = canvas.toDataURL("image/png");
                link.click();

                // Remove the clone after download
                document.body.removeChild(clone);
            });
        });
    });
}
