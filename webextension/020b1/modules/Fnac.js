/*
  Fichier   : Fnac.js
  Auteur    : Sylvain Machefert (Bordeaux 3)
  Fonction  : Analyse des pages de la fnac.
  
  Historique :
    - 20110916 : ajout de l'analyse des ouvrages relatifs
    - 20110914 : version initiale du script
*/

var Module_Fnac = {
  mURLRegexp: /^http:\/\/livre\.fnac\.com\//,
  mAnchorRegexp: /livre\.fnac\.com\/a(\d+)\//,
  
  process: function() {
    // Gestion d'une page de produits
    this._processProduct();
//    this._processMainPage();
    this._processProductList1();
    this._processProductList2();
    this._processProductList3();
    this._processProductList4();
    this._processProductList5();
  },
  
  _processProductlist: function() {
    $("div.prd-result > div.oneprd > div.img > a > img").each(function(i)
    {
      var src = $(this).attr("src");
      var isbn = _isbn_from_img_fnac(src);
      // console.log("Recherche liste : " + isbn);
      var insertionPoint = $(this).parent().parent().get(0);
      insertionPoint && checkBookAvailability(isbn, insertionPoint);
    });
  },
  
  _processMainPage: function() {
    // Titres sur le côté de la page avec lien sur couverture
    $("div.blk_content > div.floatl > a > img").each(function(i) {
      var src = $(this).attr("src");
      var isbn = _isbn_from_img_fnac(src);

      var insertionPoint = $(this).parent().parent().get(0);
      insertionPoint && checkBookAvailability(isbn, insertionPoint);
    });
    
    // Titres sur le côté de la page sans lien sur couverture
    $("div.blk_content > div.floatl > img").each(function(i) {
      var src = $(this).attr("src");
      var isbn = _isbn_from_img_fnac(src);

      var insertionPoint = $(this).parent().get(0);
      insertionPoint && checkBookAvailability(isbn, insertionPoint);
    });
    
    // Titres en bas de page
    $("div.blk_content > div > dl > dd.img > a > img").each(function(i)
    {
      var src = $(this).attr("src");
      var isbn = _isbn_from_img_fnac(src);

      var insertionPoint = $(this).parent().parent().parent().get(0);
      insertionPoint && checkBookAvailability(isbn, insertionPoint);

    });
        
    // Titre en haut de page
    $("div.cadre_produit > strong > a > img").each(function(i)
      {
        var src = $(this).attr("src");
        var isbn = _isbn_from_img_fnac(src);
        
        var insertionPoint = $(this).parent().parent().parent().get(0);
        insertionPoint && checkBookAvailability(isbn, insertionPoint);
      }
    );
  },
  
  _processProduct: function() {
    if ( !this.mURLRegexp.test(window.location.protocol
                             + "//"
                             + window.location.hostname
                             + window.location.pathname) ) {
      return;
    }
    var isbn = $("th[scope='row']:has(span:contains('ISBN')) + td").find("span")
                                                                   .text().trim();
    if (!isbn) {
        console.log("Pas d'isbn");
        return;
    }
  //   console.log("ISBN : " + isbn);
    var insertionPoint = $(".pricerZone").get(0);
    
    insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint);
  },
  
  _processProductList1: function(aTable) {
    var self = this;

    $("div.news_items li.item").add("ul.topList > li.container")
                               .each(function(aIndex) {
      var anchor = $("a[href^='http://livre.fnac.com/a']", this).get(0);
      if (!anchor) {
        return true;
      }

      var matches = self.mAnchorRegexp.exec(anchor.href);
      if (matches) {
        var insertionPoint = $(this).children(0).get(0);
        insertionPoint && checkBookAvailability("fnac:" + matches[1], insertionPoint);
      }
    });
  },

  _processProductList2: function(aTable) {
    var self = this;


    $("#myId > table > tbody > tr:has(td div.previewctn)").each(function(aIndex) {
      var anchor = $("a[href^='http://livre.fnac.com/a']", this).get(0);
      if (!anchor) {
        return true;
      }

      var matches = self.mAnchorRegexp.exec(anchor.href);
      if (matches) {
        console.log("2 : "+matches[1]);
        var insertionPoint = $(this).children(0).get(0);
        insertionPoint && checkBookAvailability("fnac:" + matches[1], insertionPoint);
      }
    });
  },

  _processProductList3: function() {
    var self = this;


    $("table.produit tr").each(function(aIndex) {
      var anchor = $("a[href^='http://livre.fnac.com/a']", this).get(0);
      if (!anchor) {
        return true;
      }

      var matches = self.mAnchorRegexp.exec(anchor.href);
      if (matches) {
        var insertionPoint = $("td:eq(2)", this).get(0);
        insertionPoint && checkBookAvailability("fnac:" + matches[1], insertionPoint);
      }
    });
  },

  _processProductList4: function() {
    var self = this;
    $("div.blk_content div.produit").each(function(aIndex) {
      var anchor = $("a[href^='http://livre.fnac.com/a']", this).get(0);
      if (!anchor) {
        return true;
      }

      var matches = self.mAnchorRegexp.exec(anchor.href);
      if (matches) {
        var insertionPoint = this;
        insertionPoint && checkBookAvailability("fnac:" + matches[1], insertionPoint);
      }
    });
  },
  
  _processProductList5: function() {
    var self = this;
    $("div.oneprd").each(function(aIndex){
      var anchor = $("a[href^='http://livre.fnac.com/a']", this).get(0);
            if (!anchor) {
        return true;
      }
      
      var matches = self.mAnchorRegexp.exec(anchor.href);
      if (matches) {
        var insertionPoint = $("div.img", this).get(0);
        insertionPoint && checkBookAvailability("fnac:" + matches[1], insertionPoint);
      }
    });
  },
  
  _isbn_from_img_fnac: function (src) {
    var file = src.substr(src.lastIndexOf("/")+1,src.length);
    var isbn = file.replace(".gif", "");
    return isbn;
  }
};
