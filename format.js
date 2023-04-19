"use strict";
const listS = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]
const list2 = ["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]
const list10 = ["", "Dc", "Vg", "Tr", "Qe", "Qt", "Se", "St", "Og", "Nv", "Ce"]

function format(num, dec, limit){
    if (num > limit){
        let abb
        let abbN = Math.floor(Math.log10(num) / 2.99999999)
        if (abbN >= listS.length){
            abb = list2[(abbN - 1) % 10] + list10[Math.floor((abbN - 1) / 10)]
        } else {
            abb = listS[abbN]
        }
        num = 10 ** (Math.log10(num) % 3)
        return num.toFixed(dec) + " " + abb
    } else {
        return num.toLocaleString()
    }
}