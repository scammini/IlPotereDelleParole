document.addEventListener('DOMContentLoaded', function() {
    if(localStorage.getItem("hasComment") == "true"){
        document.getElementsByClassName("textarea-wrapper")[0].innerHTML = "Grazie per il tuo commento!";
    }

    let randomGradients = [
        '#C33764', '#1D2671', // suriani
        '#E03FFE', '#6A1B9A',
        '#B24592', '#F15F79'
    ]

    let randomGradient = randomGradients[Math.floor(Math.random() * randomGradients.length)];
    document.getElementById("home").style.background = randomGradient;


    
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

    document.getElementById("popup-close").addEventListener("click", function(e) {
        togglePopup();
    });

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
            if(document.getElementById("navBarTitle").dataset.active == "true") return;
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
        try{
            if(window.innerWidth < 1000){
                document.getElementsByClassName("bgImage")[currentTab].style.backgroundSize = "cover";
                document.getElementsByClassName("bgImage")[currentTab + 1].style.backgroundSize = "cover";
                document.getElementsByClassName("bgImage")[currentTab - 1].style.backgroundSize = "cover";
            } else {
                document.getElementsByClassName("bgImage")[currentTab].style.backgroundSize = 100 + (activeTabScroll * 10) + "vmax";
                document.getElementsByClassName("bgImage")[currentTab + 1].style.backgroundSize = 100 - (activeTabScroll * 10) + "vmax"
                document.getElementsByClassName("bgImage")[currentTab - 1].style.backgroundSize = 110 + (activeTabScroll * 10) + "vmax"
            }
        } catch(e){
            return;
        }
    })

    window.toggleMenu = async function(){
        // get the status of the menu
        let sidemenu = document.getElementById("sidemenu")
        let menuButton = document.getElementById("menuBtn")
        let status = sidemenu.dataset.state
        // it can be either closed or open
        if(status != "open"){
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
    let link = "https://discord.com/api/webhooks/970241915968712714/_heh0m76Ab64MOynOKDirLixoEhMbsiVx4ZNJEHyRaUK9skNDhajXyX6wEmYIYqH5tpT"
    let messaggio = document.getElementById("rifecom-textarea").value;

    if(messaggio.length < 2){
        return false;
    } else if(messaggio.length > 1500){
        messaggio = messaggio.substring(0, 1500);
    }

    // if the textbox contains only spaces, don't send the message
    if(messaggio.replace(/\s/g, '').length == 0){
        // empty the textbox
        document.getElementById("rifecom-textarea").value = "";
        return false;
    }

    document.getElementsByClassName("textarea-wrapper")[0].innerHTML = "Sto inviando il messaggio..."; 

    messaggio = soapify(messaggio);

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


}
    

window.togglePopup = async function(title, text){
    // if the popup has "data-active" set to "true", it will be closed
    if(document.getElementsByClassName("popup-bg")[0].dataset.active == "true"){
        document.getElementsByClassName("popup-bg")[0].dataset.active = "false";
        document.body.style.overflowY = "auto";
    } else {
        if(!title || !text){
            if(!title){
                console.error("[!] No title provided!");
            } else {
                console.error("[!] No text provided!");
            }

            return false;
        }
        
        document.getElementsByClassName("popup-bg")[0].dataset.active = "true";
        document.getElementById("pu-title").innerHTML = title;
        document.getElementById("pu-content").innerHTML = text;
        document.body.style.overflowY = "hidden";
    }
}

window.soapify = function(text){
    // filtro anti-profanità
    // questa funzione censura le parolacce con caratteri speciali casuali alla "cartone animato" (cazzo -> #$%#@!)
    let badWords = [
        // se una parola finisce per *, possono esistere variazioni di quella parola (cazz* -> cazzi, cazzo, etc., stronz* -> stronzi, stronza, stronzo, etc.)
        "cazz",
        "merda",
        "stronz",
        "puttana",
        "dio",
        "madonna",
        "gesù",
        "vaffanculo",
        "zoccola",
        "fottut",
        "cagat",
        "cess",
        "cazzon",
        "coglione",
        "shwa", // :)
        "ammazzati",
        "culo",
        "bastard",
        "palle",
    ]

    let antiBypassFilter =  [
        ["a", ["4", "@", "à", "â", "ã", "ä", "å", "æ"]],
        ["e", ["3", "€", "è", "é", "ê", "ë"]],
        ["i", ["1", "!", "ì", "í", "î", "ï"]],
        ["o", ["0", "ò", "ó", "ô", "õ", "ö"]],
        ["u", ["ü", "ù", "ú", "û"]],
        ["s", ["5", "$", "§", "ß", "ś", "ŝ", "š", "ş"]],
        ["c", ["¢", "ç", "ć", "č"]],
        ["n", ["ñ", "ń", "ň"]],
        ["y", ["ÿ", "ŷ"]],
        ["z", ["ž", "ź", "ż"]],
        ["l", ["ł", "ĺ", "ľ"]],
        ["t", ["7", "†", "°", "τ", "ţ", "ť", "ŧ"]],
    ]
    
    let censorChars = ["#", "$", "%", "&", "!", "?"]

    // censor the bad words (some words may try to bypass the filter (ex. cazzo -> c4zz0), so we need to check if the word contains a bypass and replace it with the actual char
    for(let i = 0; i < badWords.length; i++){
        let word = text.split(" ");
        for(let j = 0; j < word.length; j++){
            // if the word contains any of the characters in the second array of the array antiBypassFilter, it will be replaced with the first element of the array
            if((word[j] + word[j+1]).includes(badWords[i])){
                console.log((word[j] + word[j+1]).includes(badWords[i]));
                for(let k = 0; k < antiBypassFilter.length; k++){
                    for(let l = 0; l < antiBypassFilter[k][1].length; l++){
                        if(word[j].includes(antiBypassFilter[k][1][l])){
                            word[j] = word[j].replace(antiBypassFilter[k][1][l], antiBypassFilter[k][0]);
                        }
                    }
                }
            }

            if(word[j].includes(badWords[i])){
                let censoredString = []
                for(let k = 0; k < word[j].length; k++){
                        censoredString[k] = censorChars[Math.floor(Math.random() * censorChars.length)];                    
                }
                word[j] = censoredString.join("");
            }
        }

        

        text = word.join(" ");
    }


    return text;



}

