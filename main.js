
//variables
let pts = [] // tableau des points correspondant au x et y de chaque elements
let road =""; // path pour la route

//creer un tableau des elements de content ( sauf les <ul> et le <h1>)
const parts = [...content.querySelectorAll(":not(ul,h1)")];

// taille de la barre de defilement
const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

// mettre le svg à la bonne taille
mySvg.style.width = window.innerWidth - scrollBarWidth;
mySvg.style.height = parts[parts.length -1].getClientRects()[0].y + window.scrollY + parts[parts.length - 1].getClientRects()[0].height;

// decaler les elements en courbe sinusoidale
parts.forEach((value, index)=>{
    // ajouter la sinusoide 
    value.style.transform = "translateX("+ ( Math.sin(index *( Math.PI/8))*50 ) +"px)";
    // recuperer la position des elements dans un tableau
    let x = value.getClientRects()[0].x;
    let y = value.getClientRects()[0].y + + window.scrollY;
    pts.push(parseFloat(x.toFixed(2)));
    pts.push(parseFloat(y.toFixed(2)));
});

// ajouter les points a la fin pour aller jusqu'au bout de la page. 
pts.push(parts[parts.length -1].getClientRects()[0].x, mySvg.style.height);

// construit la route
road += "M "+pts[0]+" "+0;
for(let i =0; i < pts.length; i+=2){
    road +=' L ' + pts[i] + " " + pts[i+1] ;
}

// construit le path -> #roadPath   
let newpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
newpath.setAttributeNS(null, "id", "roadPath");
newpath.setAttributeNS(null, "d", road);
newpath.setAttributeNS(null, "stroke", "grey"); 
newpath.setAttributeNS(null, "stroke-width", "60"); 
newpath.setAttributeNS(null, "opacity", "0.5");
newpath.setAttributeNS(null, "fill", "transparent");
mySvg.appendChild(newpath);

//GSAP
//register the plugin (just once)
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);


// gsap scroll animation
gsap.set("#mercoGroup", { scale: 0.7, autoAlpha: 1 });
gsap.set("#mercoTop", { transformOrigin: "50% 50%" });

animation = gsap.to("#mercoTop", {
  scrollTrigger: {
    trigger: "#roadPath",
    start: "top 10%",
    end: "bottom 90%",
    scrub: 0.8, // 0.4 seconde to catch up
    markers: false,
    onUpdate: (self) => {
      gsap.to("#mercoTop", {
        scale: () => (self.direction === 1 ? 1 : -1),
        overwrite: "auto",
      });
    },
    onRefresh: (self) => {
      console.log("self|trigger : ",self.trigger)
    },
  },
  duration: 10,
  ease: "none",
  immediateRender: true,
  motionPath: {
    path: roadPath,
    align: roadPath,
    alignOrigin: [0.5, 0.5],
    autoRotate: -90,
  },
});

//test
console.log(lastLi.getClientRects()[0].y + window.scrollY);
console.log(pts[141]);
console.log(roadPath.outerHTML);

