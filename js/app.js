var sujeto; // Subject the chart is set to
var level; // The Spanish level that guides the verb list

function init() {
    changeSubject(); // Initialize sujeto to a random value
    level = 5; // Set default to Spanish 5
}

// Randomly change the subject the chart is set to
function changeSubject() {

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

// Check the chart and output feedback
function checkChart() {
    getSolution(sujeto);
}

// Clear all the cells
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

// Toggle between the verb selector modes
function switchLevel() {
    if(level == 5) {
        level = 6;
        toggleVerb(SP6_VERBS);
        document.getElementById("level").value = "Spanish 6";
    } else {
        level = 5;
        toggleVerb(SP5_VERBS);
        document.getElementById("level").value = "Spanish 5";
    }
}

// Internal method to change the verb dropdown selection
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
