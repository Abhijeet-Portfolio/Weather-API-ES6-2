/* Author: 

*/

let cities;
let displayWeather = document.querySelector('.show-weather');
let dataArray = new Array();
let errorBox = document.querySelector('.checklist');
let getCount = 1;
let input = document.querySelector('.city');
let find = document.querySelector('.find');
let error = document.querySelector('.form-group span');
let display = document.querySelector('.display');

// capitalize the word
let capitalize = ([ first, ...rest ], locale = navigator.language) => first.toLocaleUpperCase(locale) + rest.join('');

// remove error
let removeError = () => {
    if(error.classList.contains('error')) {
        error.classList.remove('error');
    }
}

// validating the input
input.addEventListener('focus', () => {
    errorBox.classList.add('error');
    removeError();
});

input.addEventListener('input', () =>{
    if(!errorBox.classList.contains('error')) {
        errorBox.classList.add('error');
    }
    removeError();

    if((/[a-zA-Z\s]/).test(input.value)) {errorBox.children[0].children[0].checked = true;}
    else { errorBox.children[0].children[0].checked = false;}

    if(!(/[^a-zA-Z\s]/).test(input.value)) {errorBox.children[1].children[0].checked = true;}
    else { errorBox.children[1].children[0].checked = false;}

    if(!(/[^a-zA-Z0-9\s]/).test(input.value)) { errorBox.children[2].children[0].checked = true;}
    else { errorBox.children[2].children[0].checked = false;}

    if((/^[^\s]+(\s+[^\s]+)*$/).test(input.value)) { errorBox.children[3].children[0].checked = true;}
    else { errorBox.children[3].children[0].checked = false;}

    if(!(/[^\s]([ ]{2,})[^\s]/).test(input.value)) {errorBox.children[4].children[0].checked = true;}
    else { errorBox.children[4].children[0].checked = false;}
});

// errorlist check
let checkErrorList = () => {
    for(let i = 0; i < errorBox.children.length; i++) {
        if(errorBox.children[i].children[0].checked === false) {return false}
    }
    return true;
}

input.addEventListener('focusout', () => {
    if(checkErrorList()) { errorBox.classList.remove('error')}
});

// get list of city
let getCity = () => {    
    fetch('https://raw.githubusercontent.com/russ666/all-countries-and-cities-json/6ee538beca8914133259b401ba47a550313e8984/countries.json')
    .then( Response => Response.json())
    .then( data => {
        cities = data.India;
        for (let i = 0; i < 30; i++) {
            getWeather(cities[i]);
        }
    });
}
getCity();

// Find weather by input
find.addEventListener('click', (e) => {
    e.preventDefault();
    if(checkErrorList()) {
        findWeather(input.value);
        errorBox.classList.remove('error');
    }
});

let findWeather = city => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8e08f2c66d3abadc4ad7e3b408caf570&units=metric`)
    .then(reponse => reponse.json())
    .then(data => {
        if(data.cod === 200) {
            verifyCity(city,data);
            removeError();
        }
        else { throw data;}
    })
    .catch(err => {
        error.classList.add('error');
        error.textContent = 'City not found';
        if(display.classList.contains('show')) {
            display.classList.remove('show');
        }
    });
}

// verify city
let verifyCity = (city,data) => {    
    for(let i = 0; i <= cities.length; i++) {
        if ((cities[i]) === (capitalize(city))) {
            disWeather(data);
            return;
        }
    }
}

// template literal for inserting the element
var insertElement = data => {
    let create = `<div>
        <h2>${data.name}</h2>
        <h3>${data.main.temp} &deg;C</h3>
        <h4>Wind: ${data.wind.speed} mi/h</h4>
    </div>
    <div class="status">
        <figure>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].main}">
        </figure>
        <h5>${data.weather[0].main}</h5>
    </div>`;
    return create;
}

// display the find weather 
let disWeather = data => {
    display.classList.add('show');
    display.innerHTML = insertElement(data);
}

let getWeather = city => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8e08f2c66d3abadc4ad7e3b408caf570&units=metric`)
    .then(reponse => reponse.json())
    .then(data => showWeather(data));
}

// function showData() {
//     console.log(dataArray);
// }

function showWeather(data) {
    let newLi = document.createElement('li');
    newLi.innerHTML = insertElement(data);
    displayWeather.appendChild(newLi);
}

// pagination
// let state = {
//     'querySet': 
// }




// let numbers = document.querySelectorAll('.number li');
// let selectNumber = numbers => {
//     console.log(numbers);
//     numbers.forEach(number => {
//         number.addEventListener('click', (e) => {
//             document.querySelector('.number li.active').classList.remove('active');
//             e.target.classList.add('active');
//             getCount = e.target.getAttribute('data-count');
//             console.log(displayWeather);
//             displayWeather.innerHTML = '';
//             getCity(getCount);
//         });
//     });
// }
// selectNumber(numbers);

// //pagination controls
// let prev = document.querySelector('.pagination span:first-child');
// let next = document.querySelector('.pagination span:last-child');
// prev.addEventListener('click',() => {
//     let current = document.querySelector('.number .active');
//     if(current.previousElementSibling === null) return;
//     current.classList.remove('active')
//     current.previousElementSibling.classList.add('active');
//     displayWeather.innerHTML = '';
//     getCity(current.previousElementSibling.getAttribute('data-count'));
// });
// next.addEventListener('click',() => {
//     let current = document.querySelector('.number .active');
//     if(current.nextElementSibling === null) return;
//     current.classList.remove('active')
//     current.nextElementSibling.classList.add('active');
//     displayWeather.innerHTML = '';
//     getCity(current.nextElementSibling.getAttribute('data-count'));
// });
