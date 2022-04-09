/*
- Par défaut: geolocaliser ma position (lat,lon) avec API Geo
- Obtenir le nom de la ville correspondante (city) avec API Geo Openweathermap
- requeter par rapport à (lat,lon) => requete forecast
- si recherche par nom de ville:
    - récupérer le nom
    - recupérer (lat,lon) avec Api Geo Openweathermap
    - requeter par rapport à (lat,lon) => requete forecast
*/

import { apiKey, maVille, defaultData } from './init.js'

const weatherIcons = {
    Rain: 'wi wi-day-rain',
    Clouds: 'wi wi-day-cloudy',
    Clear: 'wi wi-day-sunny',
    Snow: 'wi wi-day-snow',
    Mist: 'wi wi-day-fog',
    Drizzle: 'wi wi-day-sleet',
}

// const request = fetch(
//     'http://api.openweathermap.org/geo/1.0/direct?q=' +
//         maVille +
//         '&limit=10&apikey=' +
//         apiKey
// )
/**
 *
 * @param {*} isSearching
 * @param {Object} dataObj - Provide name, latitude and longitude for a city
 */
async function main(isSearching = false, dataObj) {
    let coords = await dataObj
    // coords = defaultCoords

    const meteo = await fetch(
        'https://api.openweathermap.org/data/2.5/onecall?lat=' +
            coords.latitude +
            '&lon=' +
            coords.longitude +
            '&apikey=' +
            apiKey +
            '&lang=fr&units=metric'
    )
        .then((response) => {
            return response.json()
        })
        .then((res) => {
            // console.log(`Resultat ville pour ${coords.city} `, res)
            displayWeatherInfos({ ...res, city: coords.city })
        })
        .catch((e) => {
            messageBox.displayMessage(e)
        })
}

/**
 *
 * @returns - Default user's geolocation
 */
function geolocalisation() {
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    }
    function success(pos) {
        const crd = pos.coords
        // console.log('POS = ', pos, 'TIMESTAMP = ', new Date(pos.timestamp))

        // console.log('Votre position actuelle est :')
        // console.log(`Latitude : ${crd.latitude}`)
        // console.log(`Longitude : ${crd.longitude}`)
        // console.log(`La précision est de ${crd.accuracy} mètres.`)
        // console.log('CRD = ', crd)

        const cityName = fetch(
            'http://api.openweathermap.org/geo/1.0/reverse?lat=' +
                crd.latitude +
                '&lon=' +
                crd.longitude +
                '&apikey=03b92fba65774279cd4a4579ad496ed3&lang=fr&units=metric'
        )
            .then((response) => {
                console.log(response)
                return response.json()
            })
            .then((data) => {
                main(
                    false,

                    {
                        ...crd,

                        latitude: data[0].lat,
                        longitude: data[0].lon,
                        city: data[0].name,
                    }
                )
            })

        return crd
    }
    function error(err) {
        let errorMessage = ''
        switch (err.code) {
            case 1:
                errorMessage = `ERREUR (${err.code}): \nNous n'avons pas la permission de vous localiser`
                break

            case 2:
                errorMessage = `ERREUR (${err.code}): \nUne erreur a été rencontrée`
                break
            case 1:
                errorMessage = `ERREUR (${err.code}): \nLe temps alloué pour obtenir votre position est écoulé `
                break

            default:
                break
        }
        messageBox.displayMessage(errorMessage)

        main(
            false,

            defaultData
        )
    }

    return navigator.geolocation.getCurrentPosition(success, error, options)
}

/**
 *
 * @param {Object} data - Provide data weather for a city
 */
function displayWeatherInfos(data) {
    // console.log('DisplayWeatherInfos = ', data)
    const lon = data.lon
    const lat = data.lat
    const temperature = data.current.temp
    const city = data.city
    const feelsLike = Math.round(data.current.feels_like)
    const humidity = data.current.humidity
    const pressure = data.current.pressure
    const description = data.current.weather[0].description
    const condition = data.current.weather[0].main
    const date = new Date()
    const dailyWeather = data.daily

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }

    const dateFormat = new Intl.DateTimeFormat('fr-FR', options).format(date)
    const day = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(
        date
    )

    let dayResults = ''
    const rootEl = document.querySelector('#daily-weather')
    rootEl.innerHTML = ''

    dailyWeather.forEach((day) => {
        const target = createDiv('day-infos')
        const dayDate = formatDate(new Date(day.dt * 1000))
        console.log(dayDate)
        dayResults = `<div>${dayDate.day}</div>`
        dayResults += `<div>${Math.round(day.temp.day)} °C</div>`
        dayResults += `<div>${classFromWeather(
            day.weather[0].main
        )}  ${capitalize(day.weather[0].description)}</div>`
        dayResults += `<div>${Math.round(day.temp.min)} °C / ${Math.round(
            day.temp.max
        )} °C</div>`
        target.innerHTML = dayResults

        rootEl.appendChild(target)
    })

    document.querySelector('#feels_like').textContent = feelsLike + ' °C'
    document.querySelector('#humidity').textContent = humidity + ' %'
    document.querySelector('#pressure').textContent = pressure + ' hPa'
    document.querySelector('#conditions').textContent = capitalize(description)
    document.querySelector('#city-name').textContent = city

    document.querySelector('#currentDay').textContent = capitalize(day)
    document.querySelector('#currentDate').textContent = dateFormat
    document.querySelector('#temperature').textContent =
        Math.round(temperature) + '°C'
    document.body.className = condition.toLowerCase()

    document.querySelector('.infos i.wi').className = weatherIcons[condition]
}

function formatDate(timestamp, userOptions = {}, lang = 'fr-FR') {
    const defaultOptions = {
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        year: 'numeric',
    }
    const options = Object.assign({}, defaultOptions, userOptions)
    // console.log('Options = ', options)

    const day = new Intl.DateTimeFormat(lang, {
        weekday: 'long',
    }).format(timestamp)
    const currentDay = new Intl.DateTimeFormat(lang, {
        weekday: 'long',
    }).format(Date.now())
    const dateFormat = new Intl.DateTimeFormat('fr-FR', defaultOptions).format(
        timestamp * 1000
    )
    console.log('T = ', timestamp)
    console.log('D = ', Date.now())
    return { day: day, dateFormat }
}

function classFromWeather(condition) {
    return `<i class='wi ${weatherIcons[condition]}'></i>`
}

const inputSearch = document.querySelector('#city')
const btnSearch = document.querySelector('#btn-search')
function validateSearch(e) {
    if (inputSearch.value.length > 3) {
        const cityData = fetch(
            'https://api.openweathermap.org/data/2.5/weather?q=' +
                inputSearch.value +
                '&apikey=' +
                apiKey +
                '&lang=fr&units=metric'
        )
            .then((response) => {
                if (!response.ok) {
                    return
                }
                return response.json()
            })
            .then((data) => {
                main(true, {
                    latitude: data.coord.lat,
                    longitude: data.coord.lon,
                    city: data.name,
                })
            })
            .catch((e) =>
                messageBox.displayMessage(`Cette ville n'existe pas `)
            )
        inputSearch.value = ''
    } else {
        messageBox.message = 'Veuillez saisir au moins 4 caractères'
    }
}

inputSearch.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault()
        validateSearch(e)
    }
})
btnSearch.addEventListener('click', validateSearch)

function capitalize(word) {
    const result = word[0].toUpperCase() + word.slice(1)
    return result
}

function createDiv(className) {
    const div = document.createElement('div')
    div.className = className
    return div
}

document.querySelector('.init-geolocation').addEventListener('click', (e) => {
    e.preventDefault()
    geolocalisation()
})

// window.addEventListener('load', () => {
//     const loader = document.querySelector('.loader')

//     loader.classList.add('loader--hidden')

//     loader.addEventListener('transitionend', () => {
//         document.body.removeChild(loader)
//     })
// })
class SetMessage {
    /**
     *
     * @param {HTMLElement} root -  HTMEement receving the div#message
     * @param {HTMLElement} clickedElement - HTMLElement which laucn the animation
     * @param {Object} options - Parameters of the animation
     */
    constructor(root, clickedElement, options = {}) {
        this.message = ''
        this.root = root
        this.clickedElement = clickedElement
        this.options = Object.assign(
            {},
            {
                delay: '1s',
                duration: '0.5s',
            },
            options
        )

        const targetBox = document.querySelector('#message')

        this.clickedElement.addEventListener('click', () => {
            this.setAnimation(targetBox, this.options)
        })
    }

    /**
     *
     * @param {HTMLElement} target - Element receiving message
     * @param {Object} properties - Properties for css transitions
     * @param {String} properties.duration - Duration of animation's box
     * @param {String} properties.property - Property(ies) to animate
     */

    setAnimation(target, properties) {
        target.textContent = this.message
        // target.className = 'message'
        target.style.transform = 'translateY(0)'
        target.style.transitionProperty = 'transform'
        target.style.transitionDuration = properties.duration

        target.addEventListener('transitionstart', (e) => {
            target.textContent = this.displayMessage(this.message)
        })

        target.addEventListener('transitionend', (e) => {
            console.log(e)
            // e.target.textContent = 'transitionend Terminée'
            target.style.transform = 'translateY(-100px)'
            target.style.transitionDelay = properties.delay
        })
        target.textContent = this.message
    }

    displayMessage(texte) {
        this.message = texte
        return texte
    }
}
const messageBox = new SetMessage(
    document.querySelector('.details'),
    document.querySelector('#btn-search'),
    { duration: '1s' }
)
messageBox.displayMessage()
geolocalisation()
