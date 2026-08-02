/**
 * @param {URL} either new URL() or window.location
 * @returns {{host: string, storyID: string}}
 */
function recognizePage({ origin, pathname }) {
	switch (origin) {
		case "https://www.royalroad.com": {
			const rgx = /\/fiction\/(\d+)\/[^\/]*\/chapter\/\d+.*/;
			const m = rgx.exec(pathname);
			if (m && m[1]) {
				return { host: "rr", storyID: m[1] };
			}
			return { host: "rr" };
		}
		case "https://archiveofourown.com":
		case "https://archiveofourown.org":
		case "https://archiveofourown.net":
		case "https://archiveofourown.gay":
		case "https://ao3.org":
		case "https://archive.transformativeworks.org":
		case "http://insecure.archiveofourown.org": {
			const rgx = /\/(?:collections\/[^\/]*\/)?works\/(\d+)(?:\/chapters\/.*)?/;
			const m = rgx.exec(pathname);
			if (m && m[1]) {
				return { host: "ao3", storyID: m[1] };
			}
			return { host: "ao3" };
		}
	}
}
