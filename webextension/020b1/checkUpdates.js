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


chrome.runtime.onInstalled.addListener(function () {
	console.log("install de l'appli");
	chrome.alarms.create("refreshProxyList", {"periodInMinutes":  1440});	
	validateCacheEzProxy();
});

function validateCacheEzProxy() {
	var oReq = new XMLHttpRequest();
	oReq.onload = function(e) {
		//alert("Mise à jour config");//
		console.log("Mise à jour OK");
		// On supprime tout (il faudrait être plus précis à l'avenir)
		chrome.storage.local.clear();

		// We get the json for this extension, we can save it as storage
		domains = JSON.parse(oReq.response);

		keys = {};
		for (var i = 0; i < domains.length; i++) {
			var domain = domains[i];
			var slugDomain = slugify(domain);
			keys[domain] = 1;
			chrome.storage.local.set({[slugDomain]: 1});
		}
	};

	oReq.open("get", "http://www.geobib.fr/bibdix/versions/ubm/ezproxydomains.json", true);
	oReq.send();
}

chrome.alarms.onAlarm.addListener(function() {
	validateCacheEzProxy();
});
