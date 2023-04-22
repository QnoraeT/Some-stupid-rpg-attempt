"use strict";
let pos = [];

function rand(min, max){
    return Math.random()*(max-min)+min
}

function checkElementEffective(attacking, d){
    // i'm gonna have to leave this tomorrow, i'm not sure if it's possible to generalize this at all...
    let mul = 1;
    for (let i = 0; i < attacking.length; ++i){
        switch(attacking[i]){
        case "Normal": 
            mul *= damageElementCheck(0.5, d, ["Rock", "Metal", "Crystal", "Mech", "Chemical", "Volcanic", "Virus"]);
            mul *= damageElementCheck(0, d, ["Spirit", "Soul"]);
            break;
        case "Water": 
            mul *= damageElementCheck(2, d, ["Fire", "Earth", "Rock", "Volcanic", "Cyber", "Magnetic", "Spectra"]);
            mul *= damageElementCheck(0.5, d, ["Water", "Grass", "Air", "Dragon", "Chemical", "Plasma", "Glass", "Celestial", "Wood", "Nuclear", "Ancient"]);
            break;
        case "Fire": 
            mul *= damageElementCheck(0, d, ["Crystal"]);
            break;
        case "Grass": 

            break;
        case "Electric": 

            break;
        default:
            console.log("unknown element: " + attacking[i]);
            break;
        }
    }
    return mul;
}

function damageElementCheck(multiplier, def, check){
    let at2 = 0;
    for (let i = 0; i < check.length; ++i){
        at2++;
        if (check.includes(def[i])){
            console.log("match!");
            return multiplier;
        }
        if (at2 > 10000){
            throw new Error("Hey! Something went wrong! I can't process this!");
        }
    }
    return 1;
}

function allInQueue(){
    let attempts = 0;
    for (let i = 0; i < damageList.length; ++attempts){
        if (attempts > 10000){
            throw new Error("Hey! Something went wrong! I can't process this!");
        }
        if (damageList[i] == "Damage"){
            people[damageList[i+2]].extraInfo[0] = damageList[i+1];
            let damage = Math.random()*100
            let crit = false
            for (let j = damageList[i+4].length - 1; j >= 0; --j){ // critical hit checker
                if (damage < damageList[i+4][j]){
                    damage = j;
                    crit = true;
                    break;
                }
            }
            if (crit == true){
                console.log(critNames[damage] + " Hit!");
                damage = damageList[i+3] * damageList[i+5][damage];
            } else {
                damage = damageList[i+3];
            }
            damage = damage * rand(1/((damageList[i+6]/100)+1),((damageList[i+6]/100)+1));
            if (people[damageList[i+1]].sEffects.includes(19) && damageList[i+7].includes("Magical")){damage = damage * 2.5; console.log("Unstable Magic buff!")};
            if (people[damageList[i+1]].sEffects.includes(21) && damageList[i+7].includes("Magical")){damage = damage * 0.25; console.log("Silenced nerf!")};
            let DMsub = 0;
            if (damageList[i+8] < 1) {DMsub += people[damageList[i+2]].trueDef;};
            let DMdiv = 1;
            if (damageList[i+8] < 2) {DMdiv *= people[damageList[i+2]].trueDDef;};
            let DMpow = 1;
            if (damageList[i+8] < 3) {DMpow *= people[damageList[i+2]].truePDef;};
            let trueDamage = Math.max((((damage ** DMpow) / DMdiv) - DMsub), 0);
            people[damageList[i+2]].health = people[damageList[i+2]].health - trueDamage;
            people[damageList[i+2]].hitTimer = 0;
            if (people[damageList[i+2]].health <= 0) console.log("Mortal! [" + format(-1 * people[damageList[i+2]].health, 3, 1000000) + "] HP overkill");
            console.log(format(trueDamage, 3, 1000000) + " damage");
            i = i + 9;
        }    
        //damageList.push("Heal", this.name, person, healing, variance, type);
        if (damageList[i] == "Heal"){
            for (let j = damageList[i+3].length - 1; j >= 0; --j){
                let healing = damageList[i+3][j] * rand(1/((damageList[i+4]/100)+1),((damageList[i+4]/100)+1))
                console.log(format(healing, 3, 1000000) + " healing");
                switch(j){
                    case 0: 
                        people[damageList[i+2]].health = people[damageList[i+2]].health + healing;
                        break;
                    case 1: 
                        people[damageList[i+2]].mana = people[damageList[i+2]].mana + healing;
                        break;
                    case 2: 
                        people[damageList[i+2]].SuperPower = people[damageList[i+2]].SuperPower + healing;
                        break;
                    case 3: 
                        people[damageList[i+2]].GigaPower = people[damageList[i+2]].GigaPower + healing;
                        break;
                    case 4: 
                        people[damageList[i+2]].HyperPower = people[damageList[i+2]].HyperPower + healing;
                        break;
                    default:
                        console.warn("You can't heal what you don't know! [" + j + " >= 5]");
                        j = 5;
                        break;
                }
            }
            i = i + 6;
        }    
        if (damageList[i] == "Effect"){
            let pA = damageList[i+2]; // personAffected
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
                        break;
                    case 1: 
                        people[pA].sDuration[id] = duration;
                        people[pA].sStrength[id] = strength;
                        console.log("effect stats overwritten");
                        break;
                    case 2:
                        console.log("already has one. nothing changed");
                        break;
                    default:
                        throw new Error("What do you want me to do here?? " + people[pA].name + " already has the effect " + effectList[effectType]) + ", but you are not clear what you want me to do! (Type: " + damageList[i+6] + ")";
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
        music[i].load();
    }
    music[m].play();
}

function updateVisuals(){
    if (Zoom <= 0){Zoom = 1; console.error("Hey WTF! Who set the zoom to 0!?")}
    let dlastHP;
    let dcurrHP;
    for (let i = 0; i < 1; ++i){
        dcurrHP = clamp(people[peopleNames[i]].health / people[peopleNames[i]].maxHealth,0,1);
        dlastHP = clamp(lastHP[i] / people[peopleNames[i]].maxHealth,0,1);
        let [left, top, width, height] = translateXY(people[peopleNames[i]].xPosition,
            people[peopleNames[i]].yPosition, 
            people[peopleNames[i]].sizeX * people[peopleNames[i]].size, 
            people[peopleNames[i]].sizeY * people[peopleNames[i]].size
            );
        changeAtt('character' + i, left, top, width, height, "", "characters/" + peopleNames[i] + "/assets/" + people[peopleNames[i]].spriteState + ".svg");
        // update HP bars
        [left, top, width, height] = translateXY(people[peopleNames[i]].xPosition + people[peopleNames[i]].xPosHP * people[peopleNames[i]].size,
            people[peopleNames[i]].yPosition + people[peopleNames[i]].yPosHP * people[peopleNames[i]].size, 
            people[peopleNames[i]].sizeX * people[peopleNames[i]].sHP * people[peopleNames[i]].size, 
            8 * people[peopleNames[i]].sHP * people[peopleNames[i]].size
            );
        changeAtt('hp' + i + '-container', left, top, width, height);
        changeAtt('hp' + i + 'c', left, top, width, height, gRC(2 * dcurrHP, 0.25, 1));
        changeAtt('hp' + i + 'b', left, top, dlastHP * width, height, gRC(1, 0.9, (Math.sin(24 * Time) / 2) + 0.5));
        changeAtt('hp' + i + 'a', left, top, dcurrHP * width, height, gRC(2 * dcurrHP, 1, 1));
        const hpContainer = document.getElementById('hp' + i + '-container')
        hpContainer.style.border = height / 2 + "px solid #181818"
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
            throw new Error("Wtf!! Why is there an invalid number?  [" + s + "]");
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
    return [
        (canvasSize.width / 2) + ((x - CamX + ShakeX) / Zoom),
        (canvasSize.height / 2) + ((-y - CamY + ShakeY) / Zoom),
        xs / Zoom,
        ys / Zoom,
    ];
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
    // this is still not done
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

