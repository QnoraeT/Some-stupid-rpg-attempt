"use strict";

function getStat(person, modifiers){
    people[person].updateSTATEffects()
    return {
        atk: people[person].trueAtk * modifiers[0], 
        def: people[person].trueDef * modifiers[1], 
        spd: people[person].trueSpd * modifiers[2], 
        dDef: people[person].trueDDef * modifiers[3],
    }
}

function objectBasics(person){
    let obj = {
        name: person.name,
        introduction() {
            console.log("hi!! i am " + person.name + "!");
        },
        target(ieType) {
            let candidates = Object.assign({}, people);
            let candidatesNames = Array.from(peopleNames);
            if (ieType[1] !== "includeDead") {
                for (let i = 0; i < candidatesNames.length; ++i){
                    if ((candidates[candidatesNames[i]].alive === false) || (candidates[candidatesNames[i]].name === person.name) || (candidates[candidatesNames[i]].team === person.team)) {
                        delete candidates[candidatesNames[i]];
                        candidatesNames.splice(i, 1);
                        i--
                    }
                }
            }
            switch (ieType[0]){
                case "self":
                    return person.name;
                case "normal":
                    return Object.keys(candidates)[intRand(0, (Object.keys(candidates).length - 1))]
                default:
                    console.warn(`no, ${ieType[0]} doesn't exist. (returned null)`);
                    return null;
            }
        },
        initEI0(){
            fetch("./characterSettings.json")
                .then((res) => {
                return res.json();
            })
            .then((data) => people[person.name].extraInfo[0] = data[`${person.name}`]);
            // * EXTRAINFO[0] CAN BE CHANGED!! REMEMBER THIS SO YOU DON'T PULL YOUR HAIR OUT ON HOW YOU CAN CHANGE STUFF IN THE JSON AFTER LOADING!
        }
    }
    console.log(person)
    return obj
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
            for (let i = 0; i < people[this.objName].extraInfo[3].length; ++i){
                if (!peopleNames.includes(people[this.objName].extraInfo[3][i])){ // find friends (if they don't exist, ignore them)
                    people[this.objName].extraInfo[3].splice(i, 1);
                    people[this.objName].extraInfo[4].splice(i, 1);
                    i--;
                }
            }
            console.log("I have finished initalizing!")
        },
        effectScript(){
            
        },
        hitScript(damage) {
            people[this.objName].extraInfo[1] -= damage / people[this.objName].maxHealth
            if (damage >= people[this.objName].maxHealth / 1000 && people[this.objName].health / people[this.objName].maxHealth < 1) {
                people[this.objName].extraInfo[1] -= 0.1 * Math.sqrt(1 - (people[this.objName].health / people[this.objName].maxHealth))
            }
            people[this.objName].extraInfo[2] = 100
            if (people[this.objName].sEffects.includes(4)){ // wake up from sleep after getting hit
                for (let i = 0; i < people[this.objName].sEffects.length; ++i){
                    if (people[this.objName].sEffects[i] === 4) {
                        people[this.objName].sDuration[i] -= (damage / people[this.objName].maxHealth * 10) + 0.1
                        if (people[this.objName].sDuration[i] <= 0){
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
            // "Fast", "Unstable Magic", "Bad Poison", "Silence", "Strong", "Weak"];
            // 1 = normal damage
            // 2 = bad
            // 3 = should be unused, bad
            // 4 = effect
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 0, 1) * 50 // burn inconveniences them, but if they do more damage, the worse they'll feel
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 1, 1) * 50 // poison same thing
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 2, 1) * 30
            if (people[this.objName].sEffects.includes(3)) {people[this.objName].extraInfo[2] -= 10;} // get paralyzed is annoying
            if (people[this.objName].sEffects.includes(4)) {people[this.objName].extraInfo[2] += 30;} // sleeping feels good tho, you need rest (and you regen)
            if (people[this.objName].sEffects.includes(5)) {people[this.objName].extraInfo[2] -= 20;} // (freezing sucks)
            if (people[this.objName].sEffects.includes(6)) {people[this.objName].extraInfo[2] -= 15;} // they hate being confused
            if (people[this.objName].sEffects.includes(7)) {people[this.objName].extraInfo[2] -= 20;} // strange, like they're sick
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
            let x = people[this.objName].health / people[this.objName].maxHealth
            people[this.objName].extraInfo[2] += 50 * (x >= 0.5)?(1 - (((4 * x) - 3) ** 2)):(4 * (x - 0.5)) // -100 close to dying, +50 on 75% HP 
            people[this.objName].extraInfo[2] -= 30 * ((1 - (people[this.objName].mana / people[this.objName].maxMana)) ** 4) // low mana = oh no
            for (let i = 0; i < people[this.objName].extraInfo[3].length; ++i){
                if (people[people[this.objName].extraInfo[3][i]].alive === false){ 
                    people[this.objName].extraInfo[2] -= people[this.objName].extraInfo[4][i]
                }
            }
        },
        getAtk() {
            let atk = 1.0
            return getStat("Alterian Skyler", [atk, 1, 1, 1]).atk;
        },
        doTurn() {
            this.hitScript(0)
            let mod = 0.2
            if (people[this.objName].extraInfo[1] <= 60) {
                people[this.objName].damage(this.objName, mod * (60 - people[this.objName].extraInfo[1]) / 150 * people[this.objName].maxHealth, [0], [1], 0, ["Normal", "Physical"], 3);
            } else {
                people[this.objName].heal(this.objName, [mod * (people[this.objName].extraInfo[1] - 60) / 150 * people[this.objName].maxHealth], 0, ["Normal", "Physical"]);
            }
            allInQueue();
            if (people[this.objName].sEffects.includes(3) && (Math.random() > 0.75)) {console.log(`[${this.objName}] - paralyzed...`); return;}
            if (people[this.objName].sEffects.includes(4)) {console.log(`[${this.objName}] - frozen...`); return;}
            if (people[this.objName].sEffects.includes(5)) {console.log(`[${this.objName}] - sleeping...`); return;}
            if (people[this.objName].extraInfo[2] <= 0 && (Math.random() > (0.25 + 0.65 * (people[this.objName].extraInfo[2] / 60)))) {console.log(`[${this.objName}] - feeling really bad...`); return;}
            let success = false;
            let attempts = 0;
            let action;
            let actionList;
            let target;
            while (success === false){
                if (attempts >= 100) {throw new Error(`[${this.objName}] - i'm stuck!! i can't move! (attempted ${attempts} times)`);}
                attempts++
                action = intRand(0, 2);
                actionList = ["zap", "punch", "stab"];
                switch (action){
                    case 0:
                        // * zap
                        target = this.defaultAct.target(["normal", "normal"])
                        people[this.objName].damage(target, 0.6 * this.getAtk(), [10, 2], [2, 6], 50, ["Normal", "Electric"], 0)
                        allInQueue()
                        success = true
                        break;
                    case 1:
                        // * punch
                        target = this.defaultAct.target(["normal", "normal"])
                        people[this.objName].damage(target, 1.2 * this.getAtk(), [20, 4], [2, 4], 25, ["Normal", "Physical"], 0)
                        allInQueue()
                        success = true
                        break;
                    case 2:
                        // * stab
                        target = this.defaultAct.target(["normal", "normal"])
                        people[this.objName].damage(target, 0.8 * this.getAtk(), [3, 0.1], [5, 32], 15, ["Normal", "Physical"], 0)
                        if (Math.random() > 80) {people[this.objName].giveStatusEffect(target, 1, intRand(2, 4), 0.35 * this.getAtk(), 0);}
                        allInQueue()
                        success = true
                        break;
                    default:
                        throw new Error("that's not a valid action...  " + action)
                }
            }
            console.log(`${this.objName} did ${actionList[action]}`)
        }
    },
    "ToWM TowerSB": {
        defaultAct: objectBasics(people["ToWM TowerSB"]),
        init(){
            people[this.objName].extraInfo[1] = 100 // mood
            people[this.objName].extraInfo[2] = ["ToWM TowerSB"] // friends 
            people[this.objName].extraInfo[3] = [25] // how close their friends are
            for (let i = 0; i < people[this.objName].extraInfo[3].length; ++i){
                if (!peopleNames.includes(people[this.objName].extraInfo[2][i])){ // find friends (if they don't exist, ignore them)
                    people[this.objName].extraInfo[2].splice(i, 1);
                    people[this.objName].extraInfo[3].splice(i, 1);
                }
            }
            console.log("I have finished initalizing!")
        },
        doTurn() {
            
        },
    }, 
    "ToFUN TowerSB": {
        defaultAct: objectBasics(people["ToFUN TowerSB"]),
        doTurn() {
            
        },
    }, 
    "FSBlue": {
        defaultAct: objectBasics(people["FSBlue"]),
        init(){
            people[this.objName].extraInfo[1] = 100 // mood
            people[this.objName].extraInfo[2] = ["ToWM TowerSB", "ToFUN TowerSB", "Alterian Skyler"] // friends 
            people[this.objName].extraInfo[3] = [10, 15, 60] // how close their friends are
            for (let i = 0; i < people[this.objName].extraInfo[3].length; ++i){
                if (!peopleNames.includes(people[this.objName].extraInfo[2][i])){ // find friends (if they don't exist, ignore them)
                    people[this.objName].extraInfo[2].splice(i, 1);
                    people[this.objName].extraInfo[3].splice(i, 1);
                    i--;
                }
            }
            console.log("I have finished initalizing!")
        },
        doTurn() {
            
        },
    },
    "Delet Ball": {
        defaultAct: objectBasics(people["Delet Ball"]),
        doTurn() {
            
        },
        hitScript(damage) {
            
        }
    },
}