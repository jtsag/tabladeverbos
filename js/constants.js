// Constants for verb endings
const AR = 0;
const ER = 1;
const IR = 2;

// Constants for stem change types
const NO_SC = 0;
const E_IE = 1;
const E_I = 2;
const O_UE = 3;

// Constants for subjects
const YO = 0;
const TU = 1;
const EL = 2;
const NOSOTROS = 3;
const ELLOS = 4;
const VOSOTROS = 5;

// Constants that contain the building blocks of the verbs
const reflexive_pronouns = ["me", "te", "se", "nos", "se", "os"]
const pres_endings = [["o", "as", "a", "amos", "an", "áis"], ["o", "es", "e", "emos", "en", "éis"], ["o", "es", "e", "imos", "en", "ís"]]
const imp_endings = [["aba", "abas", "aba", "ábamos", "aban"], ["ía", "ías", "ía", "íamos", "ían"]]
const pret_endings = [["é", "aste", "ó", "amos", "aron"], ["í", "iste", "ió", "imos", "ieron"]]
const haber_pres = ["he", "has", "ha", "hemos", "han"]
const fut_endings = ["é", "ás", "á", "emos", "án"]
const haber_subj = ["haya", "hayas", "haya", "hayamos", "hayan"];
const haber_imp_subj = [["hubiera", "hubieras", "hubiera", "hubiéramos", "hubieran"], ["hubiese", "hubieses", "hubiese", "hubiésemos", "hubiesen"]]
const imp_subj_endings = [["ra", "ras", "ra", "ramos", "ran"], ["se", "ses", "se", "semos", "sen"]]
const e_subs = ["i", "you", "he", "we", "they"];

// Current verbs supported
const SP6_VERBS = ["acostarse", "adquirir", "atraer", "conseguir", "construir", "despedir", "divertirse", "escoger", "forzar", "freír", "elegir", "medir",
    "morir", "ofrecer", "portarse", "producir", "referir", "reñir", "sentarse", "sonreír", "sentirse", "sugerir", "torcer", "vestirse"];
const SP5_VERBS = ["hablar", "comer", "vivir", "comenzar", "contar", "pensar", "volver", "entender", "dormir", "pedir", "huir","mentir", "creer", "seguir", 
    "andar", "conducir", "reír", "caber", "dar", "caer", "saber", "poner", "hacer", "ir", "estar", "tener", "querer", "valer"];