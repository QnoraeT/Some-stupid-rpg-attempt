"use strict";
var pos = [];

function allInQueue(){
    let attempts = 0;
    for (let i = 0; i < damageList.length; ++attempts){
        if (attempts > 10000){
            throw new Error("Hey! Something went wrong! I can't process this!");
        }
        if (damageList[i] == "Damage"){
            people[damageList[i+2]].extraInfo[0] = damageList[i+1];
            let DMsub = 0;
            DMsub += people[damageList[i+2]].trueDef
            let DMdiv = 1;
            let DMpow = 1;
            let trueDamage = (Math.max((damageList[i+3] - DMsub), 0) ** DMpow) / DMdiv;
            people[damageList[i+2]].health = people[damageList[i+2]].health - trueDamage;
            people[damageList[i+2]].hitTimer = 0;
            if (people[damageList[i+2]].health <= 0) console.log("Mortal! [" + format(-1 * people[damageList[i+2]].health, 3, 1000000) + "] HP overkill");
            console.log(format(trueDamage, 3, 1000000) + " damage");
            i = i + 5;
        }    
        if (damageList[i] == "Effect"){
            let pA = damageList[i+2].name; // personAffected
            let effectType = damageList[i+3];
            let duration = damageList[i+4];
            let strength = damageList[i+5];
            if (people[pA].sEffects.includes(effectType)){
                let id = people[pA].sEffects.indexOf(effectType);
                switch(damageList[i+6]){
                    case 0: 
                        if (duration > people[pA].sDuration[id]){
                            people[pA].sDuration[id] = duration;
                            console.log("effect duration increased");
                        }
                        if (strength > people[pA].sStrength[id]){
                            people[pA].sStrength[id] = strength;
                            console.log("effect strength increased");
                        }
                        console.log("effect stats checked");
                        break
                    case 1: 
                        people[pA].sDuration[id] = duration;
                        people[pA].sStrength[id] = strength;
                        console.log("effect stats overwritten");
                        break
                    case 2:
                        console.log("already has one. nothing changed");
                        break
                    default:
                        throw new Error("What do you want me to do here?? " + people[pA].name + " already has the effect " + effectList[effectType]);
                }
            } else {
                people[pA].sEffects.push(effectType);
                people[pA].sDuration.push(duration);
                people[pA].sStrength.push(strength);
            }
            i = i + 7;
        }    
    }
    damageList = [];
}

function clamp(num, min, max){ // why isn't this built in
    return Math.min(Math.max(num, min), max);
}

function lerp(t, s, e, type, p){
    t = clamp(t, 0, 1);
    if (t == 0){
        return s;
    }
    if (t == 1){
        return e;
    }
    switch(type) {
        case "QuadIn": 
            t = t * t;
            break;
        case "QuadOut": 
            t = 1.0 - ((1.0 - t) * (1.0 - t));
            break;
        case "CubeIn": 
            t = t * t * t;
            break;
        case "CubeOut": 
            t = 1.0 - ((1.0 - t) * (1.0 - t) * (1.0 - t));
            break;
        case "Smooth": 
            t = 6 * (t ** 5) - 15 * (t ** 4) + 10 * (t ** 3);
            break;
        case "ExpSCurve": 
            t =  (Math.tanh(p * Math.tan((t + 1.5 - ((t - 0.5) / 1e9)) * Math.PI)) + 1) / 2;
            break;
        case "Expo": 
        if (p > 0) {
            t = Math.coth(p / 2)*Math.tanh(p * t / 2);
        } else if (p < 0) {
            t = 1.0 - Math.coth(p / 2)*Math.tanh(p * (1.0 - t) / 2);
        } 
            break;
        default:
            break;
    }
    return (s*(1-t))+(e*t);
}

function newMusic(m){
    if (m >= music.length){
        throw new Error('Hey! That song is out of bounds! ' + m);
    }
    for (let i = 0; i < music.length; ++i){
        console.log(i)
        music[i].load();
    }
    music[m].play();
}

function updateVisuals(){
    let dlastHP;
    let dcurrHP;
    for (let i = 0; i < 1; ++i){
        dcurrHP = clamp(people[peopleNames[i]].health / people[peopleNames[i]].maxHealth,0,1);
        dlastHP = clamp(lastHP[i] / people[peopleNames[i]].maxHealth,0,1);
        translateXY(people[peopleNames[i]].xPosition,
            people[peopleNames[i]].yPosition, 
            people[peopleNames[i]].size, 
            );
        changeAtt('character' + i, pos[0], pos[1], "", "", "", "characters/Alterian Skyler/assets/" + people[peopleNames[i]].spriteState + ".svg")
        // update HP bar
        translateXY(
            people[peopleNames[i]].xPosition + people[peopleNames[i]].xPosHP,
            people[peopleNames[i]].yPosition + people[peopleNames[i]].yPosHP, people[peopleNames[i]].sizeX * people[peopleNames[i]].sHP, 8 * people[peopleNames[i]].sHP)
        changeAtt('hp' + i + '-container', pos[0], pos[1], dcurrHP * pos[2], pos[3])
        changeAtt('hp' + i + 'c', pos[0], pos[1], pos[2], pos[3], gRC(2 * dcurrHP, 0.25, 1))
        changeAtt('hp' + i + 'b', pos[0], pos[1], dlastHP * pos[2], pos[3], gRC(1, 0.9, (Math.sin(24 * Time) / 2) + 0.5))
        changeAtt('hp' + i + 'a', pos[0], pos[1], dcurrHP * pos[2], pos[3], gRC(2 * dcurrHP, 1, 1))
    }
}

function changeAtt(spriteID, left, top, width, height, bgColor, src){
    const sprite = document.getElementById(spriteID)
    if (!(left === "" || left === undefined)) sprite.style.left = left + 'px';
    if (!(top === "" || top === undefined)) sprite.style.top = top + 'px';
    if (!(width === "" || width === undefined)) sprite.style.width = width + 'px';
    if (!(height === "" || height === undefined)) sprite.style.height = height + 'px';
    if (!(bgColor === "" || bgColor === undefined)) sprite.style.backgroundColor = bgColor;
    if (!(src === "" || src === undefined)) sprite.src = src;
}

function updateLastHP(){
    for (let i = 0; i < peopleNames.length; ++i){
        people[peopleNames[i]].hitTimer = people[peopleNames[i]].hitTimer + delta;
        if (people[peopleNames[i]].hitTimer >= 1){
            if (lastHP[i] - people[peopleNames[i]].health > people[peopleNames[i]].maxHealth * delta * 0.25){
                lastHP[i] = lastHP[i] + people[peopleNames[i]].maxHealth * delta * 0.25 * ((lastHP[i] > people[peopleNames[i]].health) ? -1 : 1);
            } else {
                lastHP[i] = people[peopleNames[i]].health;
            }

        }
    }
}

function gRC(time, val, sat){
    let r = 0;
    let g = 0;
    let b = 0;
    let t = time % 1;
    let s = Math.floor(time) % 6;
    switch(s) {
        case 0: 
            r = 1;
            g = t;
            break;
        case 1: 
            r = 1 - t;
            g = 1;
            break;
        case 2: 
            g = 1;
            b = t;
            break;
        case 3: 
            g = 1 - t;
            b = 1;
            break;
        case 4: 
            b = 1;
            r = t;
            break;
        case 5: 
            b = 1 - t;
            r = 1;
            break;
        default:
            throw new Error("Unexpected value!!");
    }
    r = 1 - ((1 - r) * sat);
    g = 1 - ((1 - g) * sat);
    b = 1 - ((1 - b) * sat);
    r = r * val * 255;
    g = g * val * 255;
    b = b * val * 255;
    return "#" + pad(Math.round(r).toString(16), 2) 
               + pad(Math.round(g).toString(16), 2) 
               + pad(Math.round(b).toString(16), 2);
}

function pad(num,length){
    while(num.length < length){
        num = "0" + num;
    }
    return num;
}

function translateXY(x,y,xs,ys){
    pos = []
    pos.push((canvasSize.width / 2) + ((x - CamX + ShakeX) / Zoom))
    pos.push((canvasSize.height / 2) + ((-y - CamY + ShakeY) / Zoom))
    pos.push(xs / Zoom)
    pos.push(ys / Zoom)
}

{
    window.requestAnimationFrame(gameLoop);
    let oldTimeStamp = 0; 

    function gameLoop(timeStamp){
        delta = ((timeStamp - oldTimeStamp) / 1000) * TimeSpeed
        const FPS = Math.round(TimeSpeed / delta)
        Time = Time + delta
        music[musicState].volume = musicVolume
        updateVisuals()
        updateLastHP()
        // do not change
        oldTimeStamp = timeStamp
        window.requestAnimationFrame(gameLoop)
    }
}

function comboSFX(amt, pow){
    let x = ((amt - 1) * 2) + pow
    comboSound[x].play()
}

function start(){
    newMusic(musicState)
}

function getTurnOrder(){
    for (let i = 0; i < peopleNames.length; ++i){
        turnOrder.push(people[peopleNames[i]].trueSpd)
    }
    turnOrder = turnOrder.sort(function(a, b){return a - b})
    let turnNames = []
    for (let i = 0; i < peopleNames.length; ++i){
        for (let j = 0; j < peopleNames.length; ++j){

        }
    }
    console.log(turnNames)
}

