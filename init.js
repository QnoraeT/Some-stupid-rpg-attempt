let canvasSize = {width: 0, height: 0}

/*const textures = PIXI.Assets.load(["images/on.png","images/off.png","danidanijrs-font.ttf"])
    .then(function()
    {
        console.log("Textures Loaded");
        setup();
    });
*/
window.addEventListener('resize', resize);
    
function resize()
{
        var h = 640;
        var width = window.innerWidth || document.body.clientWidth; 
        var height = window.innerHeight || document.body.clientHeight; 
        var ratio = height / h;
        var view = app.view;
    
        view.style.height = (h * ratio) + "px";
        var newWidth = (width / ratio);
        view.style.width = width + "px";
        
        app.renderer.resize(newWidth , h);
    
        canvasSize.width = newWidth
        canvasSize.height = h
        console.log(canvasSize)
}

let TextureCache = PIXI.utils.TextureCache
let Sprite = PIXI.Sprite
let Container = PIXI.Container
let Graphics = PIXI.Graphics

    // Create the application helper and add its render target to the page
    let app = new PIXI.Application({ width: 640, height: 360 });
    document.body.appendChild(app.view);

var CamX = 0
var CamY = 0
var Zoom = 1
var Shake = 0
var ShakeDecay = 0.01
var ShakeX = 0
var ShakeY = 0
var Time = 0
var delta = 0
var TimeSpeed = 1
var damageList = []
var damageIndicatorList = []
var effectList = ["Burn", "Poison", "Sunstroke", "Paralyze", "Sleep", "Freeze", "Confusion", "Strange", "Crying", "Ichor", "Ironskin", "Light Shield", "Revitalize", "Energize", "Dazed", "Focus", "Taunt", "Slow", "Fast", "Unstable Magic", "Bad Poison", "Silence", "Strong", "Weak"]
var musicVolume = 1.00
var sfxVolume = 0.30
var music = [new Audio('music/forget not (shortened).mp3'), new Audio('music/something with danidanijr V3.6 NO ARTS.mp3')]
var musicState = 0
let musicUpdate = 0
var peopleNames = []

class character extends PIXI.Container {
    constructor(name, lvl, XPos, YPos, size, XOffsetHP, YOffsetHP, SizeOffsetHP, baseXPReq, xp, baseHP, baseMP, elem1, elem2, baseATK, baseDEF, baseSPD, hpType, personType, team){
        super()
        this.name = name
        let lf = lvl - 1
        lf = (((lf + ((lf ** 2) / 15) + ((lf ** 3) / 120)) ** (1 + (lf / 250))) + 8) / 8
        this.level = lvl
        this.xPosition = XPos
        this.yPosition = YPos
        this.size = size
        this.xPosHP = XOffsetHP
        this.yPosHP = YOffsetHP
        this.sHP = SizeOffsetHP
        this.expPoints = xp
        this.nextLv = baseXPReq * ( lf ** 1.5 )
        this.maxHealth = baseHP * lf
        this.health = this.maxHealth
        this.maxMana = baseMP * lf
        this.mana = this.maxMana
        this.atk = baseATK * lf
        this.def = baseDEF * lf
        this.spd = baseSPD * ( lf ** 0.1 )
        this.trueAtk = this.atk
        this.trueDef = this.def
        this.trueSpd = this.spd
        this.HPtype = hpType
        this.type1 = elem1
        this.type2 = elem2
        this.status = personType
        this.team = team
        this.target = ""
        this.sEffects = []
        this.sDuration = []
        this.sStrength = []
        this.spriteState = "Idle1"
        this.lastSpriteState = "Idle1"
        this.extraInfo = ["", "", 100] // who hit me?, who healed me?, my mood
        peopleNames.push(this.name)
        let sprite = PIXI.Sprite.from('characters/' + this.name + '/assets/' + this.spriteState + '.svg')
        app.stage.addChild(sprite)
    }

    updateEffects(){
        let mod
        mod = 1
        this.trueAtk = this.atk * mod
        mod = 1
        this.trueDef = this.def * mod
        mod = 1
        this.trueSpd = this.spd * mod * (Math.random() * 0.5) + 0.75
    }

    damage(person, attack, type){
        damageList.push("Damage", this.name, person, attack, type)
    }

    giveStatusEffect(person, id, duration, strength, type){
        damageList.push("Effect", this.name, person, id, duration, strength, type)
    }
}

let people = {
    "Alterian Skyler": new character("Alterian Skyler", 89, -100, 50, 1, 0, 40, 1, 45, 0, 150, 15, "Normal", "Electric", 10, 2, 16, "Normal", "PlayerBoss", 0),
    //"ToWM_TowerSB": new character("ToWM_TowerSB", 70, 100, 50, 1, 0, 40, 1, 35, 0, 55, 10, "Normal", "", 25, 10, 16, "Normal", "Player", 1),
    //"ToFUN_TowerSB": new character("ToFUN_TowerSB", 70, 100, -50, 1, 0, 40, 1, 40, 0, 50, 16, "Normal", "", 40, 20, 10, "Normal", "Player", 1),
    //"Delet Ball": new character("Delet Ball", 1, -100, -50, 1, 0, 25, 1, 1e7, 0, 172554, 19886, "Dark", "", 27446, 10965, 31, "Normal", "Boss", 0)
}

for (let i = 0; i < music.length; ++i){
    music[i].load()
}
/*
function setup(){
    let sprite
    for (let i = 0; i < peopleNames.length; ++i){
        sprite = PIXI.Sprite.from(people[peopleNames[i]].name + '/assets/' + people[peopleNames[i]].lastSpriteState + '.svg')
        HPDisplay = new PIXI.Text("Speed: 1")
        HPDisplay.position.set(960,5)
        HPDisplay.anchor.set(1,0)
        app.stage.addChild(HPDisplay);
    }

}
*/