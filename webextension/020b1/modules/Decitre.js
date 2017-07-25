/*
  Fichier   : Decitre.js
  Auteur    : Sylvain Machefert (Bordeaux 3)
  Fonction  : Analyse des pages de Decitre.
  
  Historique :
    - 20150210 : évolutions site web Decitre
    - 20130222 : modifications j. sicot (Rennes 2)
    - 20121024 : adaptation à nouvelle version du site
    - 20111005 : version initiale du script
*/

var Module_Decitre = {
  process: function() {
    var path = window.location.pathname;
    if ( path.indexOf("/livres/") != -1) {
      this._processProduct();
    }
    else if ( path.indexOf("/ebooks/") != -1) {
      this._processProduct();
    }
    else if ( path.indexOf("/rechercher/") != -1)
    {
      this._processProductlist();
    }
  },
  
  _processProductlist: function() {
    $("li.fiche-produit").each(function(i)
    {
      var isbn = $("div.google-apercu", this).attr("id");
      isbn = isbn.replace("ISBN:", "");
      //isbn = isbn.replace(/^\s*/, '').replace(/\s*$/, '');
      
      if (!isbn)
      {
        return true;
      }
      // var insertionPoint = $("#ctl00_mainBody_TitreLabel").get(0);
      var insertionPoint = $("div.catalog-product-list-details", this).get(0);
      insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint);
    });
  },
  
  _processProduct: function() {
    // Version non active au 24/10/2012 :
    // var isbn = $("div#nomean").text();
    var isbn = $("#fiche-technique").find("span[itemprop=productID]").text().trim();
    if (!isbn)
    {
        // TODO : logguer les erreurs pour contrôler un peu mieux
        return true;
    }
    // isbn = isbn.replace(/\-/g, "");
    isbn = isbn.replace(":", "");
    isbn = isbn.replace(/^\s*/, '').replace(/\s*$/, '');
    isbn = isbn.replace(/-/g, "");

    var insertionPoint = $("div.product-information").get(0);
    insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint);    
  }
};