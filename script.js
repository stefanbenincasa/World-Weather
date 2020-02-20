// PROGRAM

// If there is storage data indicating that weather data has already been input from previous session, use that Object to call api

if ( !storageEmpty() ){

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

        // Make Location object 
        const location = {
            city: inCity,
            country: countryCode,
            forecast: []
        }

        // Run function that extracts both the date and temperature from "12pm" indexes of each day

        const list = weather.list 
        let i = 2; 
        while (i < list.length) {

            // Convert each of these dates to a real day
            let dayOfWeekNum = unixTimestamp(list[i].dt);
            let weekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            
            // Extract temperature and day
            location.forecast.push( {
                overallWeather: list[i].weather[0].main,
                day: weekNames[dayOfWeekNum],
                temperature: Math.trunc(list[i].main.temp)
            });

            // Increment index by 8 => days broken into three hour time blocks = 24/3 = 8 ; 12pm selected fro each of the five days
            i += 8;
        }

        // Log location
        console.log(location);

        // Store in sessionStorage
        sessionStorage.setItem("City", location.city);
        sessionStorage.setItem("Country", location.country);
        sessionStorage.setItem("Forecast", JSON.stringify(location.forecast));

        // On response, present new page with relevant information
        locationDisplay(location);
    });
} 

/*else {
    
    // Update UI with previous stored API data relative to the location stored in sessionStorage

} */  

// UI
function newLocationDisplay() {

    const container = document.getElementById("container"); 

    // Dynamic change of container Display
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";

    // Plant HTML
    container.innerHTML = `
        <form id="newLocation">
            <input type="text" id="cityInput" name="city">
            <input type="text" id="countryInput" name="country">
            <input type="submit" id="submit">
        </form>
    `;
}
function locationDisplay(location) {

    // Clear container
    document.getElementById("container").innerHTML = "";

    // Install UI for main icons and small icons for each day
    container.innerHTML = `
        <div id="location">
            <div id="mainIcon" class="icon"></div>
            <div id="dayIcons"></div>
        </div>
    `;


    // Get relevant elements
    const locationElement = document.getElementById("location");
    const mainIconElement = document.getElementById("mainIcon");
    const dayIconsElement = document.getElementById("dayIcons");

    // Prime display with style edits
    locationElement.style.display = "grid";
    locationElement.style.gridTemplateRows = "2fr 1fr";
    locationElement.style.gridGap = ".5rem";

    // Depending status of 'overallWeather", use a particular icon from Font Awesome
    setIcon(location);

    // Set mainIcon first
    mainIconElement.innerHTML = 
    "Today" + location.forecast[0].icon +
    location.forecast[0].temperature + "°C";
    // Set other icons
    location.forecast.forEach( (object, index) => {

        if (index == 0) return;

        dayIconsElement.innerHTML += `
            <div class="icon">
                ${object.day}
                ${object.icon}
                ${object.temperature}°C
            </div>
        `
    })


    function setIcon(location) {

        location.forecast.forEach( (day) => {
            if (day.overallWeather.toUpperCase().includes("RAIN")) {
                day.icon = getIconTag("rain");
            }
            else if (day.overallWeather.toUpperCase().includes("STORM")) {
                day.icon = getIconTag("storm");
            }
            else if (day.overallWeather.toUpperCase().includes("CLEAR")) {
                day.icon = getIconTag("clear");
            }
            else if (day.overallWeather.toUpperCase().includes("CLOUDS")) {
                day.icon = getIconTag("clouds");
            }
            else if (day.overallWeather.toUpperCase().includes("SNOW")) {
                day.icon = getIconTag("snow");
            }
        });

        function getIconTag(weatherStatus) {
    
            switch (weatherStatus) {
                case "rain" :   
                    return `<i class="fas fa-cloud-showers-heavy"></i>`;
                case "storm" :  
                    return `<i class="fas fa-bolt"></i>`;
                case "clear" :  
                    return `<i class="fas fa-sun"></i>`;
                case "clouds" : 
                    return `<i class="fas fa-cloud"></i>`;
                case "snow" :
                    return `<i class="fas fa-snowflake"></i>`;
    
                default :  return `<i class="fas fa-cloud"></i>`; 
            }
        }
    }

}

// STORAGE
function storageEmpty() {
    if (sessionStorage.length === 0) return true;
    else return false;
}

// API
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
async function weatherApi(inCity, inCountry) {

    const apiKey = "a3b951b941cf45ce8cb28d899d8da886";

    const rawRepsonse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${inCity},${inCountry}&units=metric&appid=${apiKey}`);
    const response = await rawRepsonse.json();
    const locationWeather = response;

    return locationWeather;
} 

// HELPERS
function unixTimestamp(utc)
{
    let dt = new Date(utc*1000);
    let day = dt.getDay();
    return +day ;  
}