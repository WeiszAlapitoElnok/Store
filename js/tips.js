const tips = ["Használd a V.A.T.S.-ot – Segít pontosabban célozni és kevesebb lőszert pazarolni.", "Gyűjtsd a Nuka-Cola Quantumokat – Egy küldetéshez szükséged lesz rájuk, és extra energiát adnak.", "Ne feledd a társakat – Dogmeat és más NPC-k segíthetnek a harcban és a túlélésben.", "Fedezd fel a rejtett helyeket – Sok titkos loot és érdekes történet vár rád.", "Használd a gyorsutazást okosan – Spórolj időt, de figyelj a veszélyes területekre.", "Kezdd magas intelligenciával (több skill pont).", "Fókuszálj egy fegyverkategóriára (pl. Energy Weapons).", "Lockpicking és Science skillek – érdemes 50 fölé vinni.", "Takarékoskodj a lőszerrel, használj közelharci fegyvereket.", "Gyógyulj alvással, ha van rá lehetőséged.", "Megaton bombája – használj Mentatsot a skill növelésére.", "Szerezd meg az Intelligence Bobbleheadet Rivet Cityben."];
let r = 0;

document.getElementById("tipbutt").addEventListener("click", (event)=>{
    r = Math.floor(Math.random() * 13);
    alert(tips[r])
})