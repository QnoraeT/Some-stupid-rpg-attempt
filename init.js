"use strict";
let canvasSize = {width: 0, height: 0};

window.addEventListener('resize', resize);
    
function resize(){
    canvasSize.width = 0;
    canvasSize.height = 0;
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;
    /*
        var h = 640;
        var width = window.innerWidth || document.body.clientWidth; 
        var height = window.innerHeight || document.body.clientHeight; 
        var ratio = height / h;
        var newWidth = (width / ratio);
        canvasSize.width = newWidth;
        canvasSize.height = h;
        console.log(canvasSize);
    */
}

let CamX = 0;
let CamY = 0;
let Zoom = 1;
let Shake = 0;
let ShakeDecay = 0.1;
let ShakeX = 0;
let ShakeY = 0;
let Time = 0;
let delta = 0;
let TimeSpeed = 1;
let damageList = [];
let damageIndicatorList = [];
let musicVolume = 1.00;
let sfxVolume = 0.30;
let typeVerify = true; // checks if any of the elements in the type effectiveness calculator is correct
let done = false
const effectList = ["Burn", "Poison", "Sunstroke", "Paralyze", "Sleep", "Freeze", "Confusion", "Strange", "Crying", "Ichor", "Ironskin", "Light Shield", "Revitalize", "Energize", "Dazed", "Focus", "Taunt", "Slow", "Fast", "Unstable Magic", "Bad Poison", "Silence", "Strong", "Weak"];
const music = [new Audio('music/forget not (shortened).mp3'), new Audio('music/something with danidanijr V3.6 NO ARTS.mp3')];
const critNames = ["Critical", "Deadly", "Super", "Ultra", "Hyper", "EXTREME", "ULTIMATE", "HOLY"];
const elementList = ["Normal", "Water", "Fire", "Grass", "Electric", "Ice", "Air", "Dark", "Light", "Earth", "Fighting", "Poison", "Insect", "Rock", "Metal", "Spirit", "Psychic", "Dragon", "Mystic", "Sound", "Crystal", "Mech", "Time", "Chemical", "Explosive", "Magic", "Plasma", "Volcanic", "Glass", "Virus", "Cyber", "Celestial", "Cosmic", "Magnetic", "Spectra", "Wood", "Soul", "Shadow", "Nuclear", "Ancient"]
/*const comboSound = [];

for (let i = 1; i <= 16; ++i){
    comboSound.push(new Audio('sfx/combo_' + i + '.mp3'));
    comboSound.push(new Audio('sfx/combo_' + i + '_power.mp3'));
}*/

/*const sfxMP3 = [];
for (let i = 0; i < 1; ++i){
    sfxMP3.push(new Audio('sfx/sfx' + i + '.mp3'));
}*/

/*const sfxWAV = [];
for (let i = 0; i < 3; ++i){
    sfxWAV.push(new Audio('sfx/sfx' + i + '.wav'));
}*/

let musicState = 0;
let musicUpdate = 0;
let peopleNames = [];
let turnOrder = [];
let lastHP = [];
let shakeRandomListX = [0, 1];
let shakeRandomListY = [0, 1];
let shakeRandomInterval = 0;

for (let i = 0; i < music.length; ++i){
    music[i].loop = true;
}

class Character {
    constructor(name, lvl, XPos, YPos, size, XOffsetHP, YOffsetHP, SizeOffsetHP, baseXPReq, xp, baseHP, baseMP, elem, baseATK, baseDEF, baseSPD, hpType, personType, team, sizeX, sizeY){
        this.name = name;
        let lf = lvl - 1;
        lf = (((lf + ((lf ** 2) / 15) + ((lf ** 3) / 120)) ** (1 + (lf / 250))) + 8) / 8;
        this.level = lvl;
        this.xPosition = XPos;
        this.yPosition = YPos;
        this.size = size;
        this.xPosHP = XOffsetHP;
        this.yPosHP = YOffsetHP;
        this.sHP = SizeOffsetHP;
        this.expPoints = xp;
        this.nextLv = baseXPReq * ( lf ** 1.5 );
        this.maxHealth = baseHP * lf;
        this.health = this.maxHealth;
        this.maxMana = baseMP * lf;
        this.mana = this.maxMana;
        this.atk = baseATK * lf;
        this.def = baseDEF * lf;
        this.spd = baseSPD * ( lf ** 0.1 );
        this.trueAtk = this.atk;
        this.trueDef = this.def;
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
        this.extraInfo = ["", "", 100] // who hit me?, who healed me?, my mood;
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
        this.flip = [false, false] // [0] = horizontal flip, [1] = vertical flip
        lastHP.push(this.health);
        peopleNames.push(this.name);
    }

    updateSTATEffects(){
        // ["Burn", "Poison", "Sunstroke", "Paralyze", "Sleep", "Freeze", "Confusion", "Strange", "Crying",
        // "Ichor", "Ironskin", "Light Shield", "Revitalize", "Energize", "Dazed", "Focus", "Taunt", "Slow"
        // "Fast", "Unstable Magic", "Bad Poison", "Silence", "Strong", "Weak"];
        let mod;
        mod = 1;
        if (this.sEffects.includes(16)) mod *= 1.667
        if (this.sEffects.includes(21)) mod *= 1.75
        if (this.sEffects.includes(22)) mod *= 0.6
        this.trueAtk = this.atk * mod;
        mod = 1;
        if (this.sEffects.includes(9)) mod *= 0.6
        if (this.sEffects.includes(10)) mod *= 1.333
        if (this.sEffects.includes(16)) mod /= 1.667
        this.trueDef = this.def * mod;
        mod = 1;
        if (this.sEffects.includes(9)) mod *= 0.75
        if (this.sEffects.includes(10)) mod *= 1.5
        if (this.sEffects.includes(11)) mod *= 1.667
        if (this.sEffects.includes(16)) mod *= 0.8
        this.trueDDef = mod;
        mod = 1;
        if (this.HPtype == "NC") mod /= 2
        this.truePDef = mod;
        mod = rand(0.8, 1.2);
        if (this.sEffects.includes(3)) mod *= 0.7
        if (this.sEffects.includes(4)) mod *= 0.1
        if (this.sEffects.includes(5)) mod *= 0.1
        if (this.sEffects.includes(6)) mod *= 0.7
        if (this.sEffects.includes(14)) mod *= 0.5
        if (this.sEffects.includes(15)) mod *= 1.5
        if (this.sEffects.includes(17)) mod *= 0.667
        if (this.sEffects.includes(18)) mod *= 1.5
        if (this.sEffects.includes(20)) mod *= 0.5
        this.trueSpd = this.spd * mod;
    }

    tickStatusEffects(){
        let attempts = 0
        for (let i = 0; i < this.sEffects.length; ++i){
            console.log("Processing Effect Type: " + effectList[this.sEffects[i]] + " with duration " +  this.sDuration[i] + " and strength " +  this.sStrength[i] + "...")
            attempts++
            switch(this.sEffects[i]){
                case 0: 
                    this.damage(this.name, this.sStrength[i], [0], [1], 10, ["Fire", "Physical"], 1); 
                    allInQueue();
                    break;
                case 1: 
                    this.damage(this.name, this.sStrength[i], [0], [1], 10, ["Poison", "Physical"], 1); 
                    allInQueue();
                    break;
                case 2: 
                    this.damage(this.name, this.sStrength[i], [0], [1], 10, ["Normal", "Physical"], 1); 
                    allInQueue();
                    break;
                case 12: 
                    this.heal(this.name, [this.sStrength[i]], 10, ["Normal", "Physical"]); 
                    allInQueue();
                    break;
                case 13: 
                    this.heal(this.name, [0, this.sStrength[i]], 10, ["Normal", "Physical"]); 
                    allInQueue();
                    break;
                case 19: 
                    this.damage(this.name, this.sStrength[i], [0], [1], 10, ["Magic", "Magical"], 1); // this causes an unstable magic buff on it's own effect. leave it in as a quirk?
                    allInQueue();
                    break;
                case 20: 
                    this.damage(this.name, this.sStrength[i]*this.sDuration[i], [0], [1], 10, ["Poison", "Physical"], 1); 
                    // this works differently than in pokemon!
                    // this damage decays over time instead of increasing, but is still much stronger than the normal poison variant
                    allInQueue();
                    break;
                default:
                    // no HP/MP effect played here. Move on!
                    break;
            }
            this.sDuration[i]--
            if (this.sDuration[i] <= 0){
                // remove all effects with durations <= 1
                console.log(effectList[this.sEffects[i]] + " wore off!")
                this.sEffects.splice(i, 1);
                this.sDuration.splice(i, 1);
                this.sStrength.splice(i, 1);
                i--
            }
            if (attempts > 10000){
                throw new Error("Hey! Something went wrong! I can't process this!");
            }
        }
        this.updateSTATEffects()
    }

    damage(person, attack, critchance, critdmg, variance, type, ignoreDEF){
        // crit chance (%) and crit dmg (x) are arrays!
        // they determine when a certain crit type happens!
        // example: CritChance = [10, 2, 0.1]
        // example: CritDmg = [2.3, 3.5, 45]
        // lowest crit chance goes first, so check 0.1% with 45x. 
        // if it doesn't trigger, then 2% with 3.5x is tested
        // if it doesn't trigger, then 10% with 2.3x is tested
        // if it doesn't trigger, then no more crit functions will be checked for this attack.
        damageList.push("Damage", this.name, person, attack, critchance, critdmg, variance, type, ignoreDEF);
    }

    heal(person, healing, variance, type){
        // "healing" is an array!
        // order goes like this: HP, MP, SP, GP, HP
        // items with index >= 5 should be ignored
        damageList.push("Heal", this.name, person, healing, variance, type);
    }

    giveStatusEffect(person, id, duration, strength, overwrite){
        damageList.push("Effect", this.name, person, id, duration, strength, overwrite);
    }
}

for (let i = 0; i < music.length; ++i){
    music[i].load();
}

let people = {
    //                                                    Lv  XPos  YPos  S  HPX HPY HPS XPR XPS BaseHP  BaseMP Type(s)                 BATK   BDEF   BSD HPType     PersonType   T  Xs   Ys
      "Alterian Skyler": new Character("Alterian Skyler", 70,  0,    0,   1, -5, 120, 1, 45,  0, 47,     11,    ["Normal", "Electric"], 35,    8.2,   22, "NC",     "PlayerBoss", 0, 128, 256),
    //"ToWM TowerSB":    new Character("ToWM TowerSB",    70, -200, -100, 1, -5, 110, 1, 35,  0, 55,     10,    ["Normal"],             25,    10,    16, "Normal", "Player",     1, 128, 256),
    //"ToFUN TowerSB":   new Character("ToFUN TowerSB",   70, -125, -125, 1, -5, 120, 1, 40,  0, 50,     16,    ["Normal"],             40,    20,    10, "Normal", "Player",     1, 128, 256),
    //"Delet Ball":      new Character("Delet Ball",      1,   200, -100, 1, -5, 60,  1, 1e7, 0, 172554, 19886, ["Dark"],               27446, 10965, 31, "Normal", "Boss",       2, 128, 128),
}

let characters = [];
let hpBarZ = [];
let hpBarA = [];
let hpBarB = [];
let hpBarC = [];
let mpBarZ = [];
let mpBarA = [];
let mpBarB = [];
for (let i = 0; i < peopleNames.length; i++){
    let name = "character" + i
    const char = document.createElement("img");
    const MAIN = document.getElementById("characters")
    char.id = name;
    MAIN.appendChild(char);
    document.getElementById(name).classList.add("character" + i)
    document.getElementById(name).classList.add("character")
    characters.push(document.getElementById(name))
    
    const hpCon = document.createElement("div")
    name = "hp" + i + "-container"
    hpCon.id = name;
    MAIN.appendChild(hpCon);
    document.getElementById(name).classList.add("bar-container")
    document.getElementById(name).classList.add("bar")
    hpBarZ.push(document.getElementById(name))

    const hpA = document.createElement("div")
    name = "hp" + i + "a"
    hpA.id = name;
    hpCon.appendChild(hpA);
    document.getElementById(name).classList.add("fill")
    hpBarA.push(document.getElementById(name))

    const hpB = document.createElement("div")
    name = "hp" + i + "b"
    hpB.id = name;
    hpCon.appendChild(hpB);
    document.getElementById(name).classList.add("last")
    hpBarB.push(document.getElementById(name))

    const hpC = document.createElement("div")
    name = "hp" + i + "c"
    hpC.id = name;
    hpCon.appendChild(hpC);
    document.getElementById(name).classList.add("empty")
    hpBarC.push(document.getElementById(name))

    const mpCon = document.createElement("div")
    name = "mp" + i + "-container"
    mpCon.id = name;
    MAIN.appendChild(mpCon);
    document.getElementById(name).classList.add("bar-container")
    document.getElementById(name).classList.add("bar")
    mpBarZ.push(document.getElementById(name))

    const mpA = document.createElement("div")
    name = "mp" + i + "a"
    mpA.id = name;
    mpCon.appendChild(mpA);
    document.getElementById(name).classList.add("fill")
    mpBarA.push(document.getElementById(name))

    const mpB = document.createElement("div")
    name = "mp" + i + "b"
    mpB.id = name;
    mpCon.appendChild(mpB);
    document.getElementById(name).classList.add("empty")
    mpBarB.push(document.getElementById(name))
}
done = true
resize();