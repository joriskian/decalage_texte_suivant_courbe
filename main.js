
//variables
// let pts = [] // tableau des points correspondant au x et y de chaque elements
// let road =""; // path pour la route
let tween; //gsap scroll animation
let newYposition = 0; // position du scroll
let scrollWidth = getScrollWidth(); // largeur de la barre de defilement
let ratio = getRatio(); // ratio hauteur/largeur

//creer un tableau des elements de content ( sauf les <ul> et le <h1>)
const parts = [...content.querySelectorAll(":not(ul,h1)")];
//recupère toutes les h2 -> toutes les années
const yearTitles = [...document.getElementsByTagName("h2")]; //spread operator on nodeHtml to transform like an array
//recupere le footer
const footer = document.getElementsByClassName("footer")[0]; // recupère le premier element ( et le seul ...)

// taille de la barre de defilement
const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

//crée les etiquettes pour les années et les positionne dans le footer
drawHorizontalYears(yearTitles);

// mettre le svg à la bonne taille
svgSetUpSize();

let pts = twistElements(parts);
road = setupRoad(pts);
decors = setupDecors(pts);

createPath(decors,"decorsPath");
createPath(road,"roadPath", 60, "lightGrey", "transparent",1);

//GSAP----------------------
//register the plugin (just once)
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

// gsap scroll animation
createTween();


//FUNCTIONs------------------
// mets le svg à la bonne taille
function svgSetUpSize(){
  mySvg.style.width = window.innerWidth - scrollBarWidth;
  mySvg.style.height = parts[parts.length -1].getClientRects()[0].y + window.scrollY + parts[parts.length - 1].getClientRects()[0].height;
}

function twistElements(els){
  let pts = [] // tableau des points correspondant au x et y de chaque elements
  els.forEach((value, index)=>{
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
  return pts;
}

function setupRoad(pts){
  let road = "";
  road += "M "+(pts[0] - 50)+" "+pts[1];
  for(let i =0; i < pts.length; i+=2){
  road +=' L ' + (pts[i] - 50) + " " + pts[i+1] ; //decalage de -50 en x pour la courbe
  }
  return road;
}

function setupDecors(pts){
  let decors= "";
  decors += "M 0 " + pts[pts.length-1];
  decors += " 0 "+ pts[1] + " ";
  decors += (pts[0]-50) +" "+ pts[1];
  for(let i =0; i < pts.length; i+=2){
  decors +=' L ' + (pts[i] - 50) + " " + pts[i+1] ; //decalage de -50 en x pour la courbe
  }
  decors += " Z";
  return decors;
}

//recupere la taille de la barre de defilement
function getScrollWidth() {
  return window.innerWidth - document.body.offsetWidth;
}

// recupère le ratio hauteur /largeur
function getRatio() {
  return (
    (document.body.clientWidth - merco.clientWidth - scrollWidth) /
    (wrapper.clientHeight + wrapper.offsetTop - window.innerHeight)
  );
}

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

function updatePath(idPath, newPath){
  idPath.setAttribute("d", newPath);
}

// fonction qui modifie la place des etiquettes "année" sur le footer
function updateYears(h, v) {
  for (let i = 0; i < h.length; i++) {
    // v[0].style.transform = "translateX("+ (((h[0].offsetTop + h[0].clientHeight) /(document.body.clientHeight )) * (footer.clientWidth - merco.clientWidth) )+"px) rotateZ(12rad)";
    v[i].style.transform =
      "translateX(" +
      ((h[i].offsetTop + h[i].clientHeight) / document.body.clientHeight) *
        (footer.clientWidth - merco.clientWidth) +
      "px) rotateZ(12rad)";
  }
}

// recupère le ratio hauteur /largeur
function getRatio() {
  return (
    (document.body.clientWidth - merco.clientWidth - scrollWidth) /
    (wrapper.clientHeight + wrapper.offsetTop - window.innerHeight)
  );
}

function drawHorizontalYears(htmlArray) {
  //crée les etiquettes pour les années et les positionne dans le footer
  //TODO : Problemes sur le positionnement
  htmlArray.forEach((title) => {
    // pour chaque année : ajouter une etiquette à la position sur le footer...
    // creer une etiquette avec l'année:
    let year = document.createElement("div");
    // lui donne une class
    year.classList = "vertical-years";
    // insert l'annsée en texte
    year.innerHTML = title.innerText;
    // la positionner sur le footer :
    footer.appendChild(year);
    // la transformer pour qu'elle soit en vertical et a la bonne position
    year.style.display = "inline-block";
    year.style.writingMode = "vertical-lr";
    // les transformations doivent s'ecrire ensemble sous peine d'en voir une se faire ecraser par l'autre
    year.style.transform =
      "translateX(" +
      // (title.offsetTop + title.clientHeight)  * ratio +
      ((title.offsetTop + title.clientHeight) / document.body.clientHeight) *
      (footer.clientWidth - merco.clientWidth) +
      "px) rotateZ(210deg)";
    // year.style.transform = "translateX("+ (((title.offsetTop + title.clientHeight) /(document.body.clientHeight )) * (footer.clientWidth - merco.clientWidth) )+"px) rotateZ(12rad)";
  });
}

// reconstruct the trigger path (road) for gsap
function createTween() {
  let progress = 0;
  if (tween) {
    progress = tween.progress();
    tween.kill();
  }
  tween = gsap.to("#mercoTop", {
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
    },
    duration: 10,
    ease: "none",
    immediateRender: true,
    motionPath: {
      path: "#roadPath",
      align: "#roadPath",
      alignOrigin: [0.5, 0.5],
      autoRotate: -90,
    },
  });
  tween.progress(progress);
}

//EVENT LISTENERs -----------
// bouge la merco en fonction du scroll
document.addEventListener("scroll", function (e) {
  newYposition = window.scrollY;
  merco.style.transform = "translateX(" + newYposition * ratio + "px)";
});

// update quand resize
window.addEventListener("resize", () => {
  // update la taille de la barre de defilement
  scrollWidth = getScrollWidth();
  // recalcule le ratio
  ratio = getRatio();
  // recupère les elements 'etiquette d'année
  let verticalYears = [...document.getElementsByClassName("vertical-years")];
  // repositionne les etiquettes sur le footer
  updateYears(yearTitles, verticalYears);
  // update la position de la merco
  merco.style.transform = "translateX(" + newYposition * ratio + "px)";
  // recalcule la positions des elements
  pts = twistElements(parts);
  // update road and decors
  updatePath(roadPath,setupRoad(pts));
  updatePath(decorsPath, setupDecors(pts));
  svgSetUpSize();
  //change the trigger in gsap
  createTween();
});

// scroll quand on click sur le footer
footer.addEventListener("click", function (e) {
  // scroll la page en fonction de la position x de la souris
  window.scrollTo(0, e.x / ratio);
});
