document.addEventListener('DOMContentLoaded', function() {

    if(localStorage.getItem("hasComment") == "true"){
        document.getElementsByClassName("textarea-wrapper")[0].innerHTML = "Grazie per il tuo commento!";
    }
    
    document.addEventListener('click', function(e) {
        
        // if the target is menuBtn or sidemenu or any of its children
        if (!e.target.matches('.menuBtn, #mnbtn-ico, .sidemenu, .sidemenu *')) {
            if(document.getElementById("sidemenu").dataset.state == "open") {
                toggleMenu();
            }
        }
    })

    if(document.getElementById("rifecom-textarea") != null){
        document.getElementById("rifecom-textarea").addEventListener("input", function(e) {
            // get the amount of characters in the textarea
            e.target.value = e.target.value.substring(0, 1500);
            let chars = e.target.value.length;
            if(chars > 1000){
                document.getElementById("wordcounter").innerHTML = chars + " /1500";
                document.getElementById("wordcounter").style.opacity = "1";
                document.getElementById("wordcounter").style.color = "black";
            } else {
                document.getElementById("wordcounter").style.opacity = "0";
            }

            if(chars > 1499){
                document.getElementById("wordcounter").innerHTML = chars + " /1500";
                document.getElementById("wordcounter").style.color = "red";
                document.getElementById("wordcounter").style.opacity = "1";

                // remove all the characters that are over the limit
            } 
        })
    }

    document.addEventListener('scroll', function(e) {
        // get the scroll amount
        let scrollAmount = window.scrollY;

        
        window.globalScrollAmount  = (scrollAmount/(document.getElementsByClassName("section")[0].getBoundingClientRect().height))
        window.currentTab = Math.floor(window.globalScrollAmount)
        window.activeTabScroll = window.globalScrollAmount - window.currentTab
        
        try{

            // if the screen width is less than 800px
            if(window.innerWidth > 800){
                document.getElementsByClassName("bgImage")[currentTab].style.backgroundSize = 100 + (activeTabScroll * 10) + "vmax";
                document.getElementsByClassName("bgImage")[currentTab + 1].style.backgroundSize = 100 - (activeTabScroll * 10) + "vmax"
                document.getElementsByClassName("bgImage")[currentTab - 1].style.backgroundSize = 110 + (activeTabScroll * 10) + "vmax"
            }
        } catch(e){
            console.log("[Log] Tab has no bgImage element");
        }


        if(globalScrollAmount > 0.6){
            // menu shown
            document.getElementById("navBarTitle").dataset.active = "true";
            document.getElementById("navBarTitle").style.color = "#fff";
            document.getElementsByClassName("menuBtn")[0].style.color = "#fff";
            document.getElementsByClassName("menuBtn")[0].style.transform = "translateY(0%)";
            document.getElementsByClassName("navbar")[0].style.backgroundColor = "#1f1f1f";
            document.getElementsByClassName("navbar")[0].style.transform = "translateY(0%)";
            // document.getElementById("herotitle").style.letterSpacing = "15px!important";

            
            
            
        } else {
            // menu not shown
            document.getElementById("navBarTitle").dataset.active = "false";
            // document.getElementById("navBarTitle").style.color = "#1f1f1f";
            document.getElementsByClassName("menuBtn")[0].style.color = "#fff";
            // document.getElementsByClassName("navbar")[0].style.backgroundColor = "transparent";
            document.getElementsByClassName("navbar")[0].style.transform = "translateY(-100%)";
            document.getElementsByClassName("menuBtn")[0].style.transform = "translateY(100%)";
            // document.getElementById("herotitle").style.letterSpacing = "normal";


        }
    
    })

    document.addEventListener('scroll', debounce(function(e) {
          // set the url to url#scroll
          if(window.currentTab == 0){
            window.history.replaceState({}, "", "/");
        } else {
            window.history.replaceState(null, null, window.location.pathname + "#" + window.currentTab);
        }
    }, 100));
    
    window.addEventListener('resize', function(e) {
        console.log("[Info] Resized to: " + window.innerWidth);
        if(window.innerWidth < 1000){
            document.getElementsByClassName("bgImage")[currentTab].style.backgroundSize = "cover";
            document.getElementsByClassName("bgImage")[currentTab + 1].style.backgroundSize = "cover";
            document.getElementsByClassName("bgImage")[currentTab - 1].style.backgroundSize = "cover";
        } else {
            document.getElementsByClassName("bgImage")[currentTab].style.backgroundSize = 100 + (activeTabScroll * 10) + "vmax";
            document.getElementsByClassName("bgImage")[currentTab + 1].style.backgroundSize = 100 - (activeTabScroll * 10) + "vmax"
            document.getElementsByClassName("bgImage")[currentTab - 1].style.backgroundSize = 110 + (activeTabScroll * 10) + "vmax"
        }
    })

    window.toggleMenu = async function(){
        // get the status of the menu
        let sidemenu = document.getElementById("sidemenu")
        let menuButton = document.getElementById("menuBtn")
        let status = sidemenu.dataset.state
        // it can be either closed or open
        if(status == "closed"){
            sidemenu.dataset.state = "open"
            menuButton.innerHTML = "<i id='mnbtn-ico' class='fas fa-times'></i>"
        } else {
            sidemenu.dataset.state = "closed"
            menuButton.innerHTML = "<i id='mnbtn-ico' class='fas fa-bars'></i>"
        }
        
        document.getElementById("mnbtn-ico").style.animation = "none"
        document.getElementById("mnbtn-ico").style.animation = "spin 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)"

    }

})

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    }
};


window.inviaMessaggio = async function(){
    // invia attraverso webhooks di discord il messaggio
    console.log("[!] Attempting to send message...");
    let link = "https://discord.com/api/webhooks/970241915968712714/_heh0m76Ab64MOynOKDirLixoEhMbsiVx4ZNJEHyRaUK9skNDhajXyX6wEmYIYqH5tpT"
    let messaggio = document.getElementById("rifecom-textarea").value;

    if(messaggio.length < 2){
        return false;
    } else if(messaggio.length > 1500){
        messaggio = messaggio.substring(0, 1500);
    }

    document.getElementsByClassName("textarea-wrapper")[0].innerHTML = "Sto inviando il messaggio..."; 

    // get the user's ip address
    let ip = await fetch("https://api.ipify.org?format=json").then(res => res.json()).then(json => json.ip);

    let data = {
        // "content": messaggio,
        "username": "Commento anonimo",
        "avatar_url": "https://i.imgur.com/3mu7WA7.png",
        "tts": false,
        "embeds": [
            {
                "title": "Nuovo Commento",
                "description": messaggio,
                "color": 16777215,
                "timestamp": new Date(),
                "footer": {
                    "text": ip
                },
                "author": {
                    "name": "Commento anonimo",
                    "icon_url": "https://i.imgur.com/3mu7WA7.png"
                }
            }
        ]
    }
    
    document.getElementsByClassName("textarea-wrapper")[0].innerHTML = "Grazie per il tuo commento!"; 
    localStorage.setItem("hasComment", "true");
    let response = await fetch(link, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    });

    console.log("[!] Done!");

}
    