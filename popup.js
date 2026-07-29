// common.js provides:
// recognizePage

const buttonDisableDomain = document.getElementById("disable-domain");
const buttonDisableStory = document.getElementById("disable-story");
const buttonReload = document.getElementById("reload");
buttonReload.innerText = browser.i18n.getMessage("reload");
const textDomain = document.getElementById("text-domain");
const textStory = document.getElementById("text-story");
const textActionDomain = document.getElementById("action-domain");
const textActionStory = document.getElementById("action-story");

let siteHost;
let siteStoryID;
let siteStoryKey;

async function setActionText() {
	const disableVals = await browser.storage.sync.get([siteHost, siteStoryKey]);
	if (disableVals[siteHost]) {
		textActionDomain.innerText = browser.i18n.getMessage("enableSite");
	} else {
		textActionDomain.innerText = browser.i18n.getMessage("disableSite");
	}
	if (disableVals[siteStoryKey]) {
		textActionStory.innerText = browser.i18n.getMessage("enableStory");
	} else {
		textActionStory.innerText = browser.i18n.getMessage("disableStory");
	}
}
async function setText() {
	const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
	const tabTitle = tab.title;
	const loc = new URL(tab.url);
	const page = recognizePage({ origin: loc.origin, pathname: loc.pathname });
	siteHost = page.host;
	siteStoryID = page.storyID;
	const storyKey = `${siteHost}-${siteStoryID}`;
	siteStoryKey = storyKey;
	setActionText();

	textDomain.innerText = browser.i18n.getMessage(`site-${siteHost}`);

	let storyBrand;
	switch (siteHost) {
		case "ao3": {
			const rgx = /(.*?) - /;
			const m = rgx.exec(tabTitle);
			if (m[1]) {
				storyBrand = m[1].trim();
			}
		}
	}
	if (!storyBrand) {
		storyBrand = tabTitle;
	}
	textStory.innerText = storyBrand;

}

setText(); /* without await */

buttonReload.addEventListener("click", async e => {
	if (buttonReload.disabled) return;

	browser.tabs.reload();
	window.close();
});

buttonDisableDomain.addEventListener("click", async e => {
	const disableVals = await browser.storage.sync.get(siteHost);
	if (disableVals[siteHost]) {
		await browser.storage.sync.remove(siteHost);
	} else {
		let payload = {};
		payload[siteHost] = true;
		await browser.storage.sync.set(payload);
	}
	buttonReload.disabled = false;
	setActionText();
});
buttonDisableStory.addEventListener("click", async e => {
	const disableVals = await browser.storage.sync.get(siteStoryKey);
	if (disableVals[siteStoryKey]) {
		// Remove both blocks if user clicks enable on story
		await browser.storage.sync.remove([siteHost, siteStoryKey]);
	} else {
		let payload = {};
		payload[siteStoryKey] = true;
		await browser.storage.sync.set(payload);
	}
	buttonReload.disabled = false;
	setActionText();
});
