var browser = browser || chrome;

// Use this portal
let redirectTo = 'siasky.net';

// Initialize the list of portal hosts
let portalList = [
	"siasky.net",
	"skydrain.net",
	"sialoop.net",
	"skynet.luxor.tech",
	"skynet.tutemwesi.com",
	"siacdn.com",
	"vault.lightspeedhosting.com",
	"sia://",
	"web-sia://"
];

// Set the default list on installation.
browser.runtime.onInstalled.addListener(details => {
	browser.storage.local.set({
		portalList: portalList,
		redirectTo: redirectTo
	});
});

// Get the stored list
browser.storage.local.get(data => {
	if (data.portalList) {
		portalList = data.portalList;
		redirectTo = data.redirectTo;
	}
});

// Listen for changes in the portal list
browser.storage.onChanged.addListener(changeData => {
	portalList = changeData.portalList.newValue;
	redirectTo = changeData.redirectTo.newValue;
});

// Search engines must use q=____ query string
let searchEngines = [
	"www.google.com",
	"www.ecosia.org",
	"duckduckgo.com",
	"www.bing.com",
	"search.yahoo.com",
	"search.aol.com"
]

// Listen for a request to open a webpage
browser.webRequest.onBeforeRequest.addListener(handleRequest, {urls: ["<all_urls>"]}, ["blocking"]);

// On the request to open a webpage
function handleRequest(requestInfo) {

	// Read the web address of the page to be visited
	const url = new URL(requestInfo.url);

	// Determine whether the domain in the web address is on the portals list
	if (portalList.indexOf(url.hostname) != -1 && url.hostname != redirectTo) {
		console.log(`Redirecting to: ${url.hostname}`);
		return {
			redirectUrl: "https://" + redirectTo + url.pathname
		};
	} else if (redirectTo.indexOf(url.hostname) != -1 && url.pathname.startsWith("/web%2Bsia%3A%2F%2F")) {
		skylink = url.pathname.replace('web%2Bsia%3A%2F%2F', '');
		console.log(`Removing web+sia:// from path ->` + skylink);
		return {
			redirectUrl: "https://" + redirectTo + skylink
		}; 
	} else if (searchEngines.indexOf(url.hostname) != -1) {
		console.log('Checking search (q=...) query string');

		const searchString = url.searchParams.get("q");
		console.log(searchString)
		if (searchString.startsWith('web-sia://') || searchString.startsWith('sia://')) {
			skylink = searchString.replace('web-sia://', '');
			skylink = skylink.replace('sia://', '');
			console.log(skylink)

			return {
				redirectUrl: "https://" + redirectTo + '/' + skylink
			}; 
		}
	}

	// No redirect needed for other urls
	return {};
}