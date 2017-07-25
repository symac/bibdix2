// config.js - Bibeverywhere's module
// author: Sylvain Machefert (Bordeaux 3)

// function bibdixGetURL(path) {
// 	return chrome.extension.getURL(path);
// }

var exports = {};

exports.IMG = {};
exports.LIB = {};
exports.URL_REBOND = {};

/***************************/
/* RCR à prendre en compte */
/***************************/
// Lister l'ensemble des RCR concernés en les séparant par une virgule.
exports.RCR = "330092101,330632101,330632102,330632103,330632201,330632209,330632212,330635106,331672201,331922101,331922302,332812201,333182101,333182102,333182103,333182104,333182201,333182204,333182205,333182207,333182208,333182210,333182211,335222101,335222102,335222103,335222105,335222106,335222107,335222108,335222109,335222110,335222201,335222203,335222205,335222209,335222216,335222221,335222228,335222229,335222230,335222306,335229901,335229904,335229905,335229906,335229907,335502201,400882201,401922201,470012101,470012102,470012202,644452201";
exports.DASHES = 0;

/********************************/
/* Rebonds vers catalogue local */
/********************************/
// Notice absente de nos bibliothèques ou bug, on renvoie vers la page d'accueil des bibliothèques
exports.URL_REBOND.res0 = "http://www.geobib.fr/babordplus/redirect.php?index=1";
// Notice présente dans nos bibliothèques, variable {{ISBN}} à l'endroit adéquat
exports.URL_REBOND.res1 = "http://www.geobib.fr/babordplus/redirect.php?isbn={{ISBN}}";

/********************************/
/* Affichage des disponibilités */
/********************************/
exports.IMG.absent = chrome.extension.getURL("data/img/absent.png");
exports.IMG.present = chrome.extension.getURL("data/img/present.png");
exports.IMG.inconnu = chrome.extension.getURL("data/img/inconnu.png");
exports.IMG.height = 32;
exports.IMG.width = 32;

/************************************/
/* Affichage dans la barre d'outils */
/************************************/
// Icônes utilisées dans la barre d'outils pour indiquer le statut de l'extension : active ou inactive
exports.IMG.actif = chrome.extension.getURL("data/img/present.png");
exports.IMG.inactif = chrome.extension.getURL("data/img/gris.png");

// Libellés affichés au moment du passage sur l'icône en bas de l'écran
exports.LIB.extension_toolbar = "Bordeaux Montaigne - BibdiX";
