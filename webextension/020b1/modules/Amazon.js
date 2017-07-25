/*
  Fichier   : Amazon.js
  Auteur    : Sylvain Machefert (Bordeaux 3)
  Fonction  : Analyse des pages d'Amazon.
  
  Historique :
    - 20130222 : modifications j. sicot (Rennes 2)
    - 20111005 : version initiale du script
*/

var Module_Amazon = {
  
  process: function() {
    
    var path = window.location.pathname;
    if ( path.indexOf("/dp/") != -1 ||
         path.indexOf("/gp/product/") == 0 ) {
      this._processProduct();
    } else if ( path.indexOf("/b/") == 0 ||
                path.indexOf("/s/") != -1 ) {
      this._processProductList();
    } else if ( path.indexOf("/gp/") == 0 ) {
      this._processProductList();
    } else if ( path.indexOf("/lm/") != -1 ) {
      this._processProductList3();
    }
    
    // On va ajouter l'event pour relancer processProductList si besoin
    // Il semble que ça augmente la charge du script, à vérifier donc
    window.addEventListener('DOMAttrModified', function (event) {
      if
        (
          (event.target.id == 'center') ||
          (event.target.id == 'centerBelow') ||
          (event.target.id == 'centerBelowExtra') ||
          (event.target.id == 'center_ajaxJavascripts') ||
          (event.target.id == 'centerBelow_ajaxJavascripts') ||
          (event.target.id == 'centerBelowExtra_ajaxJavascripts')
        ){
          var path = window.location.pathname;

          if ( path.indexOf("/b/") == 0 || path.indexOf("/s/") != -1 ) {
            Module_Amazon._processProductList();
          }
          else if ( path.indexOf("/gp/") == 0 ) {
            Module_Amazon._processProductList();
          } 
      }
    }, false);
  },

  _processProduct: function() {
    console.log("RECH ISBN depuis :" + window.location.href);
    var isbn = extractISBN(window.location.href);
    if (!isbn) {debug("ret");
      return;
    }
    var insertionPoint = $("div#formats").get(0);
    insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint);
  },

  _processProductList: function() {
      $("div.prod").each(function(aIndex) {
      
      var isbn = $(this).attr("name");
      
      if (!isbn) {
        return true;
      }
      
      var insertionPoint = $("div.image", this).get(0);
      if (insertionPoint)
      {
        insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint);
      }
    });
    return true;
  },

  _processProductList2: function() {
    $("div.zg div.list > table > tbody").eq(0).children("tr:odd").each(function(aIndex) {
      var anchor = $("a", this).get(0);
      if (!anchor) {
        return true;
      }

      var isbn = extractISBN(anchor.href);
      if (!isbn) {
        return true;
      }

      var insertionPoint = $("td", this).get(0);
      insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint);
      return true;
    });
  },

  _processProductList3: function() {
    console.log("PL 3");
    $("#headerInfoTable ~ table:not(:last)").each(function(aIndex) {
      var anchor = $("a", this).get(0);
      if (!anchor) {
        return true;
      }

      var isbn = extractISBN(anchor.href);
      if (!isbn) {
        return true;
      }

      var insertionPoint = $("td:eq(1)", this).get(0);
      insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint);
    });
  },

  _processProductList4: function() {
    return;
    // XXX broken
    // recent history
    // dynamically generated at load time
    // -> see related JS code
    var products = document.getElementById("footerRecs")
                         .getElementsByClassName("rhfContent");

    for ( var i = 0; i < products.length; i++ ) {
      var product = products.item(i);

      var anchor = product.getElementsByTagName("a")[1];

      var isbn = extractISBN(anchor.href);
      if (!isbn) {
        continue;
      }

      var insertionPoint = anchor.parentNode;
      insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint);
    }
  }
};