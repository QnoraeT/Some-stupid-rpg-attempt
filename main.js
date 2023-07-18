"use strict";

let pos = [];

function rand(min, max){
    return Math.random()*(max-min)+min;
}

function intRand(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function checkElementEffective(attacking, d){
    // THIS IS SO DUMB how do i generalize this ;_;
    // optimizations could be possible (is this like O(n^4) or something!?)
    let mul = 1;
    for (let i = 0; i < attacking.length; ++i){
        switch(attacking[i]){
            case "Normal": 
                mul *= dEC(0.5, d, ["Rock", "Metal", "Crystal", "Mech", "Chemical", "Volcanic", "Virus"]);
                mul *= dEC(0, d, ["Spirit", "Soul"]);
                break;
            case "Water": 
                mul *= dEC(2, d, ["Fire", "Earth", "Rock", "Volcanic", "Cyber", "Magnetic", "Spectra"]);
                mul *= dEC(0.5, d, ["Water", "Grass", "Air", "Dragon", "Chemical", "Plasma", "Glass", "Celestial", "Wood", "Nuclear", "Ancient"]);
                break;
            case "Fire": 
                mul *= dEC(2, d, ["Grass", "Ice", "Air", "Insect", "Metal", "Explosive", "Virus", "Wood", "Shadow", "Nuclear"]);
                mul *= dEC(0.5, d, ["Water", "Fire", "Light", "Rock", "Dragon", "Mystic", "Volcanic", "Glass", "Ancient"]);
                mul *= dEC(0, d, ["Crystal"]);
                break;
            case "Grass": 
                mul *= dEC(2, d, ["Water", "Earth", "Rock", "Crystal"]);
                mul *= dEC(0.5, d, ["Fire", "Grass", "Air", "Poison", "Insect", "Metal", "Dragon", "Mystic", "Plasma", "Glass", "Virus", "Cyber"]);
                break;
            case "Electric": 
                mul *= dEC(2, d, ["Water", "Crystal", "Time", "Virus", "Cyber", "Magnetic"]);
                mul *= dEC(0.5, d, ["Grass", "Electric", "Light", "Dragon", "Plasma", "Glass", "Wood", "Soul"]);
                mul *= dEC(0, d, ["Earth"]);
                break;
            case "Ice": 
                mul *= dEC(2, d, ["Grass", "Air", "Earth", "Dragon", "Time", "Volcanic", "Virus", "Soul", "Shadow", "Nuclear"]);
                mul *= dEC(0.5, d, ["Water", "Fire", "Ice", "Metal", "Explosive", "Plasma", "Ancient"]);
                break;
            case "Air": 
                mul *= dEC(2, d, ["Grass", "Earth", "Fighting", "Insect", "Explosive"]);
                mul *= dEC(0.5, d, ["Water", "Air", "Rock", "Metal", "Psychic", "Mech", "Magic", "Volcanic", "Cosmic", "Wood", "Soul"]);
                mul *= dEC(0, d, ["Chemical"]);
                break;
            case "Dark": 
                mul *= dEC(2, d, ["Light", "Spirit", "Psychic", "Crystal", "Magic", "Glass", "Soul"]);
                mul *= dEC(0.5, d, ["Dark", "Fighting", "Mystic", "Virus", "Spectra", "Shadow"]);
                break;
            case "Light": 
                mul *= dEC(2, d, ["Dark", "Magic", "Soul", "Shadow", "Ancient"]);
                mul *= dEC(0.5, d, ["Water", "Ice", "Light", "Earth", "Rock", "Crystal", "Glass", "Cyber"]);
                mul *= dEC(0, d, ["Psychic"]);
                break;
            case "Earth": 
                mul *= dEC(2, d, ["Fire", "Electric", "Poison", "Rock", "Metal", "Chemical", "Glass", "Virus"]);
                mul *= dEC(0.5, d, ["Grass", "Insect", "Time", "Explosive", "Magnetic", "Wood"]);
                mul *= dEC(0, d, ["Air", "Celestial"]);
                break;
            case "Fighting": 
                mul *= dEC(2, d, ["Normal", "Ice", "Dark", "Rock", "Metal", "Sound", "Wood"]);
                mul *= dEC(0.5, d, ["Air", "Poison", "Insect", "Psychic", "Mystic", "Time", "Glass", "Soul"]);
                mul *= dEC(0, d, ["Spirit", "Crystal", "Shadow"]);
                break;
            case "Poison": 
                mul *= dEC(2, d, ["Grass", "Air", "Mystic", "Volcanic", "Cyber", "Wood"]);
                mul *= dEC(0.5, d, ["Earth", "Poison", "Spirit", "Psychic", "Virus", "Nuclear"]);
                mul *= dEC(0, d, ["Metal", "Crystal", "Mech"]);
                break;
            case "Insect": 
                mul *= dEC(2, d, ["Grass", "Dark", "Light", "Psychic", "Spectra", "Wood", "Shadow"]);
                mul *= dEC(0.5, d, ["Fire", "Fighting", "Poison", "Metal", "Mystic", "Virus"]);
                break;
            case "Rock": 
                mul *= dEC(2, d, ["Fire", "Ice", "Air", "Insect", "Chemical", "Glass"]);
                mul *= dEC(0.5, d, ["Earth", "Fighting", "Metal", "Crystal", "Plasma", "Celestial", "Magnetic"]);
                break;
            case "Metal": 
                mul *= dEC(2, d, ["Ice", "Sound", "Glass", "Magnetic", "Wood", "Nuclear"]);
                mul *= dEC(0.5, d, ["Water", "Fire", "Electric", "Metal", "Crystal", "Mech", "Chemical", "Plasma", "Volcanic"]);
                break;
            case "Spirit": 
                mul *= dEC(2, d, ["Spirit", "Psychic", "Cyber", "Cosmic"]);
                mul *= dEC(0.5, d, ["Dark", "Light", "Soul"]);
                mul *= dEC(0, d, ["Normal", "Magic", "Virus"]);
                break;
            case "Psychic": 
                mul *= dEC(2, d, ["Fighting", "Poison", "Sound", "Plasma", "Virus", "Cyber", "Magnetic"]);
                mul *= dEC(0.5, d, ["Metal", "Psychic", "Magic", "Glass", "Celestial", "Cosmic", "Soul", "Nuclear"]);
                mul *= dEC(0, d, ["Dark"]);
                break;
            case "Dragon": 
                mul *= dEC(2, d, ["Dragon", "Volcanic", "Celestial", "Wood", "Ancient"]);
                mul *= dEC(0.5, d, ["Metal", "Glass", "Spectra", "Nuclear"]);
                mul *= dEC(0, d, ["Mystic"]);
                break;
            case "Mystic": 
                mul *= dEC(2, d, ["Air", "Dark", "Light", "Fighting", "Dragon", "Sound", "Magic", "Plasma", "Virus", "Celestial", "Cosmic"]);
                mul *= dEC(0.5, d, ["Fire", "Grass", "Poison", "Metal", "Soul"]);
                mul *= dEC(0, d, ["Nuclear"]);
                break;
            case "Sound": 
                mul *= dEC(2, d, ["Normal", "Water", "Ice", "Fighting", "Insect", "Rock", "Glass", "Virus", "Shadow"]);
                mul *= dEC(0.5, d, ["Electric", "Light", "Earth", "Metal", "Spirit", "Psychic", "Sound", "Mech", "Celestial"]);
                break;
            case "Crystal": 
                mul *= dEC(2, d, ["Electric", "Ice", "Dark", "Fighting", "Poison", "Spirit", "Mystic", "Sound", "Chemical", "Magic", "Volcanic", "Virus", "Celestial"]);
                mul *= dEC(0.5, d, ["Grass", "Air", "Light", "Psychic", "Crystal", "Cosmic", "Nuclear"]);
                break;
            case "Mech": 
                mul *= dEC(2, d, ["Grass", "Fighting", "Insect", "Metal", "Glass", "Wood", "Nuclear"]);
                mul *= dEC(0.5, d, ["Fire", "Air", "Earth", "Spirit", "Mech", "Chemical", "Explosive", "Plasma"]);
                break;
            case "Time": 
                mul *= dEC(2, d, ["Normal", "Earth", "Fighting", "Mystic", "Time", "Ancient"]);
                mul *= dEC(0.5, d, ["Psychic", "Celestial", "Cosmic", "Magnetic", "Spectra"]);
                break;
            case "Chemical": 
                mul *= dEC(2, d, ["Water", "Grass", "Electric", "Ice", "Insect", "Metal", "Crystal", "Mech", "Chemical", "Cyber", "Magnetic", "Wood"]);
                mul *= dEC(0.5, d, ["Fire", "Air", "Light", "Earth", "Rock", "Cosmic", "Shadow", "Nuclear"]);
                mul *= dEC(0, d, ["Dark", "Spirit", "Celestial", "Soul"]);
                break;
            case "Explosive": 
                mul *= dEC(2, d, ["Ice", "Earth", "Rock", "Metal", "Mech", "Glass"]);
                mul *= dEC(0.5, d, ["Water", "Fire", "Air", "Sound", "Plasma", "Nuclear"]);
                mul *= dEC(0, d, ["Soul"]);
                break;
            case "Magic": 
                mul *= dEC(2, d, ["Electric", "Air", "Dark", "Fighting", "Crystal", "Magic", "Magnetic", "Spectra"]);
                mul *= dEC(0.5, d, ["Light", "Metal", "Psychic", "Plasma", "Celestial", "Cosmic", "Shadow", "Nuclear"]);
                break;
            case "Plasma": 
                mul *= dEC(2, d, ["Water", "Fire", "Electric", "Ice", "Spirit", "Explosive", "Virus", "Nuclear"]);
                mul *= dEC(0.5, d, ["Psychic", "Sound", "Plasma", "Celestial", "Cosmic", "Magnetic", "Spectra"]);
                mul *= dEC(0, d, ["Volcanic"]);
                break;
            case "Volcanic": 
                mul *= dEC(2, d, ["Fire", "Ice", "Dark", "Poison", "Rock", "Metal", "Sound", "Chemical", "Explosive", "Virus", "Wood", "Nuclear"]);
                mul *= dEC(0.5, d, ["Water", "Air", "Earth", "Dragon", "Volcanic", "Ancient"]);
                mul *= dEC(0, d, ["Plasma"]);
                break;
            case "Glass": 
                mul *= dEC(2, d, ["Light", "Psychic", "Mystic", "Plasma", "Glass", "Spectra"]);
                mul *= dEC(0.5, d, ["Normal", "Dark", "Fighting", "Rock", "Spirit", "Sound", "Soul", "Shadow"]);
                break;
            case "Virus": 
                mul *= dEC(2, d, ["Normal", "Water", "Fighting", "Insect", "Psychic", "Magic", "Celestial", "Wood"]);
                mul *= dEC(0.5, d, ["Electric", "Earth", "Rock", "Spirit", "Dragon", "Cyber", "Soul"]);
                break;
            case "Cyber": 
                mul *= dEC(2, d, ["Poison", "Spirit", "Psychic", "Plasma", "Cyber"]);
                mul *= dEC(0.5, d, ["Water", "Electric", "Earth", "Fighting", "Insect", "Chemical", "Virus", "Cosmic", "Magnetic"]);
                break;
            case "Celestial": 
                mul *= dEC(2, d, ["Normal", "Light", "Mystic", "Soul", "Ancient"]);
                mul *= dEC(0.5, d, ["Dark", "Dragon", "Cyber", "Celestial", "Cosmic"]);
                break;
            case "Cosmic": 
                mul *= dEC(2, d, ["Air", "Earth", "Spirit", "Psychic", "Crystal", "Glass", "Virus", "Celestial", "Cosmic", "Spectra", "Ancient"]);
                mul *= dEC(0.5, d, ["Normal", "Fire", "Dark", "Rock", "Cyber", "Soul"]);
                break;
            case "Magnetic": 
                mul *= dEC(2, d, ["Electric", "Metal", "Time", "Plasma", "Cyber", "Magnetic", "Soul"]);
                mul *= dEC(0.5, d, ["Earth", "Fighting", "Spirit", "Psychic", "Ancient"]);
                break;
            case "Spectra": 
                mul *= dEC(2, d, ["Fighting", "Chemical", "Soul", "Shadow"]);
                mul *= dEC(0.5, d, ["Normal", "Dark", "Light", "Spirit", "Psychic", "Time", "Explosive", "Spectra", "Nuclear", "Ancient"]);
                mul *= dEC(0, d, ["Water", "Ice", "Mystic", "Crystal", "Glass"]);
                break;
            case "Wood": 
                mul *= dEC(2, d, ["Water", "Air", "Cyber", "Spectra"]);
                mul *= dEC(0.5, d, ["Fire", "Ice", "Fighting", "Rock", "Metal", "Spirit", "Mech", "Chemical", "Plasma", "Volcanic", "Virus", "Wood", "Nuclear"]);
                mul *= dEC(0, d, ["Crystal"]);
                break;
            case "Soul": 
                mul *= dEC(2, d, ["Normal", "Air", "Poison", "Dragon", "Mech", "Virus", "Magnetic", "Soul"]);
                mul *= dEC(0.5, d, ["Water", "Fire", "Electric", "Light", "Earth", "Spirit", "Mystic", "Crystal", "Chemical", "Plasma", "Cosmic", "Spectra", "Ancient"]);
                mul *= dEC(0, d, ["Fighting"]);
                break;
            case "Shadow": 
                mul *= dEC(2, d, ["Fighting", "Spirit", "Mystic", "Chemical", "Glass"]);
                mul *= dEC(0.5, d, ["Fire", "Electric", "Air", "Dark", "Light", "Volcanic", "Celestial", "Spectra"]);
                mul *= dEC(0, d, ["Shadow"]);
                break;
            case "Nuclear": 
                mul *= dEC(2, d, ["Water", "Grass", "Fighting", "Rock", "Psychic", "Crystal", "Chemical", "Explosive", "Plasma", "Spectra", "Wood"]);
                mul *= dEC(0.5, d, ["Electric", "Poison", "Mech"]);
                break;
            case "Ancient": 
                mul *= dEC(2, d, ["Air", "Dragon", "Sound", "Chemical", "Explosive", "Soul", "Shadow", "Ancient"]);
                mul *= dEC(0.5, d, ["Electric", "Light", "Metal", "Mech", "Cyber", "Magnetic"]);
                break;
            case "Physical": // dummy for secondary attack types
                break;
            case "Magical": // dummy for secondary attack types
                break;
            case "": // no element is considered here
                break;
            default:
                console.log("unknown element: " + attacking[i]);
                break;
        }
    }
    if (!(mul === 1)){
        console.log((mul > 1 ? 'Super Effective!' : 'Not very effective...'));
        console.log(mul + "x damage...   ELEMENT: " + attacking + " against " + d);
    }
    return mul;
}

function verifyElementChecks(elem){
    for (let i = 0; i < elementList.length; ++i){
        console.info("Check: " + [elementList[i]] + " was good.  (DMG: x" + checkElementEffective([elementList[i]], elem) + ")");
    }
}

function dEC(multiplier, def, check){
    if (typeVerify === true){
        for (let i = 0; i < check.length; ++i){
            if (!elementList.includes(check[i])){
                throw new Error(check[i] + " may not be a real element! [in conditional]  <" + def + ">");
            }
        }
        for (let i = 0; i < def.length; ++i){
            if (!elementList.includes(def[i])){
                throw new Error(def[i] + " may not be a real element! [in defending]  <" + def + ">");
            }
        }
    }
    let at2 = 0;
    for (let i = 0; i < check.length; ++i){
        at2++;
        if (check.includes(def[i])){
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
        if (damageList[i] === "Damage"){
            people[damageList[i+2]].extraVar.hit = damageList[i+1];
            let damage = Math.random()*100
            let crit = false
            for (let j = damageList[i+4].length - 1; j >= 0; --j){ // critical hit checker
                if (damage < damageList[i+4][j]){
                    damage = j;
                    crit = true;
                    break;
                }
            }
            if (crit === true){
                console.log(critNames[damage] + " Hit!");
                damage = damageList[i+3] * damageList[i+5][damage];
            } else {
                damage = damageList[i+3];
            }
            damage *= checkElementEffective(damageList[i+7], people[damageList[i+2]].type);
            damage *= rand(1/((damageList[i+6]/100)+1),((damageList[i+6]/100)+1));
            if (people[damageList[i+1]].sEffects.includes(19) && damageList[i+7].includes("Magical")){damage = damage * 2.5 * allInstEffect(damageList[i+1], 19, 4); console.log("Unstable Magic buff!")};
            if (people[damageList[i+1]].sEffects.includes(21) && damageList[i+7].includes("Magical")){damage = damage * (0.1 / allInstEffect(damageList[i+1], 21, 4)); console.log("Silenced nerf!")};
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
            try {
                peopleObj[damageList[i+2]].hitScript(trueDamage);
            } catch {
                throw new Error(`${damageList[i+2]} does not have a hit script! Please add a hit script to ${damageList[i+2]} in objects.js!`);
            }
            i = i + 9;
        }    
        //damageList.push("Heal", this.name, person, healing, variance, type);
        if (damageList[i] === "Heal"){
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
        if (damageList[i] === "Effect"){
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
                    case 3: 
                        people[pA].sDuration[id] += duration;
                        console.log("effect duration stacked");
                        break;
                    case 4: 
                        people[pA].sStrength[id] += strength;
                        console.log("effect strength stacked");
                        break;
                    case 5: 
                        people[pA].sDuration[id] += duration;
                        people[pA].sStrength[id] += strength;
                        console.log("effect stats stacked");
                        break;
                    case 6: 
                        people[pA].sEffects.push(effectType);
                        people[pA].sDuration.push(duration);
                        people[pA].sStrength.push(strength);
                        console.log("effect stats stacked...");
                        break;
                    default:
                        throw new Error("What do you want me to do here?? " + people[pA].name + " already has the effect " + effectList[effectType]) + ", but you are not clear what you want me to do! (Type: " + damageList[i+6] + ")";
                }
            } else {
                people[pA].sEffects.push(effectType);
                people[pA].sDuration.push(duration);
                people[pA].sStrength.push(strength);
            }
            try {
                peopleObj[damageList[i+2]].effectScript();
            } catch {
                console.warn(`${damageList[i+2]} does not have an effect script.`);
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
    if (t === 0){
        return s;
    }
    if (t === 1){
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
        case "Sine": 
            t =  Math.sin(t * Math.PI / 2) ** 2;
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
    for (let i = 0; i < music.length; ++i){
        music[i].load();
    }
    music[m].play();
}

function updateVisuals(){
    if (Zoom <= 0){console.error("Hey WTF! Who set the zoom to " + Zoom + "!?"); Zoom = 1;}
    Shake = Math.max(Shake * (ShakeDecay ** delta), 0);
    ShakeX = Shake * lerp(((Time - shakeRandomInterval) / 0.02) + 1, shakeRandomListX[0], shakeRandomListX[1], "Sine");
    ShakeY = Shake * lerp(((Time - shakeRandomInterval) / 0.02) + 1, shakeRandomListY[0], shakeRandomListY[1], "Sine");
    let dlastHP;
    let dcurrHP;
    for (let i = 0; i < peopleNames.length; ++i){
        dcurrHP = clamp(lastHP2[i] / people[peopleNames[i]].maxHealth,0,1);
        dlastHP = clamp(lastHP[i] / people[peopleNames[i]].maxHealth,0,1);
        let [left, top, width, height] = translateXY(people[peopleNames[i]].xPosition,
            people[peopleNames[i]].yPosition, 
            people[peopleNames[i]].size, 0
            );
        changeAtt(characters[i], left, top, "", "", "", "characters/" + peopleNames[i] + "/assets/" + people[peopleNames[i]].spriteState + ".svg");
        characters[i].style.transform = "translate(-50%, -50%) scale(" + (width*(people[peopleNames[i]].flip[0]?-1:1)) + "," + (width*(people[peopleNames[i]].flip[1]?-1:1)) + ") rotate(" + (people[peopleNames[i]].direction - 90) + "deg)";
        let FIL = 
        "hue-rotate(" + people[peopleNames[i]].hueChange + "deg) " + 
        "brightness(" + people[peopleNames[i]].brightness + ") " + 
        "opacity(" + people[peopleNames[i]].transparency*100 + "%) " + 
        "invert(" + people[peopleNames[i]].invert*100 + "%) " + 
        "grayscale(" + people[peopleNames[i]].grayScale*100 + "%) "
        characters[i].style['filter'] = FIL;
        characters[i].style['-webkit-filter'] = FIL;

        // update HP bars
        // ! oh my god why does it error if i tried to make this an alone array or someth9ing iudngbio
        // in.js:435 Uncaught TypeError: Cannot assign to read only property '0' of string 'hue-rotate(0deg) brightness(1) opacity(100%) invert(0%) grayscale(0%) '
        //     at updateVisuals (main.js:435:36)
        //     at gameLoop (main.js:583:9)
        // updateVisuals @ main.js:435
        // gameLoop @ main.js:583
        // requestAnimationFrame (async)
        // (anonymous) @ main.js:543
        let stupidFix = [left, top, width, height] = translateXY(
            people[peopleNames[i]].xPosition + people[peopleNames[i]].xPosHP * people[peopleNames[i]].size - (people[peopleNames[i]].sizeX * 0.5),
            people[peopleNames[i]].yPosition + people[peopleNames[i]].yPosHP * people[peopleNames[i]].size, 
            people[peopleNames[i]].sizeX * people[peopleNames[i]].sHP * people[peopleNames[i]].size, 
            8 * people[peopleNames[i]].sHP * people[peopleNames[i]].size
            );
            
        changeAtt(hpBarZ[i], stupidFix[0], stupidFix[1], stupidFix[2], stupidFix[3]);
        
        let color 
        let color2
        
        if (people[peopleNames[i]].extraInfo[0].hpBars > 1){
            let nests = people[peopleNames[i]].extraInfo[0].hpBars
            let hpI = (dcurrHP * nests) + 1;
        
            if (people[peopleNames[i]].extraInfo[0].hpBarColor[0] === "default") {
                color = people[peopleNames[i]].extraInfo[0].hpBarColor[Math.min(Math.floor(hpI), (people[peopleNames[i]].extraInfo[0].hpBarColor.length - 1))];
                if (Math.floor(hpI) < 2){
                    color2 = colorChange(color, 0.25, 1.0);
                } else {
                    color2 = people[peopleNames[i]].extraInfo[0].hpBarColor[Math.min(Math.floor(hpI), (people[peopleNames[i]].extraInfo[0].hpBarColor.length - 1)) - 1];
                }
            }

            hpBarD[i].style.zIndex = (Math.floor(dcurrHP * nests) >= Math.floor(dlastHP * nests)) ? 2 : 4
            changeAtt(hpBarC[i], "", "",                                stupidFix[2], stupidFix[3], color2);
            changeAtt(hpBarB[i], "", "",      Math.min(1, ((dlastHP * nests) - Math.floor(dcurrHP * nests))) * stupidFix[2], stupidFix[3], gRC(1, 0.9, (Math.sin(24 * Time) / 2) + 0.5));
            changeAtt(hpBarA[i], "", "",      ((dcurrHP * nests) % 1) * stupidFix[2], stupidFix[3], color);
            changeAtt(hpBarD[i], "", "",      ((dlastHP * nests) - Math.floor(dlastHP * nests)) * stupidFix[2], stupidFix[3], gRC(1, 0.9, (Math.sin(24 * Time) / 2) + 0.5));
        } else {
            
            changeAtt(hpBarC[i], "", "",           stupidFix[2], stupidFix[3], gRC(2 * dcurrHP, 0.25, 1));
            changeAtt(hpBarB[i], "", "", dlastHP * stupidFix[2], stupidFix[3], gRC(1, 0.9, (Math.sin(24 * Time) / 2) + 0.5));
            changeAtt(hpBarA[i], "", "", dcurrHP * stupidFix[2], stupidFix[3], gRC(2 * dcurrHP, 1, 1));
        }
        
        hpBarZ[i].style.border = stupidFix[3] / 2 + "px solid #181818";
        
        dcurrHP = clamp(people[peopleNames[i]].mana / people[peopleNames[i]].maxMana, 0, 1);
        
        stupidFix = translateXY(
            people[peopleNames[i]].xPosition + people[peopleNames[i]].xPosHP * people[peopleNames[i]].size - (people[peopleNames[i]].sizeX * 0.5),
            people[peopleNames[i]].yPosition + ((people[peopleNames[i]].yPosHP + 8 * people[peopleNames[i]].sHP * people[peopleNames[i]].size) * people[peopleNames[i]].size), 
            people[peopleNames[i]].sizeX * people[peopleNames[i]].sHP * people[peopleNames[i]].size, 
            4 * people[peopleNames[i]].sHP * people[peopleNames[i]].size
            );
            
        changeAtt(mpBarZ[i], stupidFix[0], stupidFix[1], stupidFix[2], stupidFix[3]);
        changeAtt(mpBarB[i], "", "", stupidFix[2], stupidFix[3], gRC(4 - (dcurrHP / 2), 0.25, 1));
        changeAtt(mpBarA[i], "", "", dcurrHP * stupidFix[2], stupidFix[3], gRC(4 - (dcurrHP / 2), 1, 1));
            
        mpBarZ[i].style.border = stupidFix[3] + "px solid #181818";
    }
}

function changeAtt(spriteID, left, top, width, height, bgColor, src){
    const sprite = spriteID
    if (!(left === "" || left === undefined)) sprite.style.left = left + 'px';
    if (!(top === "" || top === undefined)) sprite.style.top = top + 'px';
    if (!(width === "" || width === undefined)) sprite.style.width = width + 'px';
    if (!(height === "" || height === undefined)) sprite.style.height = height + 'px';
    if (!(bgColor === "" || bgColor === undefined)) sprite.style.backgroundColor = bgColor;
    if (!(src === "" || src === undefined)) sprite.src = src;
}

function updateLastHP(delta){
    let hp
    let mhp
    for (let i = 0; i < peopleNames.length; ++i){
        hp = people[peopleNames[i]].health
        mhp = people[peopleNames[i]].maxHealth
        people[peopleNames[i]].hitTimer = people[peopleNames[i]].hitTimer + delta;
        lastHP2[i] = lerp(1 - (0.0004 ** delta), lastHP2[i], hp)
        if (people[peopleNames[i]].hitTimer >= 1){
            if ((lastHP[i] - hp) > (mhp * delta * 0.25 / people[peopleNames[i]].extraInfo[0].hpBars)){
                lastHP[i] += (mhp * delta * 0.25 * ((lastHP[i] > hp) ? -1 : 1)) / people[peopleNames[i]].extraInfo[0].hpBars;
            } else {
                lastHP[i] = hp;
            }
        }
    }
}

function colorChange(color, val, sat){ // #ABCDEF format only
    if (color[0] === "#") {color = color.slice(1);}
    color = parseInt(color, 16)
    let r = ((color >> 16) % 256) / 256
    let g = ((color >> 8) % 256) / 256
    let b = (color % 256) / 256
    r = 1 - ((1 - r) * sat);
    g = 1 - ((1 - g) * sat);
    b = 1 - ((1 - b) * sat);
    r = Math.min(255, r * val * 256);
    g = Math.min(255, g * val * 256);
    b = Math.min(255, b * val * 256);
    return "#" + pad(Math.floor(r).toString(16), 2) 
               + pad(Math.floor(g).toString(16), 2) 
               + pad(Math.floor(b).toString(16), 2);
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

window.addEventListener('load', function() {
    let oldTimeStamp = 0; 

    for (let i = 0; i < peopleNames.length; i++){
        console.log(i + "   -   " + peopleNames[i])
        try {
            peopleObj[peopleNames[i]].init()
        } catch {
            console.log(`${peopleNames[i]} doesn't have anything (general) to initalize!`)
        }
        try {
            peopleObj[peopleNames[i]].defaultAct.initEI0()
        } catch {
            console.log(`${peopleNames[i]} doesn't have anything (setting) to initalize!`)
        }
        peopleObj[peopleNames[i]].defaultAct.introduction()
    }

    window.requestAnimationFrame(gameLoop);

    function gameLoop(timeStamp){
        if (done === false) {window.requestAnimationFrame(gameLoop); return;}
        delta = ((timeStamp - oldTimeStamp) / 1000) * TimeSpeed;
        const FPS = Math.round(TimeSpeed / delta);
        Time = Time + delta;
        music[musicState].volume = musicVolume;
        if (Time > shakeRandomInterval){
            shakeRandomListX.push((Math.random() - 0.5) * 2);
            shakeRandomListX.splice(0, 1);
            shakeRandomListY.push((Math.random() - 0.5) * 2);
            shakeRandomListY.splice(0, 1);
            shakeRandomInterval =  Time + 0.02;
        }
        if (Time > lastTurn){
            let alive = checkForAlive();
            if (alive[2].length === 0){currentState.ended = Infinity;} // a tie, but everyone is knocked out smh
            if (alive[2].length === 1){currentState.ended = alive[2][0];} // winning team
            if (currentState.ended === 0){
                if (people[peopleNames[turnID]].alive === true) {
                    console.log(`${peopleNames[turnID]}'s turn!`)
                    peopleObj[peopleNames[turnID]].doTurn();
                } else {
                    console.log(`${peopleNames[turnID]} died before they could get their turn!`)
                }
                turnID++;
                if (turnID >= alive[1]){
                    turnID = 0;
                    getTurnOrder(alive[0], alive[1]);
                    turnSeq++;
                }
                lastTurn = Time + timeForTurn;
            }
        }
        updateVisuals();
        updateLastHP(delta);
        // do not change
        oldTimeStamp = timeStamp;
        window.requestAnimationFrame(gameLoop);
    }
});

function comboSFX(amt, pow){
    let x = ((amt - 1) * 2) + pow
    comboSound[x].play()
}

function start(){
    //newMusic(musicState);
    done = true;
}

function checkForAlive(){
    let temp = [];
    let teamsAlive = [];
    let length = 0;
    for (let i = 0; i < peopleNames.length; ++i){
        if (people[peopleNames[i]].alive) {
            temp.push(people[peopleNames[i]]); 
            if (!teamsAlive.includes(people[peopleNames[i]].team)){
                teamsAlive.push(people[peopleNames[i]].team)
            }
            length++;
        }
    }
    return [temp, length, teamsAlive];
}

function getTurnOrder(list, len){
    for (let i = 0; i < peopleNames.length; ++i){
        people[peopleNames[i]].updateSTATEffects()
    }
    turnOrder = [];
    for (let i = 0; i < len; ++i){
        turnOrder.push(list[i]);
    }
    turnOrder = turnOrder.sort((a, b) => b.trueSpd - a.trueSpd);
}
