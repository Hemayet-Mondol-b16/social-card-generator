
function generateCard(){

    document.getElementById("headlineText").innerText =
        document.getElementById("headlineInput").value;

    document.getElementById("subheadlineText").innerText =
        document.getElementById("subheadlineInput").value;

    // document.getElementById("footerText").innerText =
    //     document.getElementById("footerInput").value;

    const bgInput=document.getElementById("bgInput");
    if(bgInput.files[0]){
        const reader=new FileReader();
        reader.onload=function(e){
            document.getElementById("bgImage").src=e.target.result;
        }
        reader.readAsDataURL(bgInput.files[0]);
    }

    // const logoInput=document.getElementById("logoInput");
    // if(logoInput.files[0]){
    //     const reader=new FileReader();
    //     reader.onload=function(e){
    //         document.getElementById("logoImage").src=e.target.result;
    //     }
    //     reader.readAsDataURL(logoInput.files[0]);
    // }
}

function downloadCard() {
    const card = document.getElementById("card");

    // Clone the card
    const clone = card.cloneNode(true);

    // Force exact export size
    clone.style.width = "1080px";
    clone.style.height = "800px";
    clone.style.maxWidth = "1080px";
    clone.style.aspectRatio = "unset";
    clone.style.position = "fixed";
    clone.style.left = "0";
    clone.style.top = "0";
    clone.style.margin = "0";
    clone.style.transform = "none";
    clone.style.zIndex = "-1";

    document.body.appendChild(clone);

    const images = clone.querySelectorAll("img");
    const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(res => { img.onload = img.onerror = res; });
    });

    document.fonts.ready.then(() => {
        Promise.all(imagePromises).then(() => {

            html2canvas(clone, {
                width: 1080,
                height: 800,
                windowWidth: 1080,
                windowHeight: 800,
                scale: 1,
                useCORS: true,
                backgroundColor: null
            }).then(canvas => {

                const link = document.createElement("a");
                link.download = "news-post.png";
                link.href = canvas.toDataURL("image/png");
                link.click();

                document.body.removeChild(clone);
            });

        });
    });
}

const today = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric' };

document.getElementById("todayDate").innerText =
    today.toLocaleDateString('en-US', options);
