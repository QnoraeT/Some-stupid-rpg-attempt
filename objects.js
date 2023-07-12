"use strict";

function getStat(person){
    people[person].updateSTATEffects()
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
                let atmps = 0
                for (let i = 0; i < candidatesNames.length; ++i){
                    atmps++
                    if (atmps >= 999){
                        throw new Error("targetting system went wrong")
                    }
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
                    console.warn("no, " + ieType[0] + " does not exist.");
            }
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
                }
            }
        },
        hitScript(damage) {
            people[this.objName].extraInfo[1] -= damage / people[this.objName].maxHealth + 0.1 * Math.sqrt(1 - (people[this.objName].health / people[this.objName].maxHealth))
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
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 0, 1) * 10
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 1, 1) * 10
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 2, 1) * 6
            if (people[this.objName].sEffects.includes(3)) {people[this.objName].extraInfo[2] -= 10;}
            if (people[this.objName].sEffects.includes(4)) {people[this.objName].extraInfo[2] += 25;}
            if (people[this.objName].sEffects.includes(5)) {people[this.objName].extraInfo[2] -= 20;}
            if (people[this.objName].sEffects.includes(6)) {people[this.objName].extraInfo[2] -= 15;}
            if (people[this.objName].sEffects.includes(7)) {people[this.objName].extraInfo[2] -= 20;}
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 8, 4) * 25
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 9, 4) * 15
            people[this.objName].extraInfo[2] += allInstEffect(this.objName, 10, 4) * 10
            people[this.objName].extraInfo[2] += allInstEffect(this.objName, 11, 4) * 10
            people[this.objName].extraInfo[2] += allInstEffect(this.objName, 12, 4) * 15
            people[this.objName].extraInfo[2] += allInstEffect(this.objName, 13, 4) * 12.5
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 14, 4) * 5
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 16, 4) * 20
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 17, 4) * 5
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 20, 2) * 30
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 21, 4) * 15
            people[this.objName].extraInfo[2] += allInstEffect(this.objName, 21, 4) * 10
            people[this.objName].extraInfo[2] -= allInstEffect(this.objName, 21, 4) * 12.5
            let x = people[this.objName].health / people[this.objName].maxHealth
            people[this.objName].extraInfo[2] += 30 * ((-9*(x**2)) + (12*x) - 3)
            for (let i = 0; i < people[this.objName].extraInfo[3].length; ++i){
                if (people[people[this.objName].extraInfo[3][i]].alive === false){ 
                    people[this.objName].extraInfo[2] -= people[this.objName].extraInfo[4][i]
                }
            }
        },
        atk() {
            people[this.objName].updateSTATEffects()
            let atk = people[this.objName].trueAtk
            return atk
        },
        doTurn() {
            if (people[this.objName].extraInfo[0] <= 60) {
                people[this.objName].damage(this.objName, (60 - people[this.objName].extraInfo[1]) / 150 * people[this.objName].maxHealth, [0], [1], 0, [""], 3);
            } else {
                people[this.objName].heal(this.objName, [(people[this.objName].extraInfo[1] - 60) / 150 * people[this.objName].maxHealth], 0, ["Normal", "Physical"]);
            }
            allInQueue();
            let action = intRand(0, 2)
            let actionList = ["zap", "punch", "stab"]
            let target
            switch (action){
                case 0:
                    // * zap
                    target = this.defaultAct.target(["normal", "normal"])
                    people[this.objName].damage(target, 0.6 * this.atk(), [10, 2], [2, 6], 50, ["Normal", "Electric"], 0)
                    allInQueue()
                    break;
                case 1:
                    // * punch
                    target = this.defaultAct.target(["normal", "normal"])
                    people[this.objName].damage(target, 1.2 * this.atk(), [20, 4], [2, 4], 25, ["Normal", "Physical"], 0)
                    allInQueue()
                    break;
                case 2:
                    // * stab
                    target = this.defaultAct.target(["normal", "normal"])
                    people[this.objName].damage(target, 0.8 * this.atk(), [3, 0.1], [5, 32], 15, ["Normal", "Physical"], 0)
                    if (Math.random() > 80) {people[this.objName].giveStatusEffect(target, 1, intRand(2, 4), 0.35 * this.atk(), 0);}
                    allInQueue()
                    break;
                default:
                    throw new Error("that's not a valid action...  " + action)
            }
            console.log(`Alterian Skyler did ${actionList[action]}`)
        }
    },
    "ToWM TowerSB": {
        defaultAct: objectBasics(people["ToWM TowerSB"]),
        doTurn() {
            
        }
    }   , 
    "ToFUN TowerSB": {
        defaultAct: objectBasics(people["ToFUN TowerSB"]),
        doTurn() {
            
        }
    }   , 
    "Delet Ball": {
        defaultAct: objectBasics(people["Delet Ball"]),
        doTurn() {
            
        }
    },
}