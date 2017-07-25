// Ce module google va prendre en charge l'ajout d'une zone permettant de lancer la recherche sur Babord
var global_google_nb = 0;
var global_google_q = 0;

var Module_Google = {
  updatePageGoogle: function ()
  {
    global_google_nb++;
    console.log(global_google_nb);
    var url = window.location.href;
    // var q = url.match(/[&?]q=([^&]*)(?:&|$)/)[1];
    var q = $("#lst-ib").val();
    if (!q)
    {
      return true;
    }
    var aInsertionPoint = ""
    if ($("#rhs").length != 0)
    {
      aInsertionPoint = $("#rhs").get(0);
    }
    else if ($("#center_col").length != 0)
    {
      $("#center_col").after('<div id="rhs" class = "bplus_tmp" style="display:block;border-left:1px solid #d3e1f9;position:absolute;right:0px;top:0;width:264px"/>');
      aInsertionPoint = $(".bplus_tmp").get(0);
    }
    console.log("Interrogation " + q);
    global_google_q = q;
    getNbRes(q, aInsertionPoint);
  },

  process: function() {
    // On va ajouter la fonction qui vérifie les modifs
/*    window.addEventListener('DOMAttrModified', function (event) {
      if ( (event.target.id == 'foot') ){
        // || (event.target.id == 'gs_tad0') 
        Module_Google.updatePageGoogle();
      }
    }, false);
    
    this.updatePageGoogle(); */

    // On lance la maj quand l'usager tape entrée ...
    $('#lst-ib').bind('keydown', function(e)
    {
      if (e.which == 13)
      {
        Module_Google.updatePageGoogle();
      }
    } );
    
    // ... où lorsqu'on perd le focus
    $('#lst-ib').focusout(
      function()
      {
        Module_Google.updatePageGoogle();
      }
    );
  },
};