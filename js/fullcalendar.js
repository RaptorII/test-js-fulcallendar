document.addEventListener('DOMContentLoaded', async function () {
    console.log('start input');

    // ZOHO.embeddedApp.init();


    ZOHO.embeddedApp.on("Dial",function(data){
        console.log("Number Dialed");
    })
    ZOHO.embeddedApp.on("PageLoad",function(data){
        console.log(data);
    })
    ZOHO.embeddedApp.init();
})
