/*
  Module dédié au site web appeldulivre.fr
  Auteur : Julien Sicot (Rennes 2)
*/
var Module_Appeldulivre = {
  process: function() {
    var path = window.location.pathname;
    if ( ( path.indexOf("/search/detail") != -1) || ( path.indexOf("adl/selliv_detail") != -1) ) {
      this._processProduct();
    }
    else if ( path.indexOf("search/index") != -1)
    {
      this._processProductlist();
    }
    else if (path.indexOf("adl/index") != -1)
    {
      this._processProductlist2();
    }
    else if ( path.indexOf("selliv_liste") != -1)
    {
      this._processProductlist3();
    }
  },
  
  _processProductlist: function() {
    $("a.titreliste").each(function(i)
    {
        var url = $(this).attr('href');
        var pattern = new RegExp(".*&CODEAN=([0-9]{13}).*");
        var isbn = url.replace(pattern, "$1");

      if (!isbn)
      {
        return true;
      }
      
      var insertionPoint = $(this).parent().parent().get(0);
      insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint);
    });
  },
  
    _processProductlist2: function() {
    $("p.unetexte").each(function(i)
    {
        var url = $("a",this).attr('href');
        var pattern = new RegExp(".*(&CODEAN=|/REF_PAPIER/)([0-9]{13}).*");
        var isbn = url.replace(pattern, "$2");
         
      if (!isbn)
      {
        return true;
      }
      
      var insertionPoint = $(this).get(0);
      console.log("RECH ISBN : #" + isbn + "#");
      insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint);
    });
  },
  
    _processProductlist3: function() {
    $("tr.t5").each(function(i)
    {
        var url = $("p.unetexte a",this).attr('href');
        var pattern = new RegExp(".*&CODEAN=([0-9]{13}).*");
        var isbn = url.replace(pattern, "$1");
         
      if (!isbn)
      {
        return true;
      }
      
      var insertionPoint = $("p.unetexte a",this).get(0);
      insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint);
    });
  },
  
  _processProduct: function() {
    var isbn = $("input[name=CODEAN]").val();
    if (!isbn)
    {
        // TODO : logguer les erreurs pour contrôler un peu mieux
        console.log("Pas d'ISBN sur cette page");
        return true;
    }
   
    var insertionPoint = $("p.unetexte > span.grisfonce").get(0);
    insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint);    
  }
};