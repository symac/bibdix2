/*
  Fichier   : Utils.js
  Auteur    : Sylvain Machefert (Bordeaux 3)
  Fonction  : Différentes fonctions permettant de communiquer avec les serveurs
  
  Historique :
    - 20170720 : correction de bugs pour les livres électroniques
    - 20130227 : adaptations Chrom*
    - 20130222 : modifications j. Sicot (Rennes 2), ajout des fonctions de gestion des ISBN
*/

var dispos_tmp = {};

var BASE_URL = "http://www.geobib.fr/babordplus";
var SEARCH_SERVICE_URL = BASE_URL + "/search.php";

var QUERY_MODE_MULTIPLE = false;
var registry = {};

function register(aID, aFunction) {
  if (!registry[aID]){
    registry[aID] = [aFunction];  
  } else {
    registry[aID].push(aFunction);
  }
}

function extractISBN(aURL)
{
  var isbn;

  try {
    // isbn = aURL.match(/\/((\d{13}|\d{9}[\d|X]))\//)[1];
    isbn = aURL.match(/[\/\-](\d{13}|\d{9}[\d|X])[\/\.]?/)[1];
    // 20110918 : pb sur Amazon, on conserve un / en début d'isbn, supprimé ici, 
    isbn = isbn.replace("/", "");
  } catch (e) { console.log("Erreur ExtractISBN : " + e); }
  
  
  return isbn;
}

function checkBookAvailability(aQuery, aInsertionPoint) {
  var container = showBookAvailability_onStart(aInsertionPoint, aQuery);
  if (QUERY_MODE_MULTIPLE) {
    register(aQuery, function(aResponse) {
      showBookAvailability_onFinish(aQuery, aResponse, container);
    });
  } else {
    var aQueryClass = aQuery;
    aQueryClass = aQueryClass.replace(":", "");
    // On va regarder si on n'a pas déjà interrogé pour cet ouvrage
    if (dispos_tmp[aQueryClass] != undefined)
    {
      console.log("LOG LOCAL pour " + aQueryClass + "(Dispo : " + dispos_tmp[aQueryClass].data.dispo + ")");
      var msg = dispos_tmp[aQueryClass];
      showBookAvailability_onFinish(msg);
    }
    else
    {
      fetchDispo(aQuery, showBookAvailability_onFinish);
    }
  }
}

// Fetchdispo via les WS de l'ABES
function fetchDispo(q, callback) {
  // Appel au WS isbn2ppn
  var xhr1 = new XMLHttpRequest();
  
  // Appel au WS multiwhere
  var xhr2 = new XMLHttpRequest();
  
  // variables globales
  var isbn = "";
  var equiv_PPN_ISBN = new Object();
  
  xhr1.onreadystatechange = function(data) {
    if (xhr1.readyState == 4) {
      var ppn_list = null;
      if (xhr1.status == 200) {
        var data_out = JSON.parse(xhr1.responseText);
        // On a récupéré la liste des PPN, on va aller regarder s'ils sont chez nous
        // var tab_ppn = new Object();
        if (data_out.sudoc.length > 0)
        {
          for (var i=0; i < data_out.sudoc.length; i++)
          {
            if (!data_out.sudoc[i].query.resultNoHolding)
            {
              var isbn_courant = data_out.sudoc[i].query.isbn;
              
              if (data_out.sudoc[i].query.result.length > 0)
              {
                for (var j=0; j < data_out.sudoc[i].query.result.length; j++)
                {
                  // On aura au moins un PPN ok, on peut supprimer la chaîne "0" initiale
                  if (ppn_list == null) {
                    ppn_list = "";
                  }
                  var ppn = data_out.sudoc[i].query.result[j].ppn;
                  ppn_list = ppn_list + ppn + ",";
                  equiv_PPN_ISBN[ppn] = isbn_courant;
                }
              }
              else
              {
                // On aura au moins un PPN ok, on peut supprimer la chaîne "0" initiale
                if (ppn_list == null) {
                  ppn_list = "";
                }
                var ppn = data_out.sudoc[i].query.result.ppn;
                ppn_list = ppn_list + ppn + ",";
                equiv_PPN_ISBN[ppn] = isbn_courant;
              }
            }
          }
        }
        else
        {
          if (!data_out.sudoc.query.resultNoHolding) {
            var isbn_courant = data_out.sudoc.query.isbn;
            if (data_out.sudoc.query.result.length > 0)
            {
              for (var j=0; j < data_out.sudoc.query.result.length; j++)
              {
                var ppn = data_out.sudoc.query.result[j].ppn;
                if (ppn_list == null) {
                  ppn_list = "";
                }
                ppn_list = ppn_list + ppn + ",";
                equiv_PPN_ISBN[ppn] = isbn_courant;
              }
            }
            else
            {
              var ppn = data_out.sudoc.query.result.ppn;
              if (ppn_list == null) {
                ppn_list = "";
              }
              ppn_list = ppn_list + ppn + ",";
              equiv_PPN_ISBN[ppn] = isbn_courant;
            }            
          }
        }

        if ( (ppn_list != null) && (ppn_list != "") )
        {
          ppn_list = ppn_list.replace(/,$/, "");
          // On a au moins un PPN, on va donc aller demander si dispo dans nos RCR
          var url = "https://www.sudoc.fr/services/multiwhere/" + ppn_list + "&format=text/json";
          xhr2.open('GET', url, true);
          xhr2.send();
          return;
        }
        // callback(data_out);
      }

      if ( (xhr1.status == 404) || (ppn_list == null) )
      {
        // On n'a pas de résultats dans le sudoc ==> Affichage KO
        data_out = [];
        data_out["status"] = 1;
        data_out["config"] = exports;
        data_out["data"] = [];
        data_out["data"]["isbn"] = isbn;
        data_out["data"]["req"] = q;
        data_out["data"]["dispo"] = 0;
        callback(data_out);
      }
      else {
        callback(null);
      }
    }
  }
  
  xhr2.onreadystatechange = function(data) {
    if (xhr2.readyState == 4) {
      if (xhr2.status == 200) {
        try {
          var data_out = JSON.parse(xhr2.responseText);
        } catch (e) {
          alert("Error parsing " + e);
        }

        var present = false;
        var ppn_present = "";
        var ppn_courant = "";
        


        // TODO : voir si on peut simplifier tous ces tests. Semblerait que la forme du JSON soit bizarre.
        if (data_out.sudoc.query.length > 0)
        {
          for (var i=0; i < data_out.sudoc.query.length; i++)
          {
            ppn_courant = data_out.sudoc.query[i].ppn;
            if (data_out.sudoc.query[i].result.library.length > 0)
            {
              for (var j=0; j < data_out.sudoc.query[i].result.library.length; j++)
              {
                var rcr = data_out.sudoc.query[i].result.library[j].rcr;
                if (exports.RCR.match(rcr))
                {
                  present = true;
                  ppn_present = ppn_courant;
                }
              }
            }
            else
            {
              var rcr = data_out.sudoc.query[i].result.library.rcr;
              if (exports.RCR.match(rcr))
              {
                present = true;
                ppn_present = ppn_courant;
              }
            }
          }
        }
        else
        {
          ppn_courant = data_out.sudoc.query.ppn;
          
          if (data_out.sudoc.query.result.library.length > 0)
          {
            for (var j=0; j < data_out.sudoc.query.result.library.length; j++)
            {
              var rcr = data_out.sudoc.query.result.library[j].rcr;
              if (exports.RCR.match(rcr))
              {
                present = true;
                ppn_present = ppn_courant;
              }
            }
          }
          else
          {
            var rcr = data_out.sudoc.query.result.library.rcr;
            if (exports.RCR.match(rcr))
            {
              present = true;
              ppn_present = ppn_courant;
            }
          }
        }
       
        data_out = [];
        data_out["status"] = 1;
        data_out["config"] = exports;
        data_out["data"] = [];
        data_out["data"]["isbn"] = isbn;
        data_out["data"]["req"] = q;
        if (present)
        {
          data_out["data"]["dispo"] = 1;
          data_out["data"]["isbn"] = equiv_PPN_ISBN[ppn_present];
        }
        else
        {
          data_out["data"]["dispo"] = 0;
        }
        callback(data_out);
      }
    }
  }
  
  // Note that any URL fetched here must be matched by a permission in
  // the manifest.json file!
  if (q.indexOf("isbn:") != 0)
  {
    // On doit aller récupérer l'ISBN, en passant par le serveur bibdix
    // TODO : utiliser la fonction translateSiteId, pour Fnac par exemple
  }
  else
  {
    isbn = q.replace("isbn:", "");
    isbn = isbn.replace(/-/g, "");
    isbn2 = getOtherISBN(isbn);
    
    var url = "https://www.sudoc.fr/services/isbn2ppn/" + isbn;
    if (isbn2)
    {
      url += "," + isbn2;
    }
    url += "&format=text/json";

    xhr1.open('GET', url, true);
    xhr1.send();
  }
}

function translateSiteId(q)
{
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data_out = JSON.parse(xhr.responseText);
        data_out.config = exports;
        console.log(exports);
        callback(data_out);
      } else {
        callback(null);
      }
    }
  }
  // Note that any URL fetched here must be matched by a permission in
  // the manifest.json file!
  if (q.indexOf("isbn:") != 0)
  {
    // On doit aller récupérer l'ISBN, en passant par le serveur bibdix
  }
  else
  {
    
  }
  var url = "http://www.geobib.fr/bibeve/getdispo.php?q=" + q + "&rcr=" + exports.RCR;
  xhr.open('GET', url, true);
  xhr.send();  
}

function getNbRes(aQuery, aInsertionPoint) {
  if ($("#bplus_google"))
  {
    $("#bplus_google").remove();
  }
  var snippet = "<div id='zoneBabord' style='padding-top:10px; padding-left:10px; border-top:1px solid #CCC'>";
  snippet += '<table width="240px" cellpadding="0" cellspacing="0" id="mbEnd" style="padding:0"><tbody><tr>';
  snippet += '<td class="std">';
  snippet += '<h2 style="font-size:11px;padding:1px 0 4px;margin:0;text-align:left">Catalogue Babord+</h2>';
  snippet += '<img src="' + BASE_URL + '/img/present64.png" alt="" height="55" style="border:1px solid #CCC; padding:5px 5px; float:left; margin-right:10px;" width="60"/>';
  snippet += '<span id="bplus_google_nb">&nbsp;</span>';
  snippet += '</td></tr></tbody></table>';
  snippet += '</div>';  

  // On va ajouter une zone babord+. Not used anymore
  // var container = document.createElement("div");
  // container.id = "bplus_google";
  // container.innerHTML = snippet;
  // aInsertionPoint.appendChild(container);
  
  
  
  $("#bplus_google").hide();
  
  var msg = {};
  msg.handler = "nb_res";
  msg.data = {};
  msg.data.q = aQuery;
  self.postMessage(msg);
}

function getNbRes_finish(message)
{
  aQuery = message.data.req;
  
  if (aQuery == global_google_q)
  {
    aNb = message.data.nb;
    $("#bplus_google_nb").html("<a target='_blank' href='" + BASE_URL + "/redirect.php?q=" + aQuery + "'>" + aNb + " résultats</a> dans Babord+");
    
    if ( (aNb != "") && (aNb != 0) )
    {
      $("#bplus_google").show();
    }
  }
}

function showBookAvailability_onStart(aInsertionPoint, aQuery) {
  var container = "";
  var aQueryClass = aQuery;
  aQueryClass = aQueryClass.replace(":", "");

  if ($(".bplus" + aQueryClass).length > 0)
  {
    container = $("#bplus" + aQueryClass).get(0);
  }
  else
  {
    var snippet = $("<img>", 
        {
            style: "width:32px; height:32px", 
            class: "search-start",
            src: chrome.extension.getURL("data/searching.gif"),
            title: "Interrogation en cours",
            alt: "Interrogation en cours"
        });
        
    var container = $("<div>",
        {
            class: "babordplus bplus" + aQueryClass
        }
    ).get(0);
    $(container).html(snippet);
    aInsertionPoint.appendChild(container);
  }
  
  return container;
}

function showBookAvailability_onFinish(message) {
  // Ici on récupère le message final après récupération des infos
  if (!message.status)
  {
    console.log("Erreur de mise à jour : " + message.error);
    aQuery = message.data.req;
    var aQueryClass = aQuery;
    aQueryClass = aQueryClass.replace(":", "");
    $(".bplus" + aQueryClass).html('<a target="_blank" href="' + BASE_URL + '/redirect.php?index=1"><img style="width:' + message.config.IMG.width + 'px; height:' + message.config.IMG.height + 'px" class="search-start" src="' + 
            message.config.IMG.inconnu + '" title="Document présent dans vos bibliothèques, suivre le lien pour vérifier qu\'il n\'est pas emprunté" '
            + ' alt="Document présent dans vos bibliothèques, suivre le lien pour vérifier qu\'il n\'est pas emprunté"/></a>');
  }
  else
  {
    aQuery = message.data.req;
    
    var aQueryClass = aQuery;
    aQueryClass = aQueryClass.replace(":", "");
    
    // On stocke le message pour ne pas avoir à réinterroger le serveur si on a la même demande au cours de la session
    // TODO : faire en sorte que cela fonctionne, pour le moment ce n'est pas le cas
    dispos_tmp[aQueryClass] = message;
    if (message.data.dispo == 0)
    {
      var url = message.config.URL_REBOND.res0;
      $(".bplus" + aQueryClass).html('<a target="_blank" href="' + url + '"><img style="width:' + message.config.IMG.width + 'px; height:' + message.config.IMG.height + 'px" class="search-start" src="' + 
          message.config.IMG.absent + '" title="Le document n\'a pas été trouvé automatiquement dans Babord+, n\'hésitez pas à vérifier à l\'aide d\'une recherche '
          + 'manuelle." alt="Le document n\'a pas été trouvé automatiquement dans Babord+, n\'hésitez pas à vérifier à l\'aide d\'une recherche manuelle"/></a>')
    }
    else if (message.data.dispo == 1)
    {
      var url = message.config.URL_REBOND.res1;
      var isbn = "";
      // Si pas de tirets dans l'isbn mais que le catalogue a besoin des isbn, on va les rajouter via worldcat
      if ( (!(message.data.isbn.indexOf("-") != -1)) && (message.config.DASHES == 1) )
      {
        
        isbn = addDashes(message.data.isbn);
        console.log("ADD DASHES : " + message.data.isbn + " => " + isbn);
      }
      else
      {
        isbn = message.data.isbn;
      }

      url = url.replace("{{ISBN}}", isbn);
      
      $(".bplus" + aQueryClass).html('<a target="_blank" href="' + url +
            '"><img style="width:' + message.config.IMG.width + 'px; height:' + message.config.IMG.height + 'px" class="search-start" src="' + message.config.IMG.present + 
            '" title="Document présent dans vos bibliothèques, suivre le lien pour vérifier qu\'il n\'est pas emprunté" alt="Document présent dans vos bibliothèques, suivre le ' +
            'lien pour vérifier qu\'il n\'est pas emprunté"/></a>')
    }
    else if (message.data.dispo == 2)
    {
      var url = message.config.URL_REBOND.res0;
      $(".bplus" + aQueryClass).html('<a target="_blank" href="' + url + '"><img style="width:' + message.config.IMG.width + 'px; height:' + message.config.IMG.height + 'px" class="search-start" src="' + 
      message.config.IMG.inconnu + '" title="Nous n\'avons pas réussi à déterminer si le document était présent dans vos bibliothèques, n\'hésitez pas à effectuer la ' +
      'recherche manuellement." alt="Nous n\'avons pas réussi à déterminer si le document était présent dans vos bibliothèques, n\'hésitez pas à effectuer la recherche manuellement."/></a>')
    }
    else
    {
      console.log("Mise à jour impossible : " + message.data.dispo);
    }

    $(".bplus" + aQueryClass + " img").css("border", "0px");
  }
}

// Cette fonction va nous retourner l'ISBN10 quand on lui passe l'ISBN13 et inversement
function getOtherISBN($in)
{
  $in_light = $in.replace("-", "");
  $in_light = $in_light.replace(" ", "");
  
  if ($in_light.length == 10)
  {
    return ISBN10toISBN13($in_light);
  }
  else if ($in_light.length == 13)
  {
    return ISBN13toISBN10($in_light);
  }
  else
  {
    return null;
  }
}

/*
 * Converts a isbn10 number into a isbn13.
 * The isbn10 is a string of length 10 and must be a legal isbn10. No dashes.
 */
function ISBN10toISBN13(isbn10) {
     
    var sum = 38 + 3 * (parseInt(isbn10[0]) + parseInt(isbn10[2]) + parseInt(isbn10[4]) + parseInt(isbn10[6])
                + parseInt(isbn10[8])) + parseInt(isbn10[1]) + parseInt(isbn10[3]) + parseInt(isbn10[5]) + parseInt(isbn10[7]);
     
    var checkDig = (10 - (sum % 10)) % 10;
     
    return "978" + isbn10.substring(0, 9) + checkDig;
}
 
/*
 * Converts a isbn13 into an isbn10.
 * The isbn13 is a string of length 13 and must be a legal isbn13. No dashes.
 */
function ISBN13toISBN10(isbn13) {
 
    var start = isbn13.substring(3, 12);
    var sum = 0;
    var mul = 10;
    var i;
     
    for(i = 0; i < 9; i++) {
        sum = sum + (mul * parseInt(start[i]));
        mul -= 1;
    }
     
    var checkDig = 11 - (sum % 11);
    if (checkDig == 10) {
        checkDig = "X";
    } else if (checkDig == 11) {
        checkDig = "0";
    }
     
    return start + checkDig;
}


// Fonction qui va ajouter via Worldcat les isbn aux endroits nécessaires
function addDashes(isbn)
{
  // TODO : manage timeout
  var xhr1 = new XMLHttpRequest();
  var url = "http://xisbn.worldcat.org/webservices/xid/isbn/" + isbn + "?method=hyphen&format=json";
  xhr1.open('GET', url, false);
  xhr1.send(null);
  if (xhr1.readyState == 4) {
      if (xhr1.status == 200) {
        var data_out = JSON.parse(xhr1.responseText);
        var ppn_list = "";
        if (data_out["stat"] == "ok")
        {
          return data_out["list"][0].isbn[0];
        }
        return isbn;
      }
    }
  return isbn;
}