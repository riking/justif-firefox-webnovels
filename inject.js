// common.js provides:
// recognizePage

async function install() {
	const page = recognizePage({origin: location.origin, pathname: location.pathname});
	if (!page.storyID) return;

	const storyKey = `${page.host}-${page.storyID}`;
	const disableVals = await browser.storage.sync.get([page.host, storyKey]);
	if (disableVals[page.host] || disableVals[storyKey]) return;

	const injScr = document.createElement("script");
	injScr.crossorigin = "anonymous";
	injScr.type = "module";
	injScr.integrity = "sha384-1Hg4cvYAblD0BOUHuqE0erw1V8FccWUq8L9TKOWKl1In5GQXzwoS1jgpE54pZ/K1";
	injScr.src = browser.runtime.getURL("justif-0.7.0-auto.js");

	const NoJustifyClass = "no-justify";
	const injCss = document.createElement("style");
	injCss.textContent = getCSSForHost(page.host);

	document.head.appendChild(injCss);
	document.head.appendChild(injScr);
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", switchInject);
	} else {
		switchInject();
	}
}


function getCSSForHost(host) {
	switch (host) {
		case "rr": {
			return `
body:not(.no-justify) .chapter .chapter-content {
	text-align: justify;
}
body:not(.no-justify) .chapter {
	padding-right: calc(var(--spacing) * 2.5); /* instead of x2 */
}
`;
		}; break;
		case "ao3": {
			return "#workskin { text-align: justify; }";
		}; break;
		case "sbattles": {
			// category 1: Threadmark
			// category 13: Apocrypha
			// category 16: Sidestory
			// category 19: Informational
			return ".message.threadmark-category-1 .message-userContent, .message.threadmark-category-16 .message-userContent { text-align: justify; }";
		}; break;
	}

}

function switchInject() {
	switch (location.origin) {
		case "https://www.royalroad.com":
			injectRoyalRoad(); break;
		case "https://forums.spacebattles.com":
			injectXenForo(); break;
	}
}

function injectRoyalRoad() {
}
function injectXenForo() {
}

install(); // no await
