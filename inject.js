const injScr = document.createElement("script");
injScr.crossorigin = "anonymous";
injScr.type = "module";
injScr.integrity = "sha384-1Hg4cvYAblD0BOUHuqE0erw1V8FccWUq8L9TKOWKl1In5GQXzwoS1jgpE54pZ/K1";
injScr.src = browser.runtime.getURL("justif-0.7.0-auto.js");

const NoJustifyClass = "no-justify";
const injCss = document.createElement("style");
switch (location.origin) {
	case "https://www.royalroad.com": {
		injCss.textContent = `
body:not(.no-justify) .chapter .chapter-content {
	text-align: justify;
}
body:not(.no-justify) .chapter {
	padding-right: calc(var(--spacing) * 2.5); /* instead of x2 */
}
`;
	}; break;
	case "https://archiveofourown.org": {
		injCss.textContent = "#workskin { text-align: justify; }";
	}; break;
}

document.head.appendChild(injCss);
document.head.appendChild(injScr);

function switchInject() {
	switch (location.origin) {
		case "https://www.royalroad.com":
			injectRoyalRoad(); break;
	}
}
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", switchInject);
} else {
	switchInject();
}

function injectRoyalRoad() {
	const prefContainer = document.getElementById("reading-preferences");
	const buttonContainer = document.createElement("div");
	const button = document.createElement("button");
	button.className = `inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-theme font-medium tracking-wide text-center active:opacity-100 hover:shadow-sm disabled:opacity-55 disabled:cursor-not-allowed no-underline transform active:scale-90 motion-reduce:transition-none hover:brightness-125 text-on-surface-strong border border-on-surface/20 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-on-surface/50 focus-visible:ring-offset-2 focus-visible:outline-none px-4 py-2`;
	const icon = document.createElement("i");
	icon.className = "fa-solid fa-align-slash";
	button.appendChild(icon);
	buttonContainer.appendChild(button);
	prefContainer.appendChild(buttonContainer);
	console.log(buttonContainer);
	const enableClass = "bg-primary/30";
	const enableClass2 = "hover:bg-primary";
	const disableClass = "bg-surface/30";
	const disableClass2 = "hover:bg-surface/65";
	let justified = true;
	button.classList.add(enableClass);
	button.classList.add(enableClass2);
	button.addEventListener("click", e => {
		if (document.body.classList.contains(NoJustifyClass)) {
			button.classList.add(enableClass);
			button.classList.add(enableClass2);
			button.classList.remove(disableClass);
			button.classList.remove(disableClass2);
			document.body.classList.remove(NoJustifyClass);
			if (window.justif) window.justif.justify();
		} else {
			button.classList.remove(enableClass);
			button.classList.remove(enableClass2);
			button.classList.add(disableClass);
			button.classList.add(disableClass2);
			document.body.classList.add(NoJustifyClass);
			if (window.justif) window.justif.unjustify();
		}
	});
}
