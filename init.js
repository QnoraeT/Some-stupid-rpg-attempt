"use strict";

let canvasSize = { width: 0, height: 0 };

window.addEventListener('resize', resize);

function resize() {
    canvasSize.width = 0;
    canvasSize.height = 0;
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;
}

function translateXY(x, y, xs, ys) {
    return [
        (canvasSize.width / 2) + ((x - CamX + ShakeX) / Zoom),
        (canvasSize.height / 2) + ((-y - CamY + ShakeY) / Zoom),
        xs / Zoom,
        ys / Zoom,
    ];
}

let CamX = 0;
let CamY = 0;
let Zoom = 1;
let Shake = 0;
let ShakeDecay = 0.002;
let ShakeX = 0;
let ShakeY = 0;
let Time = 0;
let delta = 0;
let TimeSpeed = 1;
let damageList = [];
let damageIndicatorList = []; 
const CRIT_COLOR = ["FF0000", "800000", "8000FF", "FF00FF", "FFFF00", "FF6000", "FF0060", "FFFF80"]

function makeDamageIndicator(text, size, color, xvel, yvel, duration, xpos, ypos) {
    damageIndicatorList.push([text, size, color, xvel, yvel, 0, duration, xpos, ypos])
}

let musicVolume = 1.00;
let sfxVolume = 0.30;
let typeVerify = true; // checks if any of the elements in the type effectiveness calculator is correct
let done = false
const EFFECT_LIST = ["Burn", "Poison", "Sunstroke", "Paralyze", "Sleep", "Freeze", "Confusion", "Strange", "Crying", "Ichor", "Ironskin", "Light Shield", "Revitalize", "Energize", "Dazed", "Focus", "Taunt", "Slow", "Fast", "Unstable Magic", "Bad Poison", "Silence", "Strong", "Weak", "Bleed"];
const MUSIC = [
    new Audio('music/forget not (shortened).mp3'),
    new Audio('music/something with danidanijr V3.6 NO ARTS.mp3'),
    new Audio('music/Kanakana Shigure.mp3'),
    new Audio('music/something with danidanijr v5.1.mp3')
];
const CRITICAL_HIT_NAMES = ["Critical", "Deadly", "Super", "Ultra", "Hyper", "EXTREME", "ULTIMATE", "HOLY"];
const ELEMENT_LIST = ["Normal", "Water", "Fire", "Grass", "Electric", "Ice", "Air", "Dark", "Light", "Earth", "Fighting", "Poison", "Insect", "Rock", "Metal", "Spirit", "Psychic", "Dragon", "Mystic", "Sound", "Crystal", "Mech", "Time", "Chemical", "Explosive", "Magic", "Plasma", "Volcanic", "Glass", "Virus", "Cyber", "Celestial", "Cosmic", "Magnetic", "Spectra", "Wood", "Soul", "Shadow", "Nuclear", "Ancient"]

/*
const comboSound = [];

for (let i = 1; i <= 16; ++i){
    comboSound.push(new Sound('sfx/combo_' + i + '.mp3'));
    comboSound.push(new Sound('sfx/combo_' + i + '_power.mp3'));
}
*/

const sfxMP3 = [];
for (let i = 0; i <= 3; ++i) {
    sfxMP3.push(new Sound('sfx/sfx' + i + '.mp3'));
    sfxMP3[i].load();
}
/*
sfx0.mp3 = roblox banana
sfx1.mp3 = pokemon poison 
sfx2.mp3 = roblox coil
sfx3.mp3 = IT HIT RIGHT IN THE HEART! (Omori)

*/
const sfxWAV = [];
for (let i = 0; i <= 4; ++i) {
    sfxWAV.push(new Sound('sfx/sfx' + i + '.wav'));
    sfxWAV[i].load();
}
/*
sfx0.wav = kirby hit
sfx1.wav = super punch
sfx2.wav = extended hit
sfx3.wav = hit slowdown
sfx4.wav = charging

*/
let GLOBAL_ID = 0
let musicState = 1;
let musicUpdate = 0;
let peopleNames = [];
let turnOrder = [];
let lastHP = [];
let lastHP2 = [];
let shakeRandomListX = [0, 1];
let shakeRandomListY = [0, 1];
let shakeRandomInterval = 0;
let turnSeq = 0;
let turns = 0;
let timeForTurn = 5.00;
let lastTurn = 0;
let turnID = 0;
let logLevel = 0;
let loadedPeopleObj = false;
let currentState = {
    ended: 0
}

let characters = [];
let hpBarZ = [];
let hpBarA = [];
let hpBarB = [];
let hpBarC = [];
let hpBarD = [];
let mpBarZ = [];
let mpBarA = [];
let mpBarB = [];


for (let i = 0; i < MUSIC.length; ++i) {
    MUSIC[i].loop = true;
}

function makeCharacter(params) {
    GLOBAL_ID++
}

function allInstEffect(person, id, type, second = 0) { // gets all Instances of effects
    let k = (type === 5 || type === 4) ? 1 : 0
    for (let i = 0; i < people[person].sEffects.length; ++i) {
        if (people[person].sEffects[i] === id) {
            switch (type) {
                case 0:
                    k++;
                    break;
                case 1:
                    k += (people[person].sDuration[i] * people[person].sStrength[i][second] / people[person].maxHealth); // >= 1.00 if the effect will kill them 
                    break;
                case 2:
                    k += ((people[person].sDuration[i] ** 2) * people[person].sStrength[i][second] / people[person].maxHealth); // bad poison
                    break;
                case 3:
                    k += ((1 - (1 / (people[person].sDuration[i] + 1))) / people[person].sStrength[i][second]); // ! don't use pls
                    break;
                case 4:
                    k *= ((1 - (1 / (people[person].sDuration[i] + 1))) * (1 + people[person].sStrength[i][second]));
                    break;
                case 5:
                    k *= people[person].sStrength[i][second];
                    break;
                default:
                    throw new Error(`no. id ${type}`)
            }
        }
    }
    if (type === 5 || type === 4) { k--; }
    return k
}

function xp(base, lvl, type) {
    let xpLevel = base / 10;
    switch (type) {
        case 0:
            xpLevel *= 0.79 * (lvl ** 3) + 0.92 * (lvl ** 2) + 8 * lvl
            break;
        case 1:
            xpLevel *= 0.99 * (lvl ** 3) + 0.9 * (lvl ** 2) + 10.02 * lvl - 1.91
            break;
        case 2:
            xpLevel *= 1.23 * (lvl ** 3) + 1.9 * (lvl ** 2) + 10.03 * lvl - 3.16
            break;
        case 3:
            xpLevel *= 1.48 * (lvl ** 3) + 1.88 * (lvl ** 2) + 12.03 * lvl - 3.39
            break;
        case 4:
            xpLevel *= 1.98 * (lvl ** 3) + 1.85 * (lvl ** 2) + 15.04 * lvl - 3.87
            break;
        default:
            throw new Error(`invalid xp type: ${type}`)
    }
    return xpLevel
}
class Character {
    constructor(name, lvl, temp, XPos, YPos, size, XOffsetHP, YOffsetHP, SizeOffsetHP, [baseXPReq, xpType], xp, baseHP, baseMP, elem, basePATK, basePDEF, baseMATK, baseMDEF, baseSPD, hpType, personType, team, sizeX, sizeY) {
        this.temporary = temp[0]
        if (temp[0] === true) {
            this.jsonType = temp[1]
        } else {
            this.jsonType = name
        }
        this.name = name;
        let lf = lvl - 1;
        //lf = (((lf + ((lf ** 2) / 15) + ((lf ** 3) / 120)) ** (1 + (lf / 240))) + 8) / 8;
        lf = ((lf + ((lf ** 2) / 200)) + 16) / 16 * (1 + 0.0321 * (Math.floor(lf / 4))) * (1 + 0.04 * (Math.floor(lf / 10))) * (1 + 0.075 * (Math.floor(lf / 50)));
        this.level = lvl;
        this.animations = [];
        this.baseXPos = XPos;
        this.baseYPos = YPos;
        this.xPosition = XPos;
        this.yPosition = YPos;
        this.size = size;
        this.xPosHP = XOffsetHP;
        this.yPosHP = YOffsetHP;
        this.sHP = SizeOffsetHP;
        this.xp = xp;
        this.xpLevel = baseXPReq / 10;
        switch (xpType) {
            case 0:
                this.xpLevel *= 0.79 * (lvl ** 3) + 0.92 * (lvl ** 2) + 8 * lvl
                break;
            case 1:
                this.xpLevel *= 0.99 * (lvl ** 3) + 0.9 * (lvl ** 2) + 10.02 * lvl - 1.91
                break;
            case 2:
                this.xpLevel *= 1.23 * (lvl ** 3) + 1.9 * (lvl ** 2) + 10.03 * lvl - 3.16
                break;
            case 3:
                this.xpLevel *= 1.48 * (lvl ** 3) + 1.88 * (lvl ** 2) + 12.03 * lvl - 3.39
                break;
            case 4:
                this.xpLevel *= 1.98 * (lvl ** 3) + 1.85 * (lvl ** 2) + 15.04 * lvl - 3.87
                break;
            default:
                throw new Error(`invalid xp type: ${xpType}`)
        }
        this.base = {
            hp: baseHP,
            mp: baseMP,
            patk: basePATK,
            matk: baseMATK,
            pdef: basePDEF,
            mdef: baseMDEF,
            spd: baseSPD,
            xp: baseXPReq,
            xpt: xpType
        }
        this.EVs = {
            hp: 0,
            mp: 0,
            patk: 0,
            matk: 0,
            pdef: 0,
            mdef: 0,
            spd: 0
        }
        this.maxHealth = baseHP * lf;
        this.health = this.maxHealth;
        this.maxMana = baseMP * lf;
        this.mana = this.maxMana;
        this.PATK = basePATK * lf;
        this.PDEF = basePDEF * lf;
        this.MATK = baseMATK * lf;
        this.MDEF = baseMDEF * lf;
        this.spd = baseSPD * lf;
        this.truePATK = this.PATK;
        this.truePDEF = this.PDEF;
        this.trueMATK = this.MATK;
        this.trueMDEF = this.MDEF;
        this.trueSpd = this.spd;
        this.HPtype = hpType;
        this.type = elem;
        this.status = personType;
        this.team = team;
        this.target = "";
        this.sEffects = [];
        this.sDuration = [];
        this.sStrength = [];
        this.spriteState = "Idle1";
        this.extraInfo = [{}] // first item must ALWAYS be an object for customization
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.SuperPower = 0;
        this.SuperPowerMax = 100;
        this.GigaPower = 0;
        this.GigaPowerMax = 100;
        this.HyperPower = 0;
        this.HyperPowerMax = 100;
        this.hitTimer = 1;
        this.trueDDef = 1;
        this.truePDef = 1;
        this.brightness = 1.00; // brightness
        this.transparency = 1.00; // opac
        this.hueChange = 0; // degrees
        this.direction = 90; //angle 90 = right, 0 = up, -90 = left, -180/180 = down
        this.invert = 0.00;
        this.grayScale = 0.00;
        this.flip = [1, 1] // array[0] = horizontal flip, array[1] = vertical flip, -1 = flip, 1 = normal
        lastHP.push(this.health);
        lastHP2.push(this.health);
        peopleNames.push(this.name);
        this.alive = true;
        this.action = [];
        this.extraVar = {
            "hit": null
        };
        this.fullInit()
        let i = peopleNames.indexOf(this.name)
        let htmlname = "character" + i;
        const char = document.createElement("img");
        const MAIN = document.getElementById("characters");
        char.id = htmlname;
        MAIN.appendChild(char);
        document.getElementById(htmlname).classList.add("character" + i);
        document.getElementById(htmlname).classList.add("character");
        characters.push(document.getElementById(htmlname));
    
        const hpCon = document.createElement("div");
        htmlname = "hp" + i + "-container";
        hpCon.id = htmlname;
        MAIN.appendChild(hpCon);
        document.getElementById(htmlname).classList.add("bar-container");
        document.getElementById(htmlname).classList.add("bar");
        hpBarZ.push(document.getElementById(htmlname));
    
        const hpA = document.createElement("div");
        htmlname = "hp" + i + "a";
        hpA.id = htmlname;
        hpCon.appendChild(hpA);
        document.getElementById(htmlname).classList.add("fill");
        hpBarA.push(document.getElementById(htmlname));
    
        const hpB = document.createElement("div");
        htmlname = "hp" + i + "b";
        hpB.id = htmlname;
        hpCon.appendChild(hpB);
        document.getElementById(htmlname).classList.add("last");
        hpBarB.push(document.getElementById(htmlname));
    
        const hpD = document.createElement("div");
        htmlname = "hp" + i + "d";
        hpD.id = htmlname;
        hpCon.appendChild(hpD);
        document.getElementById(htmlname).classList.add("last");
        hpBarD.push(document.getElementById(htmlname));
    
        const hpC = document.createElement("div");
        htmlname = "hp" + i + "c";
        hpC.id = htmlname;
        hpCon.appendChild(hpC);
        document.getElementById(htmlname).classList.add("empty");
        hpBarC.push(document.getElementById(htmlname));
    
        const mpCon = document.createElement("div");
        htmlname = "mp" + i + "-container";
        mpCon.id = htmlname;
        MAIN.appendChild(mpCon);
        document.getElementById(htmlname).classList.add("bar-container");
        document.getElementById(htmlname).classList.add("bar");
        mpBarZ.push(document.getElementById(htmlname));
    
        const mpA = document.createElement("div");
        htmlname = "mp" + i + "a";
        mpA.id = htmlname;
        mpCon.appendChild(mpA);
        document.getElementById(htmlname).classList.add("fill");
        mpBarA.push(document.getElementById(htmlname));
    
        const mpB = document.createElement("div");
        htmlname = "mp" + i + "b";
        mpB.id = htmlname;
        mpCon.appendChild(mpB);
        document.getElementById(htmlname).classList.add("empty");
        mpBarB.push(document.getElementById(htmlname));
    }

    updateSTATEffects() {
        this.truePATK = this.PATK;
        this.truePDEF = this.PDEF;
        this.trueMATK = this.MATK;
        this.trueMDEF = this.MDEF;
        this.trueSpd = this.spd;
        this.trueDDef = 1;
        this.truePDef = 1;
        let attempts = 0;
        for (let i = 0; i < this.sEffects.length; ++i) {
            if (attempts > 10000) {
                throw new Error(`Hey! Something went wrong! I can't process this! (attempted status effects ${attempts} times)`);
            }
            if (logLevel >= 1) { console.log(`Processing Effect Type: ${EFFECT_LIST[this.sEffects[i]]} with duration ${this.sDuration[i]} and strength ${this.sStrength[i][0]} ...`); }
            attempts++
            switch (this.sEffects[i]) {
                case 1:
                    this.trueSpd *= allInstEffect(this.name, 1, 5, 1);
                    this.truePDEF *= 0.8
                    this.trueDDef *= 0.8
                    break;
                case 2:
                    this.trueSpd *= 0.8
                    this.truePDEF *= 0.8
                    break;
                case 3:
                    this.trueSpd *= 0.5
                    break;
                case 4:
                    try {
                        if (this.sStrength[i] < this.extraInfo[0].effectModifiers.sleep.limit) {
                            if (logLevel >= 1) { console.log(`${this.name} resists! STR: ${this.sStrength[i].tofixed(2)} / ${this.extraInfo[0].effectModifiers.sleep.limit.tofixed(2)}`); }
                            this.trueSpd *= 1 - Math.sqrt(this.sStrength[i] / this.extraInfo[0].effectModifiers.sleep.limit)
                            break;
                        }
                    } catch {
                        if (logLevel >= 1) { console.log(`${this.name} doesn't have an effect modifier with sleep effect strength limit.`); }
                    }
                    this.trueSpd = 0
                    this.trueDDef *= 0.667
                    break;
                case 5:
                    this.trueSpd = 0
                    this.trueDDef *= 2
                    break;
                case 6:
                    this.trueSpd *= 0.8
                    break;
                case 7:
                    this.trueSpd *= 0.667
                    break;
                case 8:
                    this.trueSpd *= 0.75
                    this.truePDEF *= 0.75
                    break;
                case 9:
                    this.truePDEF *= 0.75
                    this.trueDDef *= 0.75
                    break;
                case 10:
                    this.trueMDEF *= 1.5
                    this.trueDDef *= 1.5
                    break;
                case 11:
                    this.trueDDef *= 1.667
                    break;
                case 14:
                    this.trueSpd *= 0.5
                    break;
                case 15:
                    this.trueSpd *= 1.333
                    this.trueMATK *= 1.75
                    this.truePATK *= 1.5
                    break;
                case 16:
                    this.truePATK *= 1.5
                    this.trueMATK *= 1.333
                    this.trueSpd *= 1.333
                    this.trueDDef *= 0.667
                    break;
                case 17:
                    this.trueSpd *= 0.667
                    break;
                case 18:
                    this.trueSpd *= 1.5
                    break;
                case 20:
                    this.trueSpd *= 0.75
                    break;
                case 22:
                    this.truePATK *= 1.5
                    this.trueMATK *= 1.333
                    break;
                case 23:
                    this.truePATK *= 0.667
                    this.trueMATK *= 0.8
                    break;
                default:
                    // only special effects played here. Move on!
                    break;
            }
        }
    }

    tickStatusEffects() {
        let attempts = 0;
        let mod = 0.0;
        for (let i = 0; i < this.sEffects.length; ++i) {
            if (attempts > 10000) {
                throw new Error("Hey! Something went wrong! I can't process this!");
            }
            if (logLevel >= 1) { console.log("Processing Effect Type: " + EFFECT_LIST[this.sEffects[i]] + " with duration " + this.sDuration[i] + " and strength " + this.sStrength[i][0] + "..."); }
            attempts++
            switch (this.sEffects[i]) {
                case 0:
                    this.damage(this.name, this.sStrength[i][0], [0], [1], 10, ["Fire", "Physical"], 1, true);
                    allInQueue();
                    break;
                case 1:
                    this.damage(this.name, this.sStrength[i][0], [0], [1], 10, ["Poison", "Physical"], 1, true);
                    allInQueue();
                    break;
                case 2:
                    this.damage(this.name, this.sStrength[i][0], [0], [1], 10, ["Normal", "Physical"], 1, true);
                    allInQueue();
                    break;
                case 4:
                    try {
                        if (this.sStrength[i][0] < this.extraInfo[0].effectModifiers.sleep.limit) {
                            if (logLevel >= 1) { console.log(`${this.name} resists! STR: ${this.sStrength[i][0].toFixed(2)} / ${this.extraInfo[0].effectModifiers.sleep.limit.toFixed(2)}`); }
                            break;
                        }
                    } catch {
                        if (logLevel >= 1) { console.log(`${this.name} doesn't have an effect modifier with sleep effect strength limit.`); }
                    }
                    try {
                        mod = this.extraInfo[0].effectModifiers.sleep.regenAmtDiv
                    } catch {
                        if (logLevel >= 1) { console.log(`${this.name} doesn't have an effect modifier with sleep effect strength regen. Defaulting to 40.`); }
                        mod = 40
                    }
                    this.heal(this.name, [this.maxHealth * this.sStrength[i][0] / mod], 10, ["Normal", "Physical"]);
                    allInQueue();
                    break;
                case 12:
                    this.heal(this.name, [this.sStrength[i][0]], 10, ["Normal", "Physical"]);
                    allInQueue();
                    break;
                case 13:
                    this.heal(this.name, [0, this.sStrength[i][0]], 10, ["Normal", "Physical"]);
                    allInQueue();
                    break;
                case 19:
                    this.damage(this.name, this.sStrength[i][0], [0], [1], 10, ["Magic", "Magical"], 1, true); // this causes an unstable magic buff on it's own effect. leave it in as a quirk?
                    allInQueue();
                    break;
                case 20:
                    this.damage(this.name, this.sStrength[i][0] * this.sDuration[i], [0], [1], 10, ["Poison", "Physical"], 1, true);
                    // this works differently than in pokemon!
                    // this damage decays over time instead of increasing, but is still much stronger than the normal poison variant
                    allInQueue();
                    break;
                case 24:
                    if (this.extraInfo[0].blood) {
                        this.damage(this.name, this.sStrength[i][0], [0], [1], 10, ["Normal", "Physical"], 1, true);
                        allInQueue();
                        break;
                    } else {
                        console.log(`Bleed has no effect to ${this.name}...`)
                    }
                default:
                    // no HP/MP effect played here. Move on!
                    break;
            }
            this.sDuration[i]--
            if (this.sDuration[i] <= 0) {
                // remove all effects with durations <= 1
                console.log(EFFECT_LIST[this.sEffects[i]] + " wore off!")
                this.sEffects.splice(i, 1);
                this.sDuration.splice(i, 1);
                this.sStrength.splice(i, 1);
                i--
            }
        }
        this.updateSTATEffects()
    }

    damage(person, attack, critchance, critdmg, variance, type, ignoreDEF, effectBool = false, dmgIndicator = ["", 32, "#FFFFFF", rand(200, 300) * (Math.round(Math.random()) - 0.5), rand(300, 450), 0.75]) {
        // crit chance (%) and crit dmg (x) are arrays!
        // they determine when a certain crit type happens!
        // example: CritChance = [10, 2, 0.1]
        // example: CritDmg = [2.3, 3.5, 45]
        // lowest crit chance goes first, so check 0.1% with 45x. 
        // if it doesn't trigger, then 2% with 3.5x is tested
        // if it doesn't trigger, then 10% with 2.3x is tested
        // if it doesn't trigger, then no more crit functions will be checked for this attack.
        // example input:
        // damage("TearonQ", 35, [10, 2, 0.1], [2.3, 3.5, 45], 12, ["Normal", "Physical"], 0, false)
        /*
        this deals an average of 35 damage to "TearonQ", 
        with a 10% chance of hitting for 2.3x damage
        with a 2% chance of hitting for 3.5x damage
        and with a 0.1% chance of hitting for 45x damage, 
        with 12% variance, 
        of the "Normal" and "Physical" types, 
        without ignoring any type of defense, 
        and that it is not damage caused by effects.
        */
        damageList.push("Damage", this.name, person, attack, critchance, critdmg, variance, type, ignoreDEF, effectBool, dmgIndicator);
    }

    heal(person, healing, variance, type) {
        // "healing" is an array!
        // order goes like this: HP, MP, SP, GP, HP
        // items with index >= 5 should be ignored
        damageList.push("Heal", this.name, person, healing, variance, type);
    }

    giveStatusEffect(person, id, duration, strength, overwrite) {
        if (!Array.isArray(strength)) { throw new TypeError(`strength (${strength}) must be an array! (Multiple factors could effect other people/characters!)`); }
        damageList.push("Effect", this.name, person, id, duration, strength, overwrite);
    }

    fullInit() {
        let idea = this.name
        console.log(idea)
        let timeasgaf
        timeasgaf = setInterval(gfg_function, 1000);
        function gfg_function() {

            Object.assign(peopleObj[idea], {defaultAct: objectBasics(people[idea])})

            try {
                peopleObj[idea].init();
                peopleObj[idea].defaultAct.introduction();
                clearInterval(timeasgaf)
            } catch(e) {
                console.log(e)
                console.log(`${idea} doesn't have anything (general) to initalize!`);
            }
    
            try {
                console.log(idea)
                peopleObj[idea].defaultAct.initEI0();
                clearInterval(timeasgaf)
            } catch(e) {
                console.log(e)
                console.log(`${idea} doesn't have anything (setting) to initalize!`);
            }
        }
        
    }

    levelUp() {
        if (this.xp < this.xpLevel) {
            return;
        }
        for (let att = 0; this.xp >= this.xpLevel; att++) {
            if (att >= 100000) { throw new Error("levelling up took too long") }
            this.level++
            console.log(`${this.name} leveled up to [ ${this.level} ] !`)
            this.xpLevel = xp(this.base.xp, this.level, this.base.xpt);
            let m = this.getLvlChange(this.level, this.base.hp, this.maxHealth, "Maximum HP", "hp")
            this.maxHealth += m
            this.health += m
            m = this.getLvlChange(this.level, this.base.mp, this.maxMana, "Maximum MP", "mp")
            this.maxMana += m
            this.mana += m
            this.PATK += this.getLvlChange(this.level, this.base.patk, this.PATK, "Strength", "patk")
            this.MATK += this.getLvlChange(this.level, this.base.matk, this.MATK, "Wisdom", "pdef")
            this.PDEF += this.getLvlChange(this.level, this.base.pdef, this.PDEF, "Endurance", "matk")
            this.MDEF += this.getLvlChange(this.level, this.base.mdef, this.MDEF, "Resistance", "mdef")
            this.spd += this.getLvlChange(this.level, this.base.spd, this.spd, "Speed", "spd")
            // EWW formatting
            console.log(`HP:     ${this.maxHealth}
MP:     ${this.maxMana}
PATK:   ${this.PATK}
MATK:   ${this.MATK}
PDEF:   ${this.PDEF}
MDEF:   ${this.MDEF}
SPD:    ${this.spd}`)
        }
        console.log(`XP: ${format(this.xp - xp(this.base.xp, this.level - 1, this.base.xpt), 0, 100000)} / ${format(this.xpLevel - xp(this.base.xp, this.level - 1, this.base.xpt), 0, 100000)}`)
    }

    getLvlChange(lv, stat, cStat, statName, ev) {
        let lf = lv - 1
        lf = (((lf * 21 / 22) + ((lf ** 2) / 198)) + 16) / 16 * (1 + 0.02 * (Math.floor(lv / 4))) * (1 + (Math.floor(lv / 10)) / 15) * (1 + 0.1 * (Math.floor(lv / 50)));
        let change
        change = (stat * lf * this.calcEVs(this.EVs[ev])) - cStat
        if (lv % 25 !== 0) {
            change *= (Math.random() * 0.75) + 0.25
        }
        change = Math.round(Math.max(0, change))
        if (change > 0) { console.log(`${statName} increased by ${change} !`) }
        return change
    }

    calcEVs(ev) {
        return 1 + Math.sqrt(ev) / 2048;
    }
}

for (let i = 0; i < MUSIC.length; ++i) {
    MUSIC[i].load();
}

let people = {
    //                                                        Lv  Temporary?   XPos  YPos  Size   HPX HPY  HPS    XPR   XPT   XPS   BaseHP  BaseMP Type(s)                 PATK    PDEF   MATK    MDEF  BSpd  HPType    PersonType    Team  Xscale Yscale
       "FSBlue":             new Character("FSBlue",          1,  [false],     150,  150,  4 / 3, -5, 90,  3 / 4, [15,   4],  [0],  45,     3,     ["Fighting"],           35,     33,    9,      13,   20,   "Normal", "Player",     0,    128,   256),
    // "Alterian Skyler":    new Character("Alterian Skyler", 1,  [false],     150,  150,  1,     -5, 120, 1,     [10,   2],  [0],  100,    15,    ["Electric"],           15,     0,     27,     26,   22,   "Normal", "Player",     0,    128,   256),
    // "ToWM TowerSB":       new Character("ToWM TowerSB",    1,  [false],    -200, -100,  1,     -5, 110, 1,     [12,   1],  [0],  20,     12,    ["Normal"],             25,     15,    24,     16,   16,   "Normal", "Player",     0,    128,   256),
    // "ToFUN TowerSB":      new Character("ToFUN TowerSB",   1,  [false],    -125, -125,  1,     -5, 120, 1,     [ 8,   0],  [0],  35,     10,    ["Normal"],             28,     30,    19,     15,   16,   "Normal", "Player",     0,    128,   256),
    // "Delet Ball":         new Character("Delet Ball",      1,  [false],     200, -100,  1,     -5, 60,  1,     [120,  3],  [0],  960,    160,   ["Dark"],               30,     12,    30,     12,   20,   "Normal", "Boss",       1,    128,   128),
}

const draw = document.querySelector("#effects");
const pen = draw.getContext("2d");

const drawing = () => {
    // ! freakin spaghetti ahh code ;_;
    draw.width = window.innerWidth;
    draw.height = window.innerHeight;
    let currentDI;
    let di = [];
    let fs = 0;
    for (let i = 0; i < damageIndicatorList.length; i++) {
        currentDI = damageIndicatorList[i];
        di = translateXY(currentDI[7], currentDI[8], currentDI[1], 0);
        fs = di[2]
        console.log(currentDI[2])
        pen.fillStyle = currentDI[2];

        if (currentDI[5] <= currentDI[6] * 0.2) {
            fs = lerp(5 * (currentDI[5] / currentDI[6]), 2 * di[2], di[2], "CubeOut");
        }

        if (currentDI[5] >= currentDI[6] * 0.8) {
            fs = lerp(5 * (currentDI[5] / currentDI[6] - 0.8), di[2], 0);
        }

        pen.font = `${fs}px Trebuchet MS, sans-serif`;
        pen.textAlign = "center";

        pen.fillText(currentDI[0], di[0], di[1]);

        if (currentDI[5] >= currentDI[6]) {
            damageIndicatorList.splice(i, 1);
            i--;
        } else {
            currentDI[5] += delta; // timer
            currentDI[7] += currentDI[3] * delta; // xpos
            currentDI[3] = lerp(1 - (0.5 ** delta), currentDI[3], 0); // xpos expo to 0
            currentDI[4] -= 500 * delta; // decrease yv
            currentDI[8] += currentDI[4] * delta; // ypos
            currentDI[4] -= 500 * delta; // decrease yv
        }
    }
}

// for (let i = 0; i < peopleNames.length; i++) {
//     let name = "character" + i;
//     const char = document.createElement("img");
//     const MAIN = document.getElementById("characters");
//     char.id = name;
//     MAIN.appendChild(char);
//     document.getElementById(name).classList.add("character" + i);
//     document.getElementById(name).classList.add("character");
//     characters.push(document.getElementById(name));

//     const hpCon = document.createElement("div");
//     name = "hp" + i + "-container";
//     hpCon.id = name;
//     MAIN.appendChild(hpCon);
//     document.getElementById(name).classList.add("bar-container");
//     document.getElementById(name).classList.add("bar");
//     hpBarZ.push(document.getElementById(name));

//     const hpA = document.createElement("div");
//     name = "hp" + i + "a";
//     hpA.id = name;
//     hpCon.appendChild(hpA);
//     document.getElementById(name).classList.add("fill");
//     hpBarA.push(document.getElementById(name));

//     const hpB = document.createElement("div");
//     name = "hp" + i + "b";
//     hpB.id = name;
//     hpCon.appendChild(hpB);
//     document.getElementById(name).classList.add("last");
//     hpBarB.push(document.getElementById(name));

//     const hpD = document.createElement("div");
//     name = "hp" + i + "d";
//     hpD.id = name;
//     hpCon.appendChild(hpD);
//     document.getElementById(name).classList.add("last");
//     hpBarD.push(document.getElementById(name));

//     const hpC = document.createElement("div");
//     name = "hp" + i + "c";
//     hpC.id = name;
//     hpCon.appendChild(hpC);
//     document.getElementById(name).classList.add("empty");
//     hpBarC.push(document.getElementById(name));

//     const mpCon = document.createElement("div");
//     name = "mp" + i + "-container";
//     mpCon.id = name;
//     MAIN.appendChild(mpCon);
//     document.getElementById(name).classList.add("bar-container");
//     document.getElementById(name).classList.add("bar");
//     mpBarZ.push(document.getElementById(name));

//     const mpA = document.createElement("div");
//     name = "mp" + i + "a";
//     mpA.id = name;
//     mpCon.appendChild(mpA);
//     document.getElementById(name).classList.add("fill");
//     mpBarA.push(document.getElementById(name));

//     const mpB = document.createElement("div");
//     name = "mp" + i + "b";
//     mpB.id = name;
//     mpCon.appendChild(mpB);
//     document.getElementById(name).classList.add("empty");
//     mpBarB.push(document.getElementById(name));
// }

resize();
