var Module_Electre = {
  process: function() {
    var path = window.location.pathname;
    console.log("PROCESS ELECTRE");
    if ( path.indexOf("ShowNotice.aspx") != -1) {
      this._processProduct();
    }
    else if (path.indexOf("Search.aspx") != -1 ) {
      // this._processProductList();
    }
  },

  _processProduct: function() {
    var isbn = $("td[class='txtStyle-1']:contains('ISBN')").next().text();
    isbn = isbn.replace(" Voir OPAC", ""); // Pour ceux qui auraient activé le rebond vers l'OPAC dans ELECTRE
    console.log(isbn);
    if (!isbn)
    {
      return true;
    }
    
    // var insertionPoint = $("#ctl00_mainBody_TitreLabel").get(0);
    var insertionPoint = $(".n-col-1").get(0);
    insertionPoint && checkBookAvailability("isbn:" + isbn, insertionPoint);

    var target = document.querySelector('.imageSpan');
    console.log(target);
     
    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
        console.log("MUTATION OBSERVER");
        mutations.forEach(function(mutation) {
          Module_Electre._processProduct();
        });
    });
     
    // configuration of the observer:
    var config = { 
      subtree: false,
      attributes: false,
      childList: true,
      characterData: true,
      attributeOldValue: false,
      characterDataOldValue: false 
    };
     
    // pass in the target node, as well as the observer options
    observer.observe(document.querySelector("#ctl00_mainBody_UpdatePanel1"), config);

    // On va aussi aller voir du côté de Dawsonera
    isbn = isbn.replace(/-/g, "");
    console.log("Search for Dawsonera : " + isbn);
    
    // https://www.dawsonera.com/search?q=9782765409755&sType=ALL&searchFrom=0&sortBy=0&infinityOffset=1
    var oReq = new XMLHttpRequest();
    oReq.onload = function(e) {
      // We get the json for this extension, we can save it as storage
      console.log("Reponse :" + oReq.response);
    };

//    oReq.open("get", "//geobib.fr/bibdix/versions/ubm/getDispoDawsonera.php?isbn=" + isbn, true);
//    oReq.send();
  },
  
  _processProductList: function() {
    // On va ajouter la colonne qui nous intéresse
    $("#searchResults").find("tr.x-grid3-hd-row > td:eq(2)").after("<td>Dispo Babord</td>");
  }
};