// Main 
(async function main() {

    // If there is storage data indicating that weather data has already been input from previous session, use that Object to call api

    if ( storage() ){

        // Update UI with previous stored API data relative to the location stored in sessionStorage
    } 
    else {
        
        // Update UI to prompt new location data
        const inputData = await UI("New Location Display");
        console.log(inputData);

    
        // Generate new location screen
        //positioning(inputData); 
    }

})(); 

function storage() {

    if (storageEmpty()) return storageEmpty();

    function storageEmpty() {
        if (window.sessionStorage.length === 0) return true;
        else return false;
    }
}

function locale() {

    function customLocation() {

        // Update view to show UI allowing input for custom location
        //const newLocation = "Test";
    }

    function existingLocation() {

    }
}

function UI(view) {

    const container = document.getElementById("container");

    switch (view) {

        case    "New Location Display" :
                newLocationDisplay();
                listenToInputs();
                break;

        case    "Pull Location in Storage" :
                break;

        default:
        break;
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

    function listenToInputs() {
         // Listen for submit -> form validation needed in future
         document.getElementById("submit").addEventListener("click", getInputValues);
    }

    function getInputValues(e) {

        e.preventDefault();

        // Perhaps send these values back to the top of the program
        const city = document.getElementById("cityInput").value;
        const country = document.getElementById("countryInput").value;
        const inputData = {city: city, country: country}

        return inputData;
    }


    function characterLimit(element) {}
}

async function weatherApi() {

    const city = "Melbourne";
    const country = "AU";
    const apiKey = "a3b951b941cf45ce8cb28d899d8da886";

    const rawRepsonse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${apiKey}`);
    const response = await rawRepsonse.json(); 
    console.log(response);
}   

async function countryCodesApi() {

    const rawRepsonse = await fetch(`https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json`);
    const response = await rawRepsonse.json(); 

    console.log(response);
}

function icons() {
    // Store Font Awesome links to various weather icons based on recieved temperature from API in array
}
