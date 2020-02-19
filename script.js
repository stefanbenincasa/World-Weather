// PROGRAM
// If there is storage data indicating that weather data has already been input from previous session, use that Object to call api

if ( storageEmpty() ){

    // Update UI to prompt new location data
    newLocationDisplay();

    // Listen to input fields
    document.getElementById("submit").addEventListener("click", async function newLocation(e) {

        e.preventDefault();

        // Grab data from input fields
        const inCity = document.getElementById("cityInput").value;
        const inCountry = document.getElementById("countryInput").value;

        // Match input country with country code API
        const countryCode = await countryCodesApi(inCountry);

        // Query API for weather relative to location
        const weather = await weatherApi(inCity, countryCode); 
        const truncTemp = Math.trunc(weather.main.temp);

        // Make Location object 
        const location = {
            city: inCity,
            country: countryCode,
            weather: weather,
            temperature: truncTemp
        }

        // Store in sessionStorage
        sessionStorage.setItem("City", location.city);
        sessionStorage.setItem("Country", location.country);
        sessionStorage.setItem("Temperature", location.temperature);
        console.log(sessionStorage);

        // On response, present new page with relevant information

    });
} 
else {
    
    
    // Update UI with previous stored API data relative to the location stored in sessionStorage
}   

function newLocationDisplay() {

    // Dynamic change of container Display
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";

    // Plant HTML
    container.innerHTML = `
        <form class="newLocation">
            <input type="text" id="cityInput" name="city">
            <input type="text" id="countryInput" name="country">
            <input type="submit" id="submit">
        </form>
    `;
}

function storageEmpty() {
    if (sessionStorage.length === 0) return true;
    else return false;
}

function locale() {

    function customLocation() {

        // Update view to show UI allowing input for custom location
        //const newLocation = "Test";
    }

    function existingLocation() {

    }
}

function icons() {
    // Store Font Awesome links to various weather icons based on recieved temperature from API in array
}

async function weatherApi(inCity, inCountry) {

    const apiKey = "a3b951b941cf45ce8cb28d899d8da886";

    const rawRepsonse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inCity},${inCountry}&units=metric&appid=${apiKey}`);
    const response = await rawRepsonse.json();
    const locationWeather = response;

    return locationWeather;
}   
async function countryCodesApi(inCountry) {

    const rawRepsonse = await fetch(`https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json`);
    const response = await rawRepsonse.json();
    
    // Match country code with parameter country
    let countryCode;
    response.forEach( (country) => {
        if (country.Name === inCountry) countryCode = country.Code;
    })

    return countryCode;
}