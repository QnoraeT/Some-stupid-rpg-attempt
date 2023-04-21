"use strict";
let canvasSize = {width: 0, height: 0};

window.addEventListener('resize', resize);
    
function resize(){
    canvasSize.width = 960;
    canvasSize.height = 640;
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
let ShakeDecay = 0.01;
let ShakeX = 0;
let ShakeY = 0;
let Time = 0;
let delta = 0;
let TimeSpeed = 1;
let damageList = [];
let damageIndicatorList = [];
let musicVolume = 1.00;
let sfxVolume = 0.30;
const effectList = ["Burn", "Poison", "Sunstroke", "Paralyze", "Sleep", "Freeze", "Confusion", "Strange", "Crying", "Ichor", "Ironskin", "Light Shield", "Revitalize", "Energize", "Dazed", "Focus", "Taunt", "Slow", "Fast", "Unstable Magic", "Bad Poison", "Silence", "Strong", "Weak"];
const music = [new Audio('music/forget not (shortened).mp3'), new Audio('music/something with danidanijr V3.6 NO ARTS.mp3')];
const critNames = ["Critical", "Deadly", "Super", "Ultra", "Hyper", "EXTREME", "ULTIMATE"]
/*const comboSound = [];

for (let i = 1; i <= 16; ++i){
    comboSound.push(new Audio('sfx/combo_' + i + '.mp3'));
    comboSound.push(new Audio('sfx/combo_' + i + '_power.mp3'));
}

const sfxMP3 = [];
for (let i = 1; i <= 1; ++i){
    comboSound.push(new Audio('sfx/sfx' + i + '.mp3'));
}

const sfxWAV = [];
for (let i = 1; i <= 2; ++i){
    comboSound.push(new Audio('sfx/sfx' + i + '.wav'));
}*/

let musicState = 0;
let musicUpdate = 0;
let peopleNames = [];
let turnOrder = [];
let lastHP = [];

for (let i = 0; i < music.length; ++i){
    music[i].loop = true;
}

class Character {
    constructor(name, lvl, XPos, YPos, size, XOffsetHP, YOffsetHP, SizeOffsetHP, baseXPReq, xp, baseHP, baseMP, elem1, elem2, baseATK, baseDEF, baseSPD, hpType, personType, team, sizeX, sizeY){
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
        this.type1 = elem1;
        this.type2 = elem2;
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
        lastHP.push(this.health);
        peopleNames.push(this.name);
    }

    updateSTATEffects(){
        let mod;
        mod = 1;
        this.trueAtk = this.atk * mod;
        mod = 1;
        this.trueDef = this.def * mod;
        mod = (Math.random() * 0.5) + 0.75;
        this.trueSpd = this.spd * mod;
    }

    tickStatusEffects(){
        let attempts = 0
        for (let i = 0; i < this.sEffects.length; ++i){
            console.log("Processing Effect Type: " + effectList[this.sEffects[i]] + " with duration " +  this.sDuration[i] + " and strength " +  this.sStrength[i] + "...")
            attempts++
            switch(this.sEffects[i]){
                case 0: 
                    this.damage(this.name, this.sStrength[i], [0], [1], 10, "Fire", true); 
                    allInQueue();
                    break;
                case 1: 
                    this.damage(this.name, this.sStrength[i], [0], [1], 10, "Poison", true); 
                    allInQueue();
                    break;
                case 2: 
                    this.damage(this.name, this.sStrength[i], [0], [1], 10, "Normal", true); 
                    allInQueue();
                    break;
                case 12: 
                    this.heal(this.name, [this.sStrength[i]], 10, "Normal"); 
                    allInQueue();
                    break;
                case 13: 
                    this.heal(this.name, [0, this.sStrength[i]], 10, "Normal"); 
                    allInQueue();
                    break;
                case 19: 
                    this.damage(this.name, this.sStrength[i], [0], [1], 10, "Magic", true); 
                    allInQueue();
                    break;
                case 20: 
                    this.damage(this.name, this.sStrength[i]*this.sDuration[i], [0], [1], 10, "Poison", true); 
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
        // lowest crit chance goes first, so check 0.1% with 45x. [IT HAS TO BE IN ORDER!! HIGHEST CHANCE -> LOWEST CHANCE]
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

let people = {
    "Alterian Skyler": new Character("Alterian Skyler", 1, 0, 0, 1, -67.5, 160, 1, 45, 0, 47, 11, "Normal", "Electric", 7, 2.3, 16, "Normal", "PlayerBoss", 0, 128, 256),
    //"Alterian Skyler": new Character("Alterian Skyler", 89, 0, 100, 1, -16.5, 20, 1, 45, 0, 150, 15, "Normal", "Electric", 10, 2, 16, "Normal", "PlayerBoss", 0, 128, 256),
    "ToWM:TowerSB": new Character("ToWM:TowerSB", 70, -50, -50, 1, 0, 40, 1, 35, 0, 55, 10, "Normal", "", 25, 10, 16, "Normal", "Player", 1, 128, 256),
    "ToFUN:TowerSB": new Character("ToFUN:TowerSB", 70, -30, -50, 1, 0, 40, 1, 40, 0, 50, 16, "Normal", "", 40, 20, 10, "Normal", "Player", 1, 128, 256),
    "Delet Ball": new Character("Delet Ball", 1, 50, -50, 1, 0, 25, 1, 1e7, 0, 172554, 19886, "Dark", "", 27446, 10965, 31, "Normal", "Boss", 2, 256, 256)
}

for (let i = 0; i < music.length; ++i){
    music[i].load();
}

resize();