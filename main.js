
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
pts.push(parts[parts.length -1].getClientRects()[0].x, parts[parts.length -1].getClientRects()[0].y + window.scrollY + parts[parts.length - 1].getClientRects()[0].height);
// construit la route
road += "M "+(pts[0] - 50)+" "+pts[1];
for(let i =0; i < pts.length; i+=2){
  road +=' L ' + (pts[i] - 50) + " " + pts[i+1] ; //decalage de -50 en x pour la courbe
}


//construit le decor ( element de gauche)
// closed path 
// en bas a gauche, en haut a gauche, departs de la route, fin de la route
let decors= "";
decors += "M 0 " + pts[pts.length-1];
decors += " 0 "+ pts[1] + " ";
decors += (pts[0]-50) +" "+ pts[1];
for(let i =0; i < pts.length; i+=2){
  decors +=' L ' + (pts[i] - 50) + " " + pts[i+1] ; //decalage de -50 en x pour la courbe
}
decors += " Z";

// construit le path -> #roadPath   
function createPath(path, id, strokeWidth = 0, colorStroke = "black", colorFill = "grey" ,opacity = 1) {
  let newpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  newpath.setAttributeNS(null, "id", id);
  newpath.setAttributeNS(null, "d", path);
  newpath.setAttributeNS(null, "stroke", colorStroke); 
  newpath.setAttributeNS(null, "stroke-width", strokeWidth); 
  newpath.setAttributeNS(null, "opacity", opacity);
  newpath.setAttributeNS(null, "fill", colorFill);
  mySvg.appendChild(newpath);
}

createPath(decors,"decorsPath");
createPath(road,"roadPath", 60, "lightGrey", "transparent",1);

//GSAP
//register the plugin (just once)
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);


// gsap scroll animation
gsap.set("#mercoGroup", { scale: 0.7, autoAlpha: 1 });
gsap.set("#mercoTop", { transformOrigin: "50% 50%" });

animation = gsap.to("#mercoTop", {
  scrollTrigger: {
    trigger: "#roadPath",
    start: "top 25%",
    end: "bottom 90%",
    scrub: 0.4, // 0.4 seconde to catch up
    markers: false,
    onUpdate: (self) => {
      gsap.to("#mercoTop", {
        scale: () => (self.direction === 1 ? 1 : -1),
        overwrite: "auto",
      });
    },
    onRefresh: (self) => {
      // console.log("self|trigger aka #roadPath: ",self.trigger)
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
// console.log("taille total jusqu'au dernier : ", lastLi.getClientRects()[0].y + window.scrollY);
// console.log("pts[141] : ",pts[141]);
// console.log("roadPath.outerHTML : ",roadPath.outerHTML);
console.log("decor : ",decors);

