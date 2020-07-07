;(() => {
	const header = document.querySelectorAll("header")[0]
	document.addEventListener("scroll", () => { 
		let st = (window.pageYOffset || document.scrollTop)
		header.style.boxShadow = st > header.offsetHeight ? '0 0 0.5em silver' : null
	}, true)
})()