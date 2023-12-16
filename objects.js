"use strict";

function aniSegment(pHit, hit){
    return pHit === hit ? -1 : hit
}

function getStat(person, modifiers = [1, 1, 1, 1, 1, 1]) {
    people[person].updateSTATEffects()
    return {
        PATK: people[person].truePATK * modifiers[0],
        PDEF: people[person].truePDEF * modifiers[1],
        MATK: people[person].trueMATK * modifiers[2],
        MDEF: people[person].trueMDEF * modifiers[3],
        spd: people[person].trueSpd * modifiers[4],
        dDef: people[person].trueDDef * modifiers[5],
    }
}

function doMove(who, action, targets, effectT = [1], endTime = 1) {
    people[who].action.push({
        action: action, 
        targets: targets, 
        time: Time,
        eTime: effectT,
        pHit: 0,
        hit: 0,
        end: endTime
    });
}

function objectBasics(person) {
    try {
        let obj = {
            name: person.name,
            introduction() {
                console.log("hi!! i am " + person.name + "!");
            },
            target(ieType) {
                // * i have to do this terribleness because js is weird and actually removes items from the original list which sucks
                let candidates = Object.assign({}, people);
                let candidatesNames = Array.from(peopleNames);
                if (ieType[1] !== "includeDead") {
                    for (let i = 0; i < candidatesNames.length; ++i) {
                        if ((candidates[candidatesNames[i]].alive === false) || (candidates[candidatesNames[i]].name === person.name) || (candidates[candidatesNames[i]].team === person.team)) {
                            delete candidates[candidatesNames[i]];
                            candidatesNames.splice(i, 1);
                            i--
                        }
                    }
                }
                switch (ieType[0]) {
                    case "self":
                        return person.name;
                    case "normal":
                        return Object.keys(candidates)[intRand(0, (Object.keys(candidates).length - 1))]
                    default:
                        console.warn(`no, ${ieType[0]} doesn't exist. (returned null)`);
                        return null;
                }
            },
            initEI0() {
                try {
                    fetch("./characterSettings.json")
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => people[person.name].extraInfo[0] = data[`${people[person.name].jsonType}`]);
                    

                // ! EXTRAINFO[0] CAN BE CHANGED!! REMEMBER THIS SO YOU DON'T PULL YOUR HAIR OUT ON HOW YOU CAN CHANGE STUFF IN THE JSON AFTER LOADING!
                } catch {
                    console.log(`${person.name} doesn't have an entry in the json...`)
                }
            },
            damageIndicatorList(damage, size, color, xv, yv) {
    
            }
        }
        console.log(person)
        return obj
    } catch(e) {
        console.log(`${person} does not exist!`)
    }
}

// i'm probably gonna hate myself for this, my lack of knowledge
let peopleObj = {
    "Alterian Skyler": {
        objName: "Alterian Skyler",
        defaultAct: objectBasics(people["Alterian Skyler"]),
        init() {
            people[this.objName].extraInfo[1] = 120 // blood/fluid amt
            people[this.objName].extraInfo[2] = 100 // mood
            people[this.objName].extraInfo[3] = ["FSBlue"] // friends 
            people[this.objName].extraInfo[4] = [40] // how close their friends are
            for (let i = 0; i < people[this.objName].extraInfo[3].length; ++i) {
                if (!peopleNames.includes(people[this.objName].extraInfo[3][i])) { // find friends (if they don't exist, ignore them)
                    people[this.objName].extraInfo[3].splice(i, 1);
                    people[this.objName].extraInfo[4].splice(i, 1);
                    i--;
                }
            }
            console.log("I have finished initalizing!")
        },
        effectScript() {

        },
        hitScript(param) {
            people[this.objName].extraInfo[1] -= 48 * (param.damage / people[this.objName].maxHealth)
            if (param.damage >= people[this.objName].maxHealth / 1000 && people[this.objName].health / people[this.objName].maxHealth < 1) {
                people[this.objName].extraInfo[1] -= 1 * Math.sqrt(1 - (people[this.objName].health / people[this.objName].maxHealth))
            }
            people[this.objName].extraInfo[2] = 100
            if (people[this.objName].sEffects.includes(4)) { // wake up from sleep after getting hit
                for (let i = 0; i < people[this.objName].sEffects.length; ++i) {
                    if (people[this.objName].sEffects[i] === 4) {
                        people[this.objName].sDuration[i] -= ((param.damage / people[this.objName].maxHealth) * 12) + ((param.damage / people[this.objName].maxHealth) >= 0.01) ? 0.1 : 0
                        if (people[this.objName].sDuration[i] <= 0) {
                            console.log(`${this.objName} woke up from getting hurt!`)
                            this.sEffects.splice(i, 1);
                            this.sDuration.splice(i, 1);
                            this.sStrength.splice(i, 1);
                            i--
                        }
                    }
                }
            }
            // ["Burn", "Poison", "Sunstroke", "Paralyze", "Sleep", "Freeze", "Confusion", "Strange", "Crying",
            // "Ichor", "Ironskin", "Light Shield", "Revitalize", "Energize", "Dazed", "Focus", "Taunt", "Slow"
            // "Fast", "Unstable Magic", "Bad Poison", "Silence", "Strong", "Weak", "Bleed"];
            // 1 = normal damage
            // 2 = bad
            // 3 = should be unused, bad
            // 4 = effect
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 0, 1) * 50 // burn inconveniences them, but if they do more damage, the worse they'll feel
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 1, 1) * 50 // poison same thing
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 2, 1) * 30
            if (people[this.objName].sEffects.includes(3)) { people[this.objName].extraInfo[2] -= 10; } // get paralyzed is annoying
            if (people[this.objName].sEffects.includes(4)) {
                try {
                    for (let i = 0; i < people[this.objName].sEffects.length; ++i) {
                        if (people[this.objName].sStrength[i][0] >= people[this.objName].extraInfo[0].effectModifiers.sleep.limit) {
                            people[this.objName].extraInfo[2] += 30;
                            break;
                        }
                    }
                } catch {
                    people[this.objName].extraInfo[2] += 30; // sleeping feels good tho, you need rest (and you regen)
                }
            }
            if (people[this.objName].sEffects.includes(5)) { people[this.objName].extraInfo[2] -= 20; } // (freezing sucks)
            if (people[this.objName].sEffects.includes(6)) { people[this.objName].extraInfo[2] -= 15; } // they hate being confused
            if (people[this.objName].sEffects.includes(7)) { people[this.objName].extraInfo[2] -= 20; } // strange, like they're sick
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 8, 4) * 30 // feel sad
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 9, 4) * 15 // feel weak
            people[this.objName].extraInfo[2] += allInstEffect(this.objName, 10, 4) * 10 // feel defenseful / idk
            people[this.objName].extraInfo[2] += allInstEffect(this.objName, 11, 4) * 10 // yay some sort of shield i guess?
            people[this.objName].extraInfo[2] += allInstEffect(this.objName, 12, 4) * 15 // i like regening
            people[this.objName].extraInfo[2] += allInstEffect(this.objName, 13, 4) * 12.5 // i also like MP regen
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 14, 4) * 5 // dazed weird
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 16, 4) * 15 // STOP BULLYING ME :SOB: (also causes crying, emotional damage is only effective if its repeated, so most taunting moves only have a strength of 1% to them)
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 17, 4) * 5 // slow bad
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 20, 2) * 75 // AAGH BAD POISON FUCK
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 21, 4) * 15 // i wanna use my magic
            people[this.objName].extraInfo[2] += allInstEffect(this.objName, 22, 4) * 12.5 // i will hit you!
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 23, 4) * 12.5 // damn it
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 24, 1) * 75 // AAAUUGH, BLEEDING AND TAKING DAMAGE!!! FUCKING HELL!
            let x = people[this.objName].health / people[this.objName].maxHealth
            people[this.objName].extraInfo[2] += 50 * (x >= 0.5) ? (1 - (((4 * x) - 3) ** 2)) : (4 * (x - 0.5)) // -100 close to dying, +50 on 75% HP 
            people[this.objName].extraInfo[2] -= 30 * ((1 - (people[this.objName].mana / people[this.objName].maxMana)) ** 4) // low mana = oh no
            people[this.objName].extraInfo[2] -= 50 * ((1 - (people[this.objName].extraInfo[1] / 120)) ** 4) // low blood
            for (let i = 0; i < people[this.objName].extraInfo[3].length; ++i) {
                if (people[people[this.objName].extraInfo[3][i]].alive === false) {
                    people[this.objName].extraInfo[2] -= people[this.objName].extraInfo[4][i]
                }
            }
            console.log(`MOOD: ${people[this.objName].extraInfo[2]}`)
        },
        doTurn() {
            this.hitScript({damage: 0})
            let mod = 0.2
            if (people[this.objName].extraInfo[1] <= 60) {
                people[this.objName].damage(this.objName, mod * (60 - people[this.objName].extraInfo[1]) / 150 * people[this.objName].maxHealth, [0], [1], 0, ["Normal", "Physical"], 3);
            } else {
                people[this.objName].heal(this.objName, [mod * (people[this.objName].extraInfo[1] - 60) / 150 * people[this.objName].maxHealth], 0, ["Normal", "Physical"]);
            }
            people[this.objName].extraInfo[1] += 7 * (people[this.objName].health / people[this.objName].maxHealth)
            if (people[this.objName].extraInfo[1] >= 120) { people[this.objName].extraInfo[1] = 120; }
            allInQueue();

            if (people[this.objName].sEffects.includes(3) && (Math.random() > 0.75)) { console.log(`[${this.objName}] - paralyzed!`); return; }
            if (people[this.objName].sEffects.includes(4)) {
                try {
                    for (let i = 0; i < people[this.objName].sEffects.length; ++i) {
                        if (people[this.objName].sStrength[i] >= people[this.objName].extraInfo[0].effectModifiers.sleep.limit) {
                            console.log(`[${this.objName}] - is asleep...`); return;
                        }
                    }
                } catch {
                    console.log(`${this.objName} doesn't have an effect modifier with sleep effect strength limit.`)
                    console.log(`[${this.objName}] - is asleep...`); return;
                }
            }
            if (people[this.objName].sEffects.includes(5)) { console.log(`[${this.objName}] - is frozen...`); return; }
            if (people[this.objName].extraInfo[2] <= 0 && (Math.random() > (0.25 + 0.65 * (people[this.objName].extraInfo[2] / 60)))) { console.log(`[${this.objName}] - feeling really bad...`); return; }
            let success = false;
            let attempts = 0;
            let action;
            let actionList;
            let target;
            while (success === false) {
                if (attempts >= 100) { throw new Error(`[${this.objName}] - i can't move! (attempted ${attempts} times)`); }
                attempts++
                action = intRand(0, 2);
                actionList = ["zap", "punch", "stab"];
                switch (action) {
                    case 0:
                        // * punch
                        // people[this.objName].damage(target, 1.2 * this.getAtk(), [20, 4], [2, 4], 25, ["Normal", "Physical"], 0)
                        // allInQueue()
                        doMove(this.objName, "punch", this.defaultAct.target(["normal", "normal"]), [0.7]);
                        success = true
                        break;
                    case 1:
                        // * zap
                        doMove(this.objName, "zap", this.defaultAct.target(["normal", "normal"]), [0.2]);
                        // people[this.objName].damage(target, 0.6 * this.getAtk(), [10, 2], [2, 6], 50, ["Electric", "Magical"], 0, ["", 32, "#00FFFF", rand(-8, 8), rand(10, 12), 0.75])
                        // allInQueue()
                        success = true
                        break;
                    case 2:
                        // * stab
                        doMove(this.objName, "stab", this.defaultAct.target(["normal", "normal"]));
                        // people[this.objName].damage(target, 0.8 * this.getAtk(), [3, 0.1], [5, 32], 15, ["Normal", "Physical"], 0)
                        // if (Math.random() > 40) { people[this.objName].giveStatusEffect(target, 24, intRand(2, 4), 0.25 * this.getAtk(), 6); }
                        // allInQueue()
                        success = true
                        break;
                    default:
                        throw new RangeError(`that's not a valid action...  (action ${action} attempted to be taken but doesn't exist)`)
                }
            }
            console.log(`${this.objName} did ${actionList[action]}`)
        }
    },
    "ToWM TowerSB": {
        objName: "ToWM TowerSB",
        defaultAct: objectBasics(people["ToWM TowerSB"]),
        init() {
            people[this.objName].extraInfo[1] = 270 // watermelon !
            people[this.objName].extraInfo[2] = 100 // mood
            people[this.objName].extraInfo[3] = ["ToFUN TowerSB"] // friends 
            people[this.objName].extraInfo[4] = [25] // how close their friends are
            if (peopleNames.includes("ToFUN TowerSB")) {people[this.objName].extraInfo[5] = 0;} // pair attack with ToFUN
            for (let i = 0; i < people[this.objName].extraInfo[4].length; ++i) {
                if (!peopleNames.includes(people[this.objName].extraInfo[3][i])) { // find friends (if they don't exist, ignore them)
                    people[this.objName].extraInfo[3].splice(i, 1);
                    people[this.objName].extraInfo[4].splice(i, 1);
                }
            }
            console.log("I have finished initalizing!")
        },
        doTurn() {

        },
        hitScript(param){
            people[this.objName].extraInfo[1] -= 48 * (param.damage / people[this.objName].maxHealth)
            if (param.damage >= people[this.objName].maxHealth / 1000 && people[this.objName].health / people[this.objName].maxHealth < 1) {
                people[this.objName].extraInfo[1] -= 1 * Math.sqrt(1 - (people[this.objName].health / people[this.objName].maxHealth))
            }
        },
    },
    "ToFUN TowerSB": {
        objName: "ToFUN TowerSB",
        defaultAct: objectBasics(people["ToFUN TowerSB"]),
        init() {
            people[this.objName].extraInfo[2] = 100 // mood
            people[this.objName].extraInfo[3] = ["ToWM TowerSB"] // friends 
            people[this.objName].extraInfo[4] = [45] // how close their friends are
            if (peopleNames.includes("ToWM TowerSB")) {people[this.objName].extraInfo[5] = 0;} // pair attack with ToWM
            for (let i = 0; i < people[this.objName].extraInfo[4].length; ++i) {
                if (!peopleNames.includes(people[this.objName].extraInfo[3][i])) { // find friends (if they don't exist, ignore them)
                    people[this.objName].extraInfo[3].splice(i, 1);
                    people[this.objName].extraInfo[4].splice(i, 1);
                }
            }
            console.log("I have finished initalizing!")
        },
        doTurn() {

        },
    },
    "FSBlue": {
        objName: "FSBlue",
        defaultAct: objectBasics(people["FSBlue"]),
        init() {
            people[this.objName].extraInfo[2] = 100 // mood
            people[this.objName].extraInfo[3] = ["ToWM TowerSB", "ToFUN TowerSB", "Alterian Skyler"] // friends 
            people[this.objName].extraInfo[4] = [10, 15, 60] // how close their friends are
            for (let i = 0; i < people[this.objName].extraInfo[3].length; ++i) {
                if (!peopleNames.includes(people[this.objName].extraInfo[3][i])) { // find friends (if they don't exist, ignore them)
                    people[this.objName].extraInfo[3].splice(i, 1);
                    people[this.objName].extraInfo[4].splice(i, 1);
                    i--;
                }
            }
            console.log("I have finished initalizing!")
        },
        doTurn() {
            this.hitScript({damage: 0})
            allInQueue();

            if (people[this.objName].sEffects.includes(3) && (Math.random() > 0.75)) { console.log(`[${this.objName}] - paralyzed!`); return; }
            if (people[this.objName].sEffects.includes(4)) {
                try {
                    for (let i = 0; i < people[this.objName].sEffects.length; ++i) {
                        if (people[this.objName].sStrength[i] >= people[this.objName].extraInfo[0].effectModifiers.sleep.limit) {
                            console.log(`[${this.objName}] - is asleep...`); return;
                        }
                    }
                } catch {
                    console.log(`${this.objName} doesn't have an effect modifier with sleep effect strength limit.`)
                    console.log(`[${this.objName}] - is asleep...`); return;
                }
            }
            if (people[this.objName].sEffects.includes(5)) { console.log(`[${this.objName}] - is frozen...`); return; }
            if (people[this.objName].extraInfo[2] <= 0 && (Math.random() > (0.25 + 0.65 * (people[this.objName].extraInfo[2] / 60)))) { console.log(`[${this.objName}] - feeling really bad...`); return; }
            let success = false;
            let attempts = 0;
            let action;
            let actionList;
            let target;
            while (success === false) {
                if (attempts >= 100) { throw new Error(`[${this.objName}] - i'm stuck!! i can't move! (attempted ${attempts} times)`); }
                attempts++
                action = intRand(0, 0);
                actionList = ["a", "hugs", "charges for a You're going to die", "dreamland!", "bull charge", "is desperate...", "is fucking mad!", "pets someone!", "combos with Alterian!", "tries to find a weak spot", "tries to heal herself"];
                switch (action) {
                    /* 
                    1. punch - normal
                    2. hug - heal someone for a little bit, cannot target self, ease character of:
                    Confusion (-1)
                    Strange (-1)
                    Crying (-1)
                    Revitalise (weak, +2)
                    Taunt (-1)
                    can be used on enemies:
                    weaken their attack (+1) (easier to subdue?)
                    make them have a chance to not attack (if player is playing, will let you have a choice, and if both sides agree not to fight, then the battle is won/won peacefully)

                    3. charge punch - 2 MP, init: x0.7, +x0.4 per charge, +0.5 MP cost per charge
                    4. sandman's dreamland!  - 3 MP 1 init turn, then immediately after, 3 high crit uppercuts dealing high damage
                    5. bald bull's bull charge - 6 MP, 2 init turns, then after, hit the opponent with extreme force! Stun (3), Bleed (3)
                    causes Dazed (2), Ichor (2) if hit
                    6. desperate reconcilation (<0 mood or <20% HP) - used once
                    7. rage combo (lost 2+ friends totalling 50 mood or higher or <0 mood) - punch someone 6 times, sometimes dealing effects such as Dazed (2), Weaken (2), and the last punch is delayed and does more damage with a big chance of critting
                    8. pet any fur character (only to fur characters) Strong (x1.5, 3), Revitalize (3)
                    9. combo attack with Kyron Skyler (if they're on the same team), using 40 *GP* each
                    dealing a massive amount of damage
                    10. find weak spot - 2 MP, not weak spot to stab, low attack. however if found, does critical damage
                    11. try to heal self (its weak, she's not very good at magic powers)
                    */
                    case 0:
                        // * punch
                        doMove(this.objName, "punch", this.defaultAct.target(["normal", "normal"]), [0.7], 1.4);
                        // people[this.objName].damage(target, 1.2 * this.getAtk(), [4, 1], [3, 6], 10, ["Normal", "Fighting", "Magical"], 0)
                        // allInQueue()
                        success = true
                        break;
                    default:
                        throw new RangeError(`that's not a valid action...  (action ${action} attempted to be taken but doesn't exist)`)
                }
            }
            console.log(`${this.objName} did ${actionList[action]}`)
        },
        special(type) {
            switch(type){
                case "miss":
                    console.log("damn...")
                    break;
                default:
                    break;
            }
        },
        hitScript(param) {
            people[this.objName].extraInfo[2] = 100
            let x = people[this.objName].health / people[this.objName].maxHealth
            people[this.objName].extraInfo[2] -= 50 * -1 * ((1 - x) ** 2) // 50% HP = -12.5
            people[this.objName].extraInfo[2] -= 20 * ((1 - (people[this.objName].mana / people[this.objName].maxMana)) ** 4) // low mana = oh no
            for (let i = 0; i < people[this.objName].extraInfo[3].length; ++i) {
                if (people[people[this.objName].extraInfo[3][i]].alive === false) {
                    people[this.objName].extraInfo[2] -= people[this.objName].extraInfo[4][i]
                }
            }
            console.log(`MOOD: ${people[this.objName].extraInfo[2]}`)
        },
    },
    "Delet Ball": {
        objName: "Delet Ball",
        defaultAct: objectBasics(people["Delet Ball"]),
        doTurn() {

        },
        hitScript(param) {

        }
    },
    "slime": {
        objName: "slime",
        defaultAct: objectBasics(people["slime"]),
        doTurn() {

        },
        hitScript(param) {

        }
    },
}

loadedPeopleObj = true;

function animate(){
    for (let i = 0; i < peopleNames.length; i++) {
        let action, pos, time, effectTime
        pos = [people[peopleNames[i]].baseXPos, people[peopleNames[i]].baseYPos];
        if (people[peopleNames[i]].action.length === 0) {
            action = {action: "idle"};
        } else {
            action = people[peopleNames[i]].action[0];
            time = Time - action.time;
            effectTime = action.eTime;
            action.pHit = action.hit
            if (action.targets === undefined) {
                console.log(`${peopleNames[i]} tried ${action.action} on an entity that doesn't exist...`)
                people[peopleNames[i]].action.splice(0, 1)
                return;
            }
            for (let i = 0; i < action.eTime.length; i++) {
                if (time >= action.eTime[i]) {
                    action.eTime[i] = Infinity;
                    action.hit++
                }
            }
        }

        switch (peopleNames[i]) {
            case "ToWM TowerSB":
                break;
            case "ToFUN TowerSB":
                break;
            case "Delet Ball":
                break;
            case "Alterian Skyler":
                break;
            case "FSBlue": 
                switch (action.action) {
                    case "punch": 
                        // simple ahh animation lma
                        if (time < 0.7) {
                            people[peopleNames[i]].xPosition = lerp(time / 0.7, pos[0], people[action.targets].xPosition)
                            people[peopleNames[i]].yPosition = lerp(time / 0.7, pos[1], people[action.targets].yPosition)
                        } else {
                            if (aniSegment(action.pHit, action.hit) === 1) {
                                people[peopleNames[i]].damage(action.targets, getStat(peopleNames[i], [1.2]).PATK, [4, 1], [3, 6], 10, ["Fighting", "Physical"], 0)
                                allInQueue()
                            }
                            people[peopleNames[i]].xPosition = lerp((time - 0.7) / 0.7, people[action.targets].xPosition, pos[0])
                            people[peopleNames[i]].yPosition = lerp((time - 0.7) / 0.7, people[action.targets].yPosition, pos[1])
                        }
                        break;
                    default: 
                        people[peopleNames[i]].spriteState = "Idle" + Math.floor(((Time * 1.6) % 2) + 1)
                        people[peopleNames[i]].xPosition = pos[0]
                        people[peopleNames[i]].yPosition = pos[1]
                        break;
                }
                break;
            case "slime": 
                break;
            default:
                throw new Error(`did you forget to add ${peopleNames} in objects.js animate() ?`)
        }

        if (action.end < time) {
            people[peopleNames[i]].action.splice(0, 1)
            return;
        }
    }
}