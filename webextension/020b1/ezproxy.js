function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/^www./, '')			// Leading www
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')            // Trim - from end of text
    .toUpperCase();
}

var host = window.location.host;
var slughost = slugify(host);

chrome.storage.local.get(slughost, function(result) {
	if (typeof result[slughost] != 'undefined') {
    	$("body").prepend("<div style='padding:10px; background-color:#ff5733; color:white'>L'Université Bordeaux Montaigne dispose d'abonnements pour le domaine " + host + ". Utilisez <a href='http://ezproxy.u-bordeaux-montaigne.fr/login?url=" + window.location + "'>ce lien « proxyfié »</a> pour bénéficier de ces abonnements.</div>");
	}
});