

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
async function main() {
    const coords = await geolocalisation()
    const meteo = await fetch(
        'https://api.openweathermap.org/data/2.5/weather?q=' +
            maVille +
            '&apikey=' +
            apiKey +
            '&lang=fr&units=metric'
    )
        // const meteo = await fetch(
        //     'https://api.openweathermap.org/data/2.5/onecall?lat=' +
        //         latitude +
        //         '&lon=' +
        //         longitude +
        //         '&apikey=' +
        //         apiKey +
        //         '&lang=fr&units=metric'
        // )
        .then((response) => response.json())
        .then((res) => {
            console.log(res)
            displayWeatherInfos(res)
        })
}
async function getGeoPosition(data) {
    console.log('Data = ', data)
    const infos = await data
    if (infos) {
        setMessage(
            'Latitude = ' + infos.latitude + 'Longitude =' + infos.longitude
        )
        return data
    }
}
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
        console.log('CRD = ', crd)

        getGeoPosition(crd)
        setMessage('Votre ville a été trouvée')
        setMessage('Bravo')
        return crd
    }
    function error(err) {
        setMessage(`ERREUR (${err.code}): ${err.message}`)
        setMessage('Impossible de vous localiser')
    }
    return navigator.geolocation.getCurrentPosition(success, error, options)
}

function capitalize(word) {
    const result = word[0].toUpperCase() + word.slice(1)
    return result
}

function displayWeatherInfos(data) {
    const lon = data.coord.lon
    const lat = data.coord.lat
    const temperature = data.main.temp
    const city = data.name
    const feelsLike = Math.round(data.main.feels_like)
    const humidity = data.main.humidity
    const pressure = data.main.pressure
    const description = data.weather[0].description
    const condition = data.weather[0].main
    const date = new Date()

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
    const dateFormat = new Intl.DateTimeFormat('fr-FR', options).format(date)
    const day = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(
        date
    )

    document.querySelector('#feels_like').textContent = feelsLike + ' °C'
    document.querySelector('#humidity').textContent = humidity + ' %'
    document.querySelector('#pressure').textContent = pressure + ' bar'
    document.querySelector('#conditions').textContent = capitalize(description)
    document.querySelector('#city-name').textContent = data.name

    document.querySelector('#currentDay').textContent = capitalize(day)
    document.querySelector('#currentDate').textContent = dateFormat
    document.querySelector('#temperature').textContent =
        Math.round(temperature) + '°C'
    document.body.className = condition.toLowerCase()

    document.querySelector('i.wi').className = weatherIcons[condition]
}

// console.log(test)
/**
 *
 * @param {HTML_Element} - affiche un message popup
 * @param {string} - Message à afficher
 */
function setMessage(message) {
    const target = document.querySelector('#message')
    target.textContent = message
    target.className = 'message'
    target.style.transform = 'translateY(0)'
    target.style.transitionProperty = 'transform'
    target.style.transitionDuration = '2s'
}
main()
