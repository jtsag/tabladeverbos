var sujeto;
var reflexive_pronouns;
var pres_endings;
var imp_endings;
var pret_endings;
var haber_pres;
var fut_endings;
var imp_subj_endings;
var haber_subj;
var haber_imp_subj;
var e_subs;
var verbo;
var level;

function init() {
    sujeto = -1;
    changeSubject();
    reflexive_pronouns = ["me", "te", "se", "nos", "se", "os"]
    pres_endings = [["o", "as", "a", "amos", "an", "áis"], ["o", "es", "e", "emos", "en", "éis"], ["o", "es", "e", "imos", "en", "ís"]]
    imp_endings = [["aba", "abas", "aba", "ábamos", "aban"], ["ía", "ías", "ía", "íamos", "ían"]]
    pret_endings = [["é", "aste", "ó", "amos", "aron"], ["í", "iste", "ió", "imos", "ieron"]]
    haber_pres = ["he", "has", "ha", "hemos", "han"]
    fut_endings = ["é", "ás", "á", "emos", "án"]
    haber_subj = ["haya", "hayas", "haya", "hayamos", "hayan"];
    haber_imp_subj = [["hubiera", "hubieras", "hubiera", "hubiéramos", "hubieran"], ["hubiese", "hubieses", "hubiese", "hubiésemos", "hubiesen"]]
    imp_subj_endings = [["ra", "ras", "ra", "ramos", "ran"], ["se", "ses", "se", "semos", "sen"]]
    e_subs = ["i", "you", "he", "we", "they"];
    level = 5;
}

function changeSubject() {
    clearScreen();
    sujeto = Math.floor(Math.random() * 5);
    switch(sujeto) {
        case 0:
            document.getElementById("sujeto").value = "sujeto--yo";
            break;
        case 1:
            document.getElementById("sujeto").value = "sujeto--tú";
            break;
        case 2:
            document.getElementById("sujeto").value = "sujeto--él";
            break;
        case 3:
            document.getElementById("sujeto").value = "sujeto--nosotros";
            break;
        case 4:
            document.getElementById("sujeto").value = "sujeto--ellos";
            break;
        default:
            break;
    }
}

function getSolution() {
    verbo = document.getElementById("verbSelector").value;
    var attr = getAttributes(verbo);
    var plain_verb;
    if(attr[1]) {
        plain_verb = verbo.substring(0, verbo.length - 2);
    } else {
        plain_verb = verbo;
    }
    var stem = plain_verb.substring(0, plain_verb.length - 2);

    var spanish = [];
    //infinitive
    var infin = plain_verb;
    if(attr[1]) {
        infin += reflexive_pronouns[sujeto];
    }
    spanish.push(infin);

    //gerund
    var ger;
    if(attr[3]["gerund"] == null) {
        if(attr[0] == 2 && attr[2] != 0) {
            ger = stemChange(stem, attr[2], true);
        } else {
            ger = stem;
        }
        if(attr[0] == 0) {
            if(attr[1]) {
                ger = [ger + "ándo" + reflexive_pronouns[sujeto], reflexive_pronouns[sujeto] + " - " + ger + "ando"];
            } else {
                ger += "ando";
            }
        } else {
            if(attr[1]) {
                ger = [ger + "iéndo" + reflexive_pronouns[sujeto], reflexive_pronouns[sujeto] + " - " + ger + "iendo"];
            } else {
                ger += "iendo";
            }
        }
    } else {
        ger = attr[3]["gerund"];
    }
    spanish.push(ger);

    //participle
    var part;
    if(attr[3]["participle"] == null) {
        if(attr[0] == 0) {
            part = stem + "ado";
        } else {
            part = stem + "ido";
        }
        if(attr[1]) {
            part = reflexive_pronouns[sujeto] + " - " + part;
        }
    } else {
        part = attr[3]["participle"];
        if(part instanceof Array) {
            part = part[0];
        }
    }
    spanish.push(part);

    //present
    var pres;
    if(attr[3]["pres"] != null) {
        pres = attr[3]["pres"][sujeto];
    }
    else { 
        if(sujeto == 3) {
            if(attr[0] == 2 && stem.substring(stem.length - 1) == "e") {
                pres = stem + "ímos";
            } else {
                pres = stem + pres_endings[attr[0]][sujeto];
            }
        } else if(sujeto == 0) {
            pres = getYo(stem, attr);
        }else {
            if(attr[3]["boot"] == null) {
                pres = stemChange(stem, attr[2], false) + pres_endings[attr[0]][sujeto];    
            } else {
                pres = attr[3]["boot"] + pres_endings[attr[0]][sujeto];
            }
        }
    }
    if(attr[1]) {
        pres = reflexive_pronouns[sujeto] + " "+ pres;
    }
    spanish.push(pres);

    //imperfect
    var imp;
    if(attr[3]["imp"] != null) {
        imp = attr[3]["imp"][sujeto];
    } else {
        var suj_idx = attr[0] == 0? 0:1;
        imp = stem + imp_endings[suj_idx][sujeto];
        if(attr[1]) {
            imp = reflexive_pronouns[sujeto] +" "+ imp;
        }
    }
    spanish.push(imp);

    //pret
    var pret;
    if(sujeto == 2 || sujeto == 4) {
        pret = getEllos(stem, attr, sujeto);
        if(attr[1]) {
            pret = "se " + pret;
        }
    } else {
        if(attr[3]["pret"] == null) {
            if(sujeto == 0 && attr[0] == 0) {
                if(stem.substring(stem.length - 1) == "z") {
                    pret = stem.substring(0, stem.length - 1) + "c" + pret_endings[suj_idx][sujeto];
                } else if(stem.substring(stem.length - 1) == "g") {
                    pret = stem.substring(0, stem.length - 1) + "gu" + pret_endings[suj_idx][sujeto];
                } else if(stem.substring(stem.length - 1) == "c") {
                    pret = stem.substring(0, stem.length - 1) + "qu" + pret_endings[suj_idx][sujeto];
                } else {
                    pret = stem + pret_endings[suj_idx][sujeto];
                }
            } else if(suj_idx == 1 && (stem.substring(stem.length - 1) == "e") || stem.substring(stem.length - 1) == "a") {
                var ending = pret_endings[suj_idx][sujeto];
                ending = "í" + ending.substring(1);
                pret = stem + ending;
            } else {
                pret = stem + pret_endings[suj_idx][sujeto];
            }
        } else {
            pret = attr[3]["pret"][sujeto];
        }
        if(attr[1]) {
            pret = reflexive_pronouns[sujeto] +" "+ pret;
        }
    }
    spanish.push(pret);

    //present perfect
    if(attr[1]) {
        spanish.push(part.replace("-", haber_pres[sujeto]));
    } else {
        spanish.push(haber_pres[sujeto] + " " + part);
    }

    //pluperfect
    if(attr[1]) {
        spanish.push(part.replace("-", "hab" + imp_endings[1][sujeto]));
    } else {
        spanish.push("hab" + imp_endings[1][sujeto] + " " + part);
    }

    //future
    var fut;
    if(attr[3]["future"] == null) {
        fut = plain_verb + fut_endings[sujeto];
    } else {
        fut = attr[3]["future"] + fut_endings[sujeto];
    }
    if(attr[1]) {
        fut = reflexive_pronouns[sujeto] + " " + fut;
    }
    spanish.push(fut);

    //fut perf
    if(attr[1]) {
        spanish.push(part.replace("-", "habr" + fut_endings[sujeto]));
    } else {
        spanish.push("habr" + fut_endings[sujeto] + " " + part);
    }

    //cond
    var cond;
    if(attr[3]["future"] == null) {
        cond = plain_verb + imp_endings[1][sujeto];
    } else {
        cond = attr[3]["future"] + imp_endings[1][sujeto];
    }
    if(attr[1]) {
        cond = reflexive_pronouns[sujeto] + " " + cond;
    }
    spanish.push(cond);

    //cond perf
    if(attr[1]) {
        spanish.push(part.replace("-", "habr" + imp_endings[1][sujeto]));
    } else {
        spanish.push("habr" + imp_endings[1][sujeto] + " " + part);
    }

    //pres subj :,(
    spanish.push(getPresSubj(stem, attr, sujeto));

    //imp subj
    var imp_subj = getEllos(stem, attr, 4);
    imp_subj = imp_subj.substring(0, imp_subj.length - 3);
    if(attr[1]) {
        // imp_subj = imp_subj.substring(3);
        imp_subj = reflexive_pronouns[sujeto] + " " + imp_subj;
    }
    if(sujeto == 3) {
        if(attr[0] == 0) {
            imp_subj = imp_subj.substring(0, imp_subj.length - 1) + "á";
        } else {
            imp_subj = imp_subj.substring(0, imp_subj.length - 1) + "é";
        }
    }
    spanish.push([imp_subj + imp_subj_endings[0][sujeto], imp_subj + imp_subj_endings[1][sujeto]]);

    //pres. perf subj
    if(attr[1]) {
        spanish.push(part.replace("-", haber_subj[sujeto]));
    } else {
        spanish.push(haber_subj[sujeto] + " " + part);
    }

    //pluperf subj
    if(attr[1]) {
        spanish.push([part.replace("-", haber_imp_subj[0][sujeto]), part.replace("-", haber_imp_subj[1][sujeto])]);
    } else {
        spanish.push([haber_imp_subj[0][sujeto] + " " + part, haber_imp_subj[1][sujeto] + " " + part]);
    }

    // Tu +
    var tup;
    if(attr[3]["command"] != null) {
        tup = attr[3]["command"];
    }
    else if(attr[3]["pres"] != null) {
        tup = attr[3]["pres"][2];
    }
    else {
        if(attr[3]["boot"] == null) {
            tup = stemChange(stem, attr[2], false);    
        } else {
            tup = attr[3]["boot"];
        }
        if(attr[1]) {
            tup = addAccent(tup);
            tup += pres_endings[attr[0]][2] + reflexive_pronouns[1];
        } else {
            tup += pres_endings[attr[0]][2];
        }
    }
    spanish.push([tup, "¡" + tup + "!"]);

    //tun
    spanish.push(["no " + getPresSubj(stem, attr, 1), "¡" + "no " + getPresSubj(stem, attr, 1) + "!"]);

    //ud
    var base_ud = getPresSubj(stem, attr, 2);
    if(attr[1]) {
        var temp = base_ud.substring(base_ud.length - 1);
        base_ud = base_ud.substring(3, base_ud.length - 1);
        base_ud = addAccent(base_ud) + temp + "se";
    }
    spanish.push([base_ud, "¡" + base_ud + "!"]);

    //uds
    var base_uds = getPresSubj(stem, attr, 4);
    if(attr[1]) {
        var temp = base_uds.substring(base_uds.length - 2);
        base_uds = base_uds.substring(3, base_uds.length - 2);
        base_uds = addAccent(base_uds) + temp + "se";
    }
    spanish.push([base_uds, "¡" + base_uds + "!"]);

    //vosotros
    var vosn = "no " + getPresSubj(stem, attr, 5);
    var vosp = plain_verb.substring(0, plain_verb.length - 1) + "d";
    if(attr[1]) {
        if(attr[0] == 2) {
            vosp = vosp.substring(0, vosp.length - 2) + "íos";
        } else {
            vosp = vosp.substring(0, vosp.length - 1) + "os";
        }
    }
    spanish.push([vosn, vosp, "¡" + vosn + "!", "¡" + vosp + "!"]);
    spanish.push([vosp, vosn, "¡" + vosp + "!", "¡" + vosn + "!"]);

    //nosotros
    var nosotros;
    if(attr[3]["nos"] != null) {
        nosotros = attr[3]["nos"];
    } else {
        nosotros = getPresSubj(stem, attr, 3);
        if(attr[1]) {
            nosotros = nosotros.substring(4, nosotros.length - 3);
            if(nosotros.substring(nosotros.length - 1) == "a") {
                nosotros = nosotros.substring(0, nosotros.length - 1) + "ámonos";
            } else if(nosotros.substring(nosotros.length - 1) == "e") {
                nosotros = nosotros.substring(0, nosotros.length - 1) + "émonos";
            }
        }
    }
    spanish.push([nosotros, "¡" + nosotros + "!"]);
    
    for(var i = 0; i < spanish.length; i++) {
        var obj = spanish[i];
        if(!(obj instanceof Array)) {
            obj = [obj];
        }
        if(attr[3]["participle"] != null && attr[3]["participle"] instanceof Array) {
            for(var j = 0; j < obj.length; j++) {
                if(obj[j].includes(attr[3]["participle"][0])) {
                    obj.push(obj[j].replace(attr[3]["participle"][0], attr[3]["participle"][1]));
                }
            }
        }
        spanish[i] = obj;
    }

    //Then construct the english
    var english = [];
    for(var i =0; i < 23; i++) {
        english.push([]);
    }
    for(var i =0; i < attr[4].length; i++) {
        var curr_ops = attr[4][i];
        var be = false;
        var go = false;
        var have = false;
        var space = false;
        if(curr_ops[0] == "be worth" || curr_ops[0] == "be") {
            be = true;
        } else if(curr_ops[0] == "go to bed" || curr_ops[0] == "go") {
            go = true;
        } else if(curr_ops[0] == "have" || curr_ops[0] == "have fun") {
            have = true;
        } else if(curr_ops[0].indexOf(" ") != -1) {
            space = true;
        }
        english[0].push(new RegExp("^" + "to " + curr_ops[0] + "$"));
        english[1].push(new RegExp("^" + curr_ops[1] + "$"));
        english[2].push(new RegExp("^" + curr_ops[2] + "$"));
        if(go) {
            if(sujeto == 2) {
                english[3].push(new RegExp("^" + e_subs[sujeto] + " goes" + curr_ops[0].substring(2) + "$"));
            } else {
                english[3].push(new RegExp("^" + e_subs[sujeto] + " " + curr_ops[0] + "$"));
            }
        } else if(have) {
            if(sujeto == 2) {
                english[3].push(new RegExp("^" + e_subs[sujeto] + " has" + curr_ops[0].substring(4) + "$"));
            } else {
                english[3].push(new RegExp("^" + e_subs[sujeto] + " " + curr_ops[0] + "$"));
            }
        } else if(space) {
            if(sujeto == 2) {
                english[3].push(new RegExp("^" + e_subs[sujeto] + " " + curr_ops[0].substring(0, curr_ops[0].indexOf(" ")) + "s" + curr_ops[0].substring(curr_ops[0].indexOf(" ")) + "$"));
            } else {
                english[3].push(new RegExp("^" + e_subs[sujeto] + " " + curr_ops[0] + "$"));
            }
        } else {
            if(sujeto == 0 && be) {
                english[3].push(new RegExp("^" + e_subs[sujeto] + " am" + curr_ops[0].substring(2) + "$"));
            } else if(sujeto == 2) {
                if(be) {
                    english[3].push(new RegExp("^" + e_subs[sujeto] + " is" + curr_ops[0].substring(2) + "$"));
                } else {
                    english[3].push(new RegExp("^" + e_subs[sujeto] + " " + curr_ops[0] + "s" + "$"));
                }
            } else if(be && (sujeto == 1 || sujeto == 3 || sujeto == 4)) {
                english[3].push(new RegExp("^" + e_subs[sujeto] + " are" + curr_ops[0].substring(2) + "$"));
            } else {
                english[3].push(new RegExp("^" + e_subs[sujeto] + " " + curr_ops[0] + "$"));
            }
        }
        
        english[4].push(new RegExp("^" + e_subs[sujeto] + " used to " + curr_ops[0] + "$"));
        if(!be) {    
            if(sujeto == 0 || sujeto == 2) {
                english[4].push(new RegExp("^" + e_subs[sujeto] + " was " + curr_ops[1] + "$"));
            } else {
                english[4].push(new RegExp("^" + e_subs[sujeto] + " were " + curr_ops[1] + "$"));
            }
        }
        if(be && (sujeto == 1 || sujeto == 3 || sujeto == 4)) {
            english[5].push(new RegExp("^" + e_subs[sujeto] + " were" + curr_ops[0].substring(2) + "$"))
        } else {
            english[5].push(new RegExp("^" + e_subs[sujeto] + " " + curr_ops[3] + "$"));
        }
        if(sujeto != 2) {
            english[6].push(new RegExp("^" + e_subs[sujeto] + " have " + curr_ops[2] + "$"));
        } else {
            english[6].push(new RegExp("^" + e_subs[sujeto] + " has " + curr_ops[2] + "$"));
        }
        english[7].push(new RegExp("^" + e_subs[sujeto] + " had " + curr_ops[2] + "$"));
        english[8].push(new RegExp("^" + e_subs[sujeto] + " will " + curr_ops[0] + "$"));
        english[9].push(new RegExp("^" + e_subs[sujeto] + " will have " + curr_ops[2] + "$"));
        english[10].push(new RegExp("^" + e_subs[sujeto] + " would " + curr_ops[0] + "$"));
        english[11].push(new RegExp("^" + e_subs[sujeto] + " would have " + curr_ops[2] + "$"));
        english[11].push(new RegExp("^" + e_subs[sujeto] + " would.ve " + curr_ops[2] + "$"));
        english[12].push(new RegExp("^" + "that " + e_subs[sujeto] + " " + curr_ops[0] + "$"));
        if(!be) {
            english[13].push(new RegExp("^" + "that " + e_subs[sujeto] + " were " + curr_ops[1] + "$"));
        }
        if(curr_ops[4] != null) {
            english[13].push(new RegExp("^" + "that " + e_subs[sujeto] + " " + curr_ops[4] + "$"));
        } else {
            english[13].push(new RegExp("^" + "that " + e_subs[sujeto] + " " + curr_ops[3] + "$"))
        }
        english[14].push(new RegExp("^" + "that " + e_subs[sujeto] + " have " + curr_ops[2] + "$"));
        english[15].push(new RegExp("^" + "that " + e_subs[sujeto] + " had " + curr_ops[2] + "$"));
        english[16].push(new RegExp("^" + curr_ops[0] + "!?" + "$"));
        english[17].push(new RegExp("^" + "don.t " + curr_ops[0] + "!?" + "$"));
        english[18].push(new RegExp("^" + curr_ops[0] + "!?" + "$"));
        english[19].push(new RegExp("^" + curr_ops[0] + "!?" + "$"));
        english[20].push(new RegExp("^" + "\\(don.t\\) " + curr_ops[0] + "!?" + "$"));
        english[20].push(new RegExp("^" + "don.t " + curr_ops[0] + "/" + curr_ops[0] + "!?" + "$"));
        english[20].push(new RegExp("^" + curr_ops[0] + "/" + "don.t " + curr_ops[0] + "!?" + "$"));
        english[22].push(new RegExp("^" + "let.s " + curr_ops[0] + "!?" + "$"));
    }
    var order = ["inf", "ger", "part_pas", "pres", "imp", "pret", "pres_perf", "plu_perf", "fut", "fut_perf", "cond", "cond_perf", "pres_subj", 
    "imp_subj", "pres_perf_subj", "plu_perf_subj", "tu_pos", "tu_neg", "ud", "uds", "vos", "vos", "nos"];

    var changed = false;
    for(var i = 0; i < order.length; i++) {
        var span_name = order[i];
        switch(i) {
            case 20:
                span_name += "_one_spanish";
                break;
            case 21:
                span_name += "_two_spanish";
                break;
            default:
                span_name +="_spanish";
                break;
        }
        var eng_name = order[i] + "_ingles";
        var span_ans = document.getElementById(span_name).value;
        var eng_ans = document.getElementById(eng_name).value;
        
        span_ans = span_ans == null? "" : span_ans.toLowerCase().trim();
        eng_ans = eng_ans == null? "" : eng_ans.toLowerCase().trim();

        if(span_ans == "" || !spanish[i].includes(span_ans)) {
            var most_similar;
            do {
                most_similar = getMostSimilar(span_ans, spanish[i]);
                spanish[i] = spanish[i].filter(item => item != most_similar)
            } while(i == 21 && document.getElementById("vos_one_spanish").value.indexOf(most_similar) != -1 && spanish[i].length > 0)
            document.getElementById(span_name).value += " **" + most_similar + "**";
            document.getElementById(span_name).style.color = "red";
            changed = true;
        }
        if(i != 21 && (eng_ans == "" || !english[i].some(elem => elem.test(eng_ans)))) {
            document.getElementById(eng_name).value += " **" + getMostSimilar(eng_ans, english[i]) + "**";
            document.getElementById(eng_name).style.color = "red";
            changed = true;
        }
    }
    if(!changed) {
        alert("¡Perfecto!");
    }
}

function getMostSimilar(input, answers) {
    var minDist = 999;
    var minIdx = -1;
    var minLength = 999;
    for(var i = 0; i < answers.length; i++) {
        var curr_ans;
        if(answers[i] instanceof RegExp) {
            curr_ans = cleanString(answers[i].source);
        } else  {
            curr_ans = answers[i];
        }
        if(curr_ans.length < minLength) {
            minLength = curr_ans.length;
        }
        var sim_score = similarity(curr_ans, input);
        if(sim_score < minDist) {
            minDist = sim_score;
            minIdx = i;
        }
    }
    if(minDist == minLength)  {
        return answers[0] instanceof RegExp? cleanString(answers[0].source) : answers[0];
    } else {
        return answers[minIdx] instanceof RegExp? cleanString(answers[minIdx].source) : answers[minIdx];
    }
}

function cleanString(str) {
    return str.replace(".", "'").replace("?", "").replace(/\\/g, "").replace("^", "").replace("$", "");
}

function similarity(str1, str2) {
    
    let dp = [];
    for (let i = 0; i <= str1.length; i++) {
        dp[i] = [i];
    }
    for (let j = 0; j <= str2.length; j++) {
        dp[0][j] = j;
    }

    
    for (let i = 1; i <= str1.length; i++) {
        for (let j = 1; j <= str2.length; j++) {
            let cost = (str1.charAt(i - 1) == str2.charAt(j - 1)) ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,     
                dp[i][j - 1] + 1,     
                dp[i - 1][j - 1] + cost  
            );
        }
    }
    
    return dp[str1.length][str2.length];
}

function addAccent(word) {
    var tup = word;
    for(var i = tup.length - 1; i >= 0; i--) {
        if(tup.substring(i, i+1) == "a") {
            tup = tup.substring(0,i) + "á" + tup.substring(i+1);
            break;
        } else if(tup.substring(i, i+1) == "e") {
            tup = tup.substring(0,i) + "é" + tup.substring(i+1);
            break;
        } else if(tup.substring(i, i+1) == "i") {
            tup = tup.substring(0,i) + "í" + tup.substring(i+1);
            break;
        } else if(tup.substring(i, i+1) == "o") {
            tup = tup.substring(0,i) + "ó" + tup.substring(i+1);
            break;
        } else if(tup.substring(i, i+1) == "u") {
            tup = tup.substring(0,i) + "ú" + tup.substring(i+1);
            break;
        }
    }
    return tup;
}

function getPresSubj(stem, attr, sujeto1) {
    var pres_subj;
    var opp = attr[0] == 0? 1:0;
    var sujeto = sujeto1 == 0? 2:sujeto1;
    if(attr[3]["subj"] != null) {
        return attr[3]["subj"][sujeto];
    }
    if(sujeto == 3 || sujeto == 5) {
        pres_subj = getYo(stem, attr);
        pres_subj = pres_subj.substring(0, pres_subj.length - 1);
        if(attr[2] != 0 || stem == "adquir")  {
            var find;
            var change;
            for(var i = 0; i < pres_subj.length; i++) {
                if(pres_subj.substring(i, i+1) == "í") {
                    pres_subj = pres_subj.substring(0,i) + "i" + pres_subj.substring(i+1);
                }
            }
            if(attr[0] != 2) {
                if(attr[2] == 1) {
                    find = "ie";
                    change = "e";
                }
                else if(attr[2] == 2) {
                    find = "i";
                    change = "e";
                }
                else if(attr[2] == 3) {
                    find = "ue";
                    change = "o";
                }
            } else {
                if(attr[2] == 1) {
                    find = "ie";
                    change = "i";
                }
                else if(attr[2] == 2) {
                    find = "i";
                    change = "i";
                }
                else if(attr[2] == 3) {
                    find = "ue";
                    change = "u";
                }  else if(stem == "adquir") {
                    find = "ie";
                    change = "i";
                }
            }
            for(var i = 0; i < pres_subj.length - 1; i++) {
                var look = pres_subj.substring(pres_subj.length - i - find.length, pres_subj.length - i);
                if(look == find) {
                    pres_subj = pres_subj.substring(0, pres_subj.length - i - find.length) + change + pres_subj.substring(pres_subj.length - i);
                    break;
                }
            }
        }
        pres_subj += pres_endings[opp][sujeto];
    } else {
        pres_subj = getYo(stem, attr);
        pres_subj = pres_subj.substring(0, pres_subj.length - 1) + pres_endings[opp][sujeto];
    }
    if(attr[1]) {
        pres_subj = reflexive_pronouns[sujeto1] + " " + pres_subj;
    }
    if(attr[0] == 0) {
        var ending = pres_endings[opp][sujeto];
        var inspect = pres_subj.substring(pres_subj.length - ending.length - 1, pres_subj.length - ending.length);
        if(inspect == "c") {
            pres_subj = pres_subj.substring(0, pres_subj.length - ending.length - 1) + "qu" + pres_subj.substring(pres_subj.length - ending.length);
        } else if(inspect == "g") {
            pres_subj = pres_subj.substring(0, pres_subj.length - ending.length - 1) + "gu" + pres_subj.substring(pres_subj.length - ending.length);
        } else if(inspect == "z") {
            pres_subj = pres_subj.substring(0, pres_subj.length - ending.length - 1) + "c" + pres_subj.substring(pres_subj.length - ending.length);
        }
    }
    return pres_subj;
}

function getEllos(stem, attr, sujeto) {
    var pret;
    var idx = sujeto == 2? 3:6;
    var suj_idx = attr[0] == 0? 0:1;
    if(attr[0] == 2) {
        pret = stemChange(stem, attr[2], true) + pret_endings[suj_idx][sujeto];
    } else {
        pret = stem + pret_endings[suj_idx][sujeto];
    }
    if(suj_idx == 1) {
        var start = pret.length - idx;
        var end = pret.length - idx + 1;
        if(pret.substring(start, end) == "i") {
            pret = pret.substring(0, start) + pret.substring(end);
        } else if(pret.substring(start, end) == "a" || pret.substring(start, end) == "e" || pret.substring(start, end) == "u" && 
                pret.substring(start - 1, start) != "q" && pret.substring(start-1, start) != "g") {
            pret = pret.substring(0, pret.length - idx + 1) + "y" + pret.substring(pret.length - idx + 2);
        }
    }
    if(attr[3]["pret"] != null) {
        pret = attr[3]["pret"][sujeto];
    }
    // if(attr[1]) {
    //     pret = "se "+ pret;
    // }
    return pret;
}

function getYo(stem, attr) {
    var tbr;
    if(attr[3]["yo"] == null) {
        if(attr[3]["boot"] == null) {
            tbr= stemChange(stem, attr[2], false) + "o";
        } else {
            tbr= attr[3]["boot"] + "o";
        }
    } else {
        tbr= attr[3]["yo"] + "o";
    }
    return tbr;
}

function stemChange(stem, type, oneLetter) {
    if(type == 0) {
        return stem;
    }
    var tbr;
    var i;
    for(i = stem.length - 1; i >= 0; i--) {
        if(stem.substring(i, i+1) == "e") {
            if(type == 1) {
                if(oneLetter) {
                    tbr = stem.substring(0,i) + "i";
                    break;
                } else {
                    tbr = stem.substring(0,i) + "ie";
                    break
                }
            } else if(type == 2) {
                tbr = stem.substring(0,i) + "i";
                break;
            }
        } else if(stem.substring(i, i+1) == "o") {
            if(type == 3) {
                if(oneLetter) {
                    tbr = stem.substring(0,i) + "u";
                    break;
                } else {
                    tbr = stem.substring(0,i) + "ue";
                    break;
                }
            }
        }
    }
    if(i != stem.length-1) {
        tbr += stem.substring(i+1);
    }
    return tbr;
}

function getAttributes(verb) {
    //form: [ar/er/ir, reflexive, stem change, {special forms}, [[infinitive, gerund, participle, pret, imp subj],[infinitive, etc.]]]
    switch(verb) {
        case "hablar":
            return [0, false, 0, {}, [["talk", "talking", "talked", "talked", "talked"], ["speak", "speaking", "spoken", "spoke", "spoke"]]];
        case "comer":
            return [1, false, 0, {}, [["eat", "eating", "eaten", "ate", "ate"]]];
        case "vivir":
            return [2, false, 0, {}, [["live", "living", "lived", "lived", "lived"]]];
        case "comenzar":
            return [0, false, 1, {}, [["start", "starting", "started", "started", "started"], ["begin", "beginning", "begun", "began", "began"]]];
        case "contar":
            return [0, false, 3, {}, [["count", "counting", "counted", "counted", "counted"]]];
        case "pensar":
            return [0, false, 1, {}, [["think", "thinking", "thought", "thought", "thought"]]];
        case "volver":
            return [1, false, 3, {"participle":"vuelto"}, [["return", "returning", "returned", "returned", "returned"]]];
        case "entender":
            return [1, false, 1, {}, [["understand", "understanding", "understood", "understood", "understood"]]];
        case "dormir":
            return [2, false, 3, {}, [["sleep", "sleeping", "slept", "slept", "slept"]]];
        case "pedir":
            return [2, false, 2, {}, [["order", "ordering", "ordered", "ordered", "ordered"]]];
        case "huir":
            return [2, false, 0, {"boot":"huy", "gerund":"huyendo"}, [["escape", "escaping", "escaped", "escaped", "escaped"], ["flee", "fleeing", "fled", "fled", "fled"]]];
        case "mentir":
            return [2, false, 1, {}, [["lie", "lying", "lied", "lied", "lied"]]];
        case "creer":
            return [1, false, 0, {"participle":"creído", "gerund":"creyendo"}, [["believe", "believing", "believed", "believed", "believed"]]];
        case "seguir":
            return [2, false, 2, {"yo":"sig"}, [["follow", "following", "followed", "followed", "followed"]]];
        case "andar":
            return [0, false, 0, {"pret":["anduve", "anduviste", "anduvo", "anduvimos", "anduvieron"]}, [["walk", "walking", "walked", "walked", "walked"]]];
        case "conducir":
            return [2, false, 0, {"yo":"conduzc", "pret":["conduje", "condujiste", "condujo", "condujimos", "condujeron"]}, [["drive", "driving", "driven","drove", "drove"]]];
        case "reír":
            return [2, false, 2, {"future":"reir", "participle":"reído", "boot":"rí", "gerund":"riendo"}, [["laugh", "laughing", "laughed", "laughed", "laughed"]]];
        case "caber":
            return [1, false, 0, {"future":"cabr", "yo":"quep", "pret":["cupe", "cupiste", "cupo", "cupimos", "cupieron"]}, [["fit", "fitting", "fit", "fit", "fit"], ["fit", "fitting", "fitted", "fitted", "fitted"]]];
        case "dar":
            return [0, false, 0, {"pret":["di", "diste", "dio", "dimos", "dieron"], "subj":["dé", "des", "dé", "demos", "den", "deis"], "pres":["doy", "das", "da", "damos", "dan", "dais"]}, [["give", "giving", "given", "gave", "gave"]]];
        case "caer":
            return [1, false, 0, {"participle":"caído", "yo":"caig", "gerund":"cayendo"}, [["fall", "falling", "fallen", "fell", "fell"]]];
        case "saber":
            return [1, false, 0, {"future": "sabr", "pres":["sé", "sabes", "sabe", "sabemos", "saben", "sabéis"], "pret":["supe", "supiste", "supo", "supimos", "supieron"], "subj":["sepa", "sepas", "sepa", "sepamos", "sepan", "sepáis"]}, [["know", "knowing", "known", "found out", "knew"]]];
        case "poner":
            return [1, false, 0, {"yo":"pong", "future":"pondr", "participle":"puesto", "pret":["puse", "pusiste", "puso", "pusimos", "pusieron"], "command":"pon"}, [["put", "putting", "put", "put", "put"], ["place", "placing", "placed", "placed", "placed"], ["set", "setting", "set", "set", "set"]]];
        case "hacer":
            return [1, false, 0, {"yo":"hag", "future":"har", "participle":"hecho", "pret":["hice", "hiciste", "hizo", "hicimos", "hicieron"], "command":"haz"}, [["do", "doing", "done", "did", "did"], ["make", "making", "made", "made", "made"]]];
        case "ir":
            return [2, false, 0, {"pres":["voy", "vas", "va", "vamos", "van", "vais"], "pret":["fui", "fuiste", "fue", "fuimos", "fueron"], "subj":["vaya", "vayas", "vaya", "vayamos", "vayan", "vayáis"], "command":"ve", "gerund":"yendo", "imp":["iba", "ibas", "iba", "íbamos", "iban"], "nos":"vamos"}, [["go", "going", "gone", "went", "went"]]];
        case "estar":
            return [0, false, 0, {"pres":["estoy", "estás", "está", "estamos", "están", "estáis"], "pret":["estuve", "estuviste", "estuvo", "estuvimos", "estuvieron"], "subj":["esté", "estés", "esté", "estemos", "estén", "estéis"]}, [["be", "being", "been", "was", "were"]]];
        case "tener":
            return [1, false, 1, {"yo":"teng", "future":"tendr", "command":"ten", "pret":["tuve", "tuviste", "tuvo","tuvimos", "tuvieron"]}, [["have", "having", "had", "received", "had"], ["have", "having", "had", "got", "had"]]];
        case "querer":
            return [1, false, 1, {"pret":["quise", "quisiste", "quiso", "quisimos", "quisieron"], "future":"querr"}, [["want", "wanting", "wanted", "tried", "wanted"], ["want", "wanting", "wanted", "refused", "wanted"]]];
        case "valer":
            return [1, false, 0, {"future":"valdr", "command":"val", "yo":"valg"}, [["be worth", "being worth", "been worth", "was worth", "were worth"], ["cost", "costing", "cost", "costed", "costed"]]];
        case "acostarse":
            return [0, true, 3, {}, [["go to bed", "going to bed", "gone to bed", "went to bed"]]];
        case "adquirir":
            return [2, false, 0, {"boot":"adquier"}, [["buy", "buying", "bought", "bought"], ["acquire", "acquiring", "acquired", "acquired"]]];
        case "atraer":
            return [1, false, 0, {"yo":"atraig", "participle":"atraído", "gerund":"atrayendo", "pret":["atraje", "atrajiste", "atrajo", "atrajimos", "atrajeron"]}, [["attract", "attracting", "attracted", "attracted"]]];
        case "conseguir":
            return [2, false, 2, {"yo":"consig"}, [["obtain", "obtaining", "obtained", "obtained"], ["get", "getting", "gotten", "got"]]];
        case "construir":
            return [2, false, 0, {"boot":"contruy", "gerund":"construyendo"}, [["construct", "constructing", "constructed", "constructed"], ["build", "building", "built", "built"]]];
        case "despedir":
            return [2, false, 2, {}, [["fire", "firing", "fired", "fired"]]];
        case "divertirse":
            return [2, true, 1, {}, [["have fun", "having fun", "had fun", "had fun"]]];
        case "escoger":
            return [1, false, 0, {"yo":"escoj"}, [["choose", "choosing", "chosen", "chose"], ["select", "selecting", "selected", "selected"]]];
        case "forzar":
            return [0, false, 3, {}, [["force", "forcing", "forced", "forced"]]];
        case "freír":
            return [2, false, 2, {"boot":"frí", "participle":["frito", "freído"], "future":"freir", "gerund":"friendo"}, [["fry", "frying", "fried", "fried"]]];
        case "elegir":
            return [2, false, 2, {"yo":"elij"}, [["choose", "choosing", "chosen", "chose"], ["select", "selecting", "selected", "selected"]]];
        case "medir":
            return [2, false, 2, {}, [["measure", "measuring", "measured", "measured"]]];
        case "morir":
            return [2, false, 3, {"participle":"muerto"}, [["die", "dying", "died", "died"]]];
        case "ofrecer":
            return [1, false, 0, {"yo":"ofrezc"}, [["offer", "offering", "offered", "offered"]]];
        case "portarse":
            return [0, true, 0, {}, [["behave", "behaving", "behaved", "behaved"]]];
        case "producir":
            return [2, false, 0, {"yo":"produzc", "pret":["produje", "produjiste", "produjo", "produjimos", "produjeron"]}, [["produce", "producing", "produced", "produced"]]];
        case "referir":
            return [2, false, 1, {}, [["refer", "referring", "referred", "referred"]]];
        case "reñir":
            return [2, false, 2, {"pret":["reñí", "reñiste", "riñó", "reñimos", "riñeron"], "gerund":"riñendo"}, [["scold", "scolding", "scolded", "scolded"]]];
        case "sentarse":
            return [0, true, 1, {}, [["sit", "sitting", "sat", "sat"]]];
        case "sonreír":
            return [2, false, 2, {"future":"sonreir", "participle":"sonreído", "boot":"sonrí", "gerund":"sonriendo"}, [["smile", "smiling", "smiled", "smiled"]]];
        case "sentirse":
            return [2, true, 1, {}, [["feel", "feeling", "felt", "felt"]]];
        case "sugerir":
            return [2, false, 1, {}, [["suggest", "suggesting", "suggested", "suggested"]]];
        case "torcer":
            return [1, false, 3, {"yo":"tuerz", "participle":["torcido", "tuerto"]}, [["twist", "twisting", "twisted", "twisted"]]];
        case "vestirse":
            return [2, true, 2, {}, [["get dressed", "getting dressed", "gotten dressed", "got dressed"]]];
        default:
            return null;
    }
}

function checkChart() {
    var sol = getSolution();
}

function clearScreen() {
    var order = ["inf", "ger", "part_pas", "pres", "imp", "pret", "pres_perf", "plu_perf", "fut", "fut_perf", "cond", "cond_perf", "pres_subj", 
    "imp_subj", "pres_perf_subj", "plu_perf_subj", "tu_pos", "tu_neg", "ud", "uds", "vos", "vos", "nos"];

    for(var i = 0; i < order.length; i++) {
        if(i == 20) {
            document.getElementById(order[i] + "_one_spanish").value = "";
            document.getElementById(order[i] + "_ingles").value = "";

            document.getElementById(order[i] + "_one_spanish").style.color = "black";
            document.getElementById(order[i] + "_ingles").style.color = "black";
        } else if(i == 21) {
            document.getElementById(order[i] + "_two_spanish").value = "";
            document.getElementById(order[i] + "_two_spanish").style.color = "black";
        } else {
            document.getElementById(order[i] + "_spanish").value = "";
            document.getElementById(order[i] + "_ingles").value = "";

            document.getElementById(order[i] + "_spanish").style.color = "black";
            document.getElementById(order[i] + "_ingles").style.color = "black";
        }
    }
}

function switchLevel() {
    let verb6 = ["acostarse", "adquirir", "atraer", "conseguir", "construir", "despedir", "divertirse", "escoger", "forzar", "freír", "elegir", "medir",
                 "morir", "ofrecer", "portarse", "producir", "referir", "reñir", "sentarse", "sonreír", "sentirse", "sugerir", "torcer", "vestirse"];
    let verb5 = ["hablar", "comer", "vivir", "comenzar", "contar", "pensar", "volver", "entender", "dormir", "pedir", "huir","mentir", "creer", "seguir", 
                 "andar", "conducir", "reír", "caber", "dar", "caer", "saber", "poner", "hacer", "ir", "estar", "tener", "querer", "valer"];
    if(level == 5) {
        level = 6;
        toggleVerb(verb6);
        document.getElementById("level").value = "Spanish 6";
    } else {
        level = 5;
        toggleVerb(verb5);
        document.getElementById("level").value = "Spanish 5";
    }
    clearScreen();
}

function toggleVerb(toSwitch) {
    var dropdown = document.getElementById("verbSelector");
    dropdown.innerHTML = "";
    for(var i = 0; i < toSwitch.length; i++) {
        var opt = document.createElement("option");
        opt.value = toSwitch[i];
        opt.text = toSwitch[i];
        dropdown.appendChild(opt);
    }
}
