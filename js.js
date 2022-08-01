// requesting an api using 'fetch' method
// the second parameter is for control
// fetch('https://api.openweathermap.org/data/2.5/weather?q=Seoul&APPID=bf66298bdf70fec2abff00c33b2b2f7c')
// .then(function(resolve) {
//     console.log (resolve);
// })

let nextDates = {};
let place = 'Seoul';
let index = 0;

//                                  Returns the fetched data.
async function fetchWeather(input) {
    let weather = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${input}&units=metric&appid=bf66298bdf70fec2abff00c33b2b2f7c`, {mode: 'cors'});
    // fetch('https://api.openweathermap.org/data/2.5/weather?q=Seoul&APPID=bf66298bdf70fec2abff00c33b2b2f7c')
    let weatherJson;
    if (weather.status === 200) {
        weatherJson = await weather.json();
        return weatherJson;
    }
    else {
        alert ("Error!");
    }
}

//                           Update the city info with returend data
async function updateCityInfo(input, index) {
    let data = await fetchWeather(input);
    const cityName = document.getElementById('city-name');
    const date = document.getElementById('date');
    const weather = document.getElementById('weather');
    const icon = document.getElementById('icon');

    cityName.textContent = data.city.name;
    date.textContent = (data.list[index].dt_txt).slice(0, 10);
    weather.textContent = capitalize(data.list[index].weather[0].description);
    if ((data.list[index].weather[0].description).includes('rain')) {
        icon.src = './icons/rainy.png';
    }
    else if ((data.list[index].weather[0].description).includes(' clouds')) {
        icon.src = './icons/cloud.png';
    }
    else {
        icon.src = './icons/sunny.png';
    }
}

//                           Update the weather details
async function updateWeatherInfo(input, index) {
    let data = await fetchWeather(input);
    const avg = document.querySelector('#avg+h4');
    const feels = document.querySelector('#feels-like +h4');
    const max = document.querySelector('#max+h4');
    const min = document.querySelector('#min+h4');
    const clouds = document.querySelector('#clouds+h4');
    const humidity = document.querySelector('#humidity+h4');
    const rain = document.querySelector('#rain + h4');

    avg.textContent = data.list[index].main.temp+" °C";
    feels.textContent = data.list[index].main['feels_like']+" °C";
    max.textContent = data.list[index].main['temp_max']+" °C";
    min.textContent = data.list[index].main['temp_min']+" °C";
    clouds.textContent = data.list[index].clouds.all;
    humidity.textContent = data.list[index].main.humidity;
    // rain.textContent = data.list[index].rain['3h'];

    const img = document.querySelector('.api-img');
    const p = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=W3ggRWkvhY5NzGm9clw2Aj9eMa8okZLI&s=${data.list[index].weather[0].description}`, {mode: 'cors'})
    const json = await p.json();
    img.setAttribute('style', `background-image: url('${json.data.images.original.url}');`); 
}

function getDays(data, curDate) {
    for (let i = 0; i < data.list.length; i++) {
        let nextDate = (data.list[i]['dt_txt']).slice(0, 10);
        if (nextDate === curDate) {
            continue;
        }
        else if (nextDate !== curDate) {
            curDate = nextDate;
            nextDates[i] = {'date': curDate, 'temp': data.list[i].main.temp, 'description': data.list[i].weather[0].description};
        }
    }
}

function updateWeatherCards(weatherCards, weatherTemps, weatherDes, weatherInfos) {
    let i = 0;
    for (let key in nextDates) {
        weatherCards[i].textContent = nextDates[key].date;
        weatherTemps[i].textContent = nextDates[key].temp+" °C";
        weatherDes[i].textContent = nextDates[key].description;
        weatherInfos[i].setAttribute('id', key);
        i++;
    }
}

async function update5DaysWeather(input) {
    let data = await fetchWeather(input);
    let curDate = (data.list[0]['dt_txt']).slice(0, 10);
    const weatherCards = Array.from(document.querySelectorAll('.weather-card > h3'));
    const weatherTemps = Array.from(document.querySelectorAll('.weather-card > div > p'));
    const weatherDes = Array.from(document.querySelectorAll('.weather-card > h4'));
    const weatherInfos = Array.from(document.querySelectorAll('.weather-card'));
    //get the next 5 days
    getDays(data, curDate, nextDates);
    //update them
    updateWeatherCards(weatherCards, weatherTemps, weatherDes, weatherInfos);
}

// function toggleSearchBtn(form, toggled) {
//     const searchBtn = document.querySelector('.search-btn');
//     searchBtn.addEventListener('click', e => {
//         if (toggled === false) {
//             form.setAttribute('style', "visibility: visible");
//             toggled = true;
//         }
//         else if (toggled === true) {
//             form.setAttribute('style', "visibility: hidden");
//             toggled = false;
//         }
//     })
// }

function getUserInput() {
    const form = document.querySelector('.search-form');
    let toggled = false;
    // toggleSearchBtn(form, toggled);
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', e => {
        if (toggled === false) {
            form.setAttribute('style', "visibility: visible");
            toggled = true;
        }
        else if (toggled === true) {
            form.setAttribute('style', "visibility: hidden");
            toggled = false;
        }
    })

    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.addEventListener('click', e => {
        const input = document.getElementById('user-input');
        updateCityInfo(capitalize(input.value), index);
        updateWeatherInfo(capitalize(input.value), index);
        update5DaysWeather(capitalize(input.value));
        place = capitalize(input.value);
        input.value = '';
        form.setAttribute('style', 'visibility: hidden');
        toggled = false;
    })
}

function switchDetails() {
    const cards = Array.from(document.querySelectorAll('.weather-card'));
    cards.forEach (card => {
        card.addEventListener('click', e => {
            const index = parseInt(card.id);
            updateCityInfo(place, index);
            updateWeatherInfo(place, index); //input must be changed
        })
    })
}

function capitalize(input) {  
    const words = input.split(' ');  
    const CapitalizedWords = [];  
    words.forEach(element => {  
        CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));  
    });  
    return CapitalizedWords.join(' ');  
}  

// async function setWeatherImg(index, data) {
//     const img = document.querySelector('.api-img');
//     console.log (data.list);
//     // console.log (data.list[index].weather[0].description);
//     const p = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=W3ggRWkvhY5NzGm9clw2Aj9eMa8okZLI&s=dogs`, {mode: 'cors'})
//     const json = await p.json();
// }

updateCityInfo(place, index);
updateWeatherInfo(place, index);
update5DaysWeather(place);
getUserInput();
switchDetails();

// window.navigator.geolocation
// .getCurrentPosition(console.log, console.log);

let stored;
window.navigator.geolocation
.getCurrentPosition(store, console.log);

async function store(input) {
    stored = input;
    const latitude = stored.coords.latitude;
    const longitude = stored.coords.longitude;
    let result = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=6efa724f1bb245e2839da2ac60d17bc4`)
    let json;
    if (result.status === 200) {
        json = await result.json();
    }
    else {
        throw new Error ("Error!");
    }
    console.log (json.results[0].components);
    // .then(response => response.json())
    // .then(console.log); // Or do whatever you want with the result
}

