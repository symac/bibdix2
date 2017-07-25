console.log("Chargement dispatcher");

var MODULES =
{
  // "amazon.fr":        Module_Amazon,
  "appeldulivre.fr":  Module_Appeldulivre,
  "appeldulivre.com":  Module_Appeldulivre,
  "decitre.fr":       Module_Decitre,  
  "electre.com":      Module_Electre,
  "mollat.com":       Module_Mollat
};

var host = window.location.host;
for ( var domain in MODULES )
{
  if ( RegExp(domain + "$").test(host) )
  {
    var module = MODULES[domain];
    module.process();
  }
}