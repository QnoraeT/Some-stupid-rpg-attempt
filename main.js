function allInQueue(){
    let attempts = 0
    for (let i = 0; i < damageList.length; ++attempts){
        if (attempts > 100){
            throw new Error("Hey! Something went wrong! I can't process this!")
        }
        console.log(damageList[i])
        if (damageList[i] == "Damage"){
            people[damageList[i+2]].extraInfo[0] = damageList[i+1]
            let DMsub = 0
            let DMdiv = 1
            let DMpow = 1
            let trueDamage = (Math.max((damageList[i+3] - DMsub), 0) ** DMpow) / DMdiv
            people[damageList[i+2]].health = people[damageList[i+2]].health - trueDamage
            i = i + 5
        }    
        if (damageList[i] == "Effect"){
            let pA = damageList[i+2] // personAffected
            let effectType = damageList[i+3]
            let duration = damageList[i+4]
            let strength = damageList[i+5]
            if (people[pA].sEffects.includes(effectType)){
                let id = people[pA].sEffects.indexOf(effectType)
                switch(damageList[i+6]) {
                    case 0: 
                        if (duration > people[pA].sDuration[id]){
                            people[pA].sDuration[id] = duration
                            console.log("effect duration increased")
                        }
                        if (strength > people[pA].sStrength[id]){
                            people[pA].sStrength[id] = strength
                            console.log("effect strength increased")
                        }
                        console.log("effect stats checked")
                        break
                    case 1: 
                        people[pA].sDuration[id] = duration
                        people[pA].sStrength[id] = strength
                        console.log("effect stats overwritten")
                        break
                    case 2:
                        console.log("already has one. nothing changed")
                        break
                    default:
                        throw new Error("What do you want me to do here?? " + people[pA].name + " already has the effect " + effectList[effectType])
                }
            } else {
                people[pA].sEffects.push(effectType)
                people[pA].sDuration.push(duration)
                people[pA].sStrength.push(strength)
            }
            i = i + 7
        }    
    }
    damageList = []
}

function lerp(t, s, e, type, p){
    t = Math.clamp(t, 0, 1)
    if (t = 0){
        return s
    }
    if (t = 1){
        return e
    }
    switch(type) {
        case "QuadIn": 
            t = t * t
            break
        case "QuadOut": 
            t = 1.0 - ((1.0 - t) * (1.0 - t))
            break
        case "CubeIn": 
            t = t * t * t
            break
        case "CubeOut": 
            t = 1.0 - ((1.0 - t) * (1.0 - t) * (1.0 - t))
            break
        case "Smooth": 
            t = 6 * (t ** 5) - 15 * (t ** 4) + 10 * (t ** 3)
            break
        case "ExpSCurve": 
            t =  (Math.tanh(p * Math.tan((t + 1.5 - ((t - 0.5) / 1e9)) * Math.PI)) + 1) / 2
            break
        case "Expo": 
        if (p > 0) {
            t = Math.coth(p / 2)*Math.tanh(p * t / 2)
        } else if (p < 0) {
            t = 1.0 - Math.coth(p / 2)*Math.tanh(p * (1.0 - t) / 2)
        } 
            break
        default:
            break
    }
    return (s*(1-t))+(e*t)
}

function newMusic(m){
    for (let i = 0; i < music.length; ++i){
        music[i].load()
    }
    if (m > music.length){
        throw new Error('Hey! That song is out of bounds! ' + m)
    }
    music[m].play()
}
function updateVisuals(){
    let sprite
    for (let i = 0; i < peopleNames.length; ++i){
        sprite = PIXI.Sprite.from('characters/' + people[peopleNames[i]].name + '/assets/' + people[peopleNames[i]].lastSpriteState + '.svg')
        sprite.x = 100.0 + Math.cos(Time/50.0) * 100.0
        people[peopleNames[i]].lastSpriteState = people[peopleNames[i]].spriteState
    }
}

function translateXY(x,y,s){
    return [x - CamX + ShakeX / Zoom, y - CamY + ShakeY / Zoom, s / Zoom]
}

{
    window.requestAnimationFrame(gameLoop);
    let oldTimeStamp = 0; 

    function gameLoop(timeStamp){
        let delta = ((timeStamp - oldTimeStamp) / 1000) * TimeSpeed
        const FPS = Math.round(TimeSpeed / delta)
        Time = Time + delta
        music[musicState].volume = musicVolume
        updateVisuals()
        // do not change
        oldTimeStamp = timeStamp
        window.requestAnimationFrame(gameLoop)
    }
}

for (let i = 0; i < music.length; ++i){
    music[i].loop = true
}

function start(){
    newMusic(musicState)
}

// sort by speed [1,5,8,2,67,3,343,6].sort(function(a, b){return a - b})