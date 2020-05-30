/* Dummy variable, so that Anki can check if script is already loaded */
var isLoaded = true;

function stripClass(cls){
    Array.from(document.getElementsByClassName(cls)).forEach(function(x){
        x.classList.remove(cls);
    })
}

/* Scale font-size within a MathJax display object to fit its width */
function adjustWidth(displayMath){
    const targetWidth = displayMath.clientWidth;
    const actualWidth = displayMath.children[0].clientWidth;
    const scaleFactor = (targetWidth / actualWidth);
    const oldPct = parseFloat(displayMath.children[0].style.fontSize);
    const newPct = Math.min(Math.round(scaleFactor * oldPct), 120);
    displayMath.children[0].style.fontSize = newPct + '%';
    console.log(`oldPct: ${oldPct} \t targetWidth: ${targetWidth} \t actualWidth: ${actualWidth} \t scaleFactor: ${scaleFactor} \t newPct: ${newPct}`);
  }
  

function adjustAllWidths(){
    let mathObjs = document.querySelectorAll('.MJXc-display')
    console.log(`Adjusting width of ${mathObjs.length} display math objects.`);
    mathObjs.forEach(displayMath => adjustWidth(displayMath));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
/* Run this code on the front of every Anki card */
function frontSide(){

    console.log('Front');

    // DEBUG: print MathJax signals to console, but only register once.
    if (MathJax.Hub.signal.listeners.hooks.filter(obj => obj.hook.name == 'debugSignals').length == 0){
        MathJax.Hub.signal.Interest(
            function debugSignals(message) {console.log(message)}
          );
    };

    // Only register hook if not already registered
    if (MathJax.Hub.signal.hooks == undefined) {
        console.log('Registering MathJax hook');
        MathJax.Hub.Register.MessageHook("End Process", function (message) {
                MathJax.Hub.Queue(async function() {
                    await sleep(100);  // This is a hack, but otherwise MathJax heights are not accurate.
                    adjustAllWidths();
                });
        });
    };

    // Also call on subsequent resizing of window
    window.addEventListener('resize', adjustAllWidths);
}

/* Run this code on both sides of every Anki card */
function bothSides(){

}

/* Run this code on the back of every Anki card */
function backSide() {
    console.log('Back');
    stripClass('blur');
    stripClass('hide');
}
