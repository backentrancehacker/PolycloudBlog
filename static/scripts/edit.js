const content = document.getElementById('content')
const options = document.getElementById('options')
const app = document.getElementById('app')

let cache = content.innerHTML

// const id, content

const wrapper = () => {
	const div = document.createElement('div')
	div.id = 'new-wrapper'
	div.innerHTML = 
	`
	<img src="/images/close.svg" alt="Close"/>
	<form id="new-post" action="/post" method="post" onsubmit="clearStorage()">
		<input style="display: none;" name="id" value="${id}"/>
		<input type="text" name="title" autocomplete="off" placeholder="Title" value="${document.getElementById('title').textContent || ''}" required />
		<textarea type="text" name="content" autocomplete="off" placeholder="Write something..." required>${original || ''}</textarea>
		<button class="winona" data-text="Submit" type="submit">
			<span>Submit</span>
		</button>
	</form>
	`
	return div
}

const create = () => {
	let edit = document.createElement('button')
	Object.assign(edit, {
		id: 'edit',
		textContent: 'Edit'
	})

	let _delete = document.createElement('button')
	Object.assign(_delete, {
		id: 'delete',
		textContent: 'Delete'
	})

	options.appendChild(edit)
	options.appendChild(_delete)

	edit.addEventListener('click', async () => {
		let wrap = wrapper()
		app.appendChild(wrap)

		wrap.querySelector('img').addEventListener('click', () => {
			wrap.remove()
		})
	})
	_delete.addEventListener('click', async () => {
		let res = await fetch('/post', {
			method: 'POST',
			body: JSON.stringify({
				id,
				remove: true
			}),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(val => val.text())
		window.location.href = res
	})
}
create()