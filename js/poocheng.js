const containerEl = document.querySelector(".container");
const provincesContainerEl = document.querySelector(".provinces");

const slugify = (str) =>
	str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");

const sendHttpRequest = (method, jsonUrl, data) => {
	const promise = new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open(method, jsonUrl);

		xhr.responseType = "json";

		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.onload = () => {
			resolve(xhr.response);
		};

		xhr.send(JSON.stringify(data));
	});
	return promise;
};

const renderMainPage = (jsonUrl) => {
	sendHttpRequest("GET", jsonUrl).then((res) => {
		const provinces = res.provinces;
		provincesContainerEl.innerHTML = "";
		let htmlCode =
			"<h1 class='title'>Canadian Provinces</h2><div class='provinces'";
		containerEl.insertAdjacentHTML("afterbegin", htmlCode);
		htmlCode = "";

		provinces.forEach((province) => {
			console.log(province, htmlCode);
			htmlCode += `
		    <div onClick="onClick=route(event, '${jsonUrl}', '${province.name}')" class="province">
		      <img src="${province.flag}" class="flag" alt="Flag of ${province.name}"/>
		      <h2 class="name">${province.name}</h2>
		    </div>
		`;
		});
		provincesContainerEl.insertAdjacentHTML("beforeend", htmlCode);
	});
};

renderMainPage("../list.json");

const renderProvincePage = (jsonUrl, provinceName) => {
	containerEl.innerHTML = "";
	sendHttpRequest("GET", jsonUrl).then((res) => {
		const provinces = res.provinces;
		const province = provinces.filter(
			(province) => province.name === provinceName
		)[0];
		containerEl.innerHTML = "";
		const htmlCode = `
      <h1 class="title">${province.name}</h1>
      <div class="province-details">
        <img src="${province.flag}" alt="Flag of ${
			province.name
		}" class="province-flag"/>
        <article class="province-description">${province.description}</article>
        <p>Major cities-</p>
        <ul class="province-cities">
          <li class="city"><a href="/${slugify(province.major_cities[0])}">${
			province.major_cities[0]
		}</a></li>
          <li class="city"><a href="/${slugify(province.major_cities[0])}">${
			province.major_cities[1]
		}</a></li>
          <li class="city"><a href="/${slugify(province.major_cities[0])}">${
			province.major_cities[2]
		}</a></li>
        </ul>
      </div>
    `;

		containerEl.insertAdjacentHTML("beforeend", htmlCode);
	});
};

const route = (event, jsonUrl, provinceName) => {
	event = event || window.event;
	event.preventDefault();
	const route = `/${slugify(provinceName)}`;
	window.history.pushState({}, "", route);
	window.route = route;

	renderProvincePage(jsonUrl, provinceName);
};
