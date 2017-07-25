var Module_Mollat = {
  process: function() {
    var path = window.location.pathname;
    if ( path.indexOf("/recherche?requete/") != -1) {
      this._processProductlist();
    }
    else {
      this._processProduct();
    }

    
//      this._processMain();
  },

  _processProduct: function() {
    // var isbn = $("p:contains('EAN13')").css("color", "red");
    var isbn = $("p:contains('EAN13')").find("span.badge-info").text();

    if (!isbn)
    {
      return true;
    }
    
    isbn = isbn.replace("\n", "");
    isbn = isbn.replace("EAN13 : ", "");
    isbn = isbn.replace(/ /g, "");

    if (!isbn) {debug("ret");
      return;
    }

    var insertionPoint = $("div.notice-extend-info-panel").get(0);
    insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint);
  },
  
  _processProductList: function() {
    $(".list-listing").each(function()
    {
      var isbn = $("h4.ean > a", this).text();
      // console.log("ISBN : "+  isbn);
      if (!isbn) {
        return true;
      }
      
      // var insertionPoint = $("div[style='clear:both;']", this).get(0);
      var insertionPoint = $("h2.titre", this).add("h2", this).get(0);
      insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint); 
      
    }
    );
  },
  
  // Cette fonction traite les pages du type :
  // http://www.mollat.com/bien-etre_IUA3/index.html
  // non mis en œuvre pour le moment, pas clair
  _processMain: function()
  {
    $(".jcarousel-item").add(".list-content-fifty").each(function(aIndex)
      {
        var anchor = $("a", this).get(0);
        if (!anchor) {
          return true;
        }
        var isbn = extractISBN(anchor.href);
      	// console.log("ISBN : #" + isbn + "#");
        if (!isbn) {
          return true;
        }


        var insertionPoint = this;
        insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint);    
      }
    );
  }
};
