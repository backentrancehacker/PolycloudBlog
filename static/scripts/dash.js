const post = document.getElementById('new')
const log = document.getElementById('log')
const app = document.getElementById('app')

const clearStorage = () => {
	window.localStorage.removeItem('title')
	window.localStorage.removeItem('text')
}

const wrapper = () => {
	const div = document.createElement('div')
	div.id = 'new-wrapper'
	div.innerHTML = 
	`
	<img src="/images/close.svg" alt="Close"/>
	<form id="new-post" action="/dash" method="post" onsubmit="clearStorage()">
		<input type="text" name="title" autocomplete="off" placeholder="Title" value="${window.localStorage.getItem('title') || ''}" required />
		<textarea type="text" name="content" autocomplete="off" placeholder="Write something..." required>${window.localStorage.getItem('text') || ''}</textarea>
		<input type="button" id="preview" value="Preview"/>
		<button class="winona" data-text="Submit" type="submit">
			<span>Submit</span>
		</button>
	</form>
	`
	return div
}

log.addEventListener('click', () => {
	window.location = '/logout'
})

post.addEventListener('click', () => {
	let wrap = wrapper()
	app.appendChild(wrap)

	let title = wrap.querySelectorAll('input')[0],
		text = wrap.querySelector('textarea')
	

	wrap.querySelector('img').addEventListener('click', () => {
		wrap.remove()
	})
	title.addEventListener('input', () => {
		window.localStorage.setItem('title', title.value)
	})
	text.addEventListener('input', () => {
		window.localStorage.setItem('text', text.value)
	})
	document.getElementById('preview').addEventListener('click', () => {
		let h = 500,
			w = 500,
			left = (screen.width / 2) - ( w / 2),
			top = (screen.height / 2) - (h / 2)

		let preview = window.open('preview', '_blank', `modal =yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`)
	})
})