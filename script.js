

// Global elements
const backgroundContainer = document.querySelector('.background');
const closeModal = document.querySelector(".closeModal");
const body = document.body;

// Input & container elements
const userInput = document.querySelector(".userInput");
const searchBtn = document.querySelector(".searchBtn");
let inputsContainer = document.querySelector(".inputs");

// Image elements
const largeImg = document.querySelector(".largeImg");
const thumbnails = document.querySelector(".thumbnails");
const imgContainer = document.querySelector(".imgContainer");
const seeMore = document.querySelector(".seeMore");
const imageDescription = document.querySelector(".imageDescription");
const modal = document.querySelector(".imageModal");
const modalContent = document.querySelector(".modalContent");

// Weather elements
const locations = document.getElementById("location");
const weatherContainer = document.querySelector(".weatherContainer");
const temp = document.querySelector(".temp");
const weatherCondition = document.querySelector(".weatherCondition");
const weatherIcon = document.querySelector(".weatherIcon");
const weatherInfo = document.querySelector(".weatherInfo");
const locationIcon = document.getElementById("locationIcon");
const detailedWeatherBtn = document.querySelector(".detailedWeatherBtn");
const detailedWeatherSection = document.querySelector(".detailedWeatherSection");
const Container = document.querySelector(".container");




async function fetchData() {
    const weatherKey = "1f03d9c7f455d92952061ad7ded58c79";
    const unsplashKey = "rJ171ygJuCwePWLCiRi8YuMG62QcLOnvKnVzCqrRPNM";
    const query = userInput.value.trim();
    
    if (!query) {
        alert("Please enter a location or search term.");
        return;
    }
    
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${weatherKey}&units=metric`;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${weatherKey}&units=metric`;
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${unsplashKey}`;
    
    
    thumbnails.innerHTML = "";
    
    try {
        const [unsplashResponse, weatherResponse, forecastResponse] = await Promise.all([
            fetch(unsplashUrl),
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);
        
        const unsplashData = await unsplashResponse.json();
        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();
        
        const unsplashResults = unsplashData.results;
        window.latestResults = { unsplashResults, weatherData };
        
        console.log("Weather Data:", weatherData);
        console.log("Unsplash Results:", unsplashResults);
        console.log("Forecast Data:", forecastData);
        if (unsplashResults.length > 0) {
            updateImageGallery(unsplashResults);
        }
        

        if (weatherData.cod !== 200) {
            displayWeatherError(weatherData.message);
        } else {
            updateWeatherUI(weatherData);
            updateForecastUI(forecastData);
        }
        
        animateValidInputs(unsplashResults, weatherData);
        
      
    } catch (error) {
        console.error("Could not fetch data:", error);
        alert("Failed to load data. Please check your internet connection and try again.");
    }
}
function noImagesForArea() {
 
    Container.innerHTML=`
        <div class="page1">
            <h1>API-Search Engine</h1>
            <div class="inputs">
                <input required type="text" id="userInput" class="userInput" autocomplete="off">
                <label for="userInput" class="inputLabel">Search anything</label>
                <button class="searchBtn" aria-label="Search Button"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                  </svg>
                </button>
            </div>
            <div class="searchResultsContainer">
                <div class="weatherContainer">
                    <div class="weatherInfo">
                        <div class="locationContainer">
                            <h5 id="location"></h5>
                            <img src="location-pin.png" id="locationIcon">
                        </div>
                        <h5 class="weatherCondition"></h5>
                        <img src="" class="weatherIcon">
                        <h3 class="temp"></h3>
                        <a href="#detailedWeatherSection" class="detailedWeatherBtn">View Detailed Weather</a>
                    </div>
                </div>
                 <div id="detailedWeatherSection" class="detailedWeatherSection">
                <h2>Detailed Weather Information</h2>
                <div class="weatherDetails">
                    <div class="detail">
                        <span class="label">Humidity:</span>
                        <span class="value" id="humidity">--%</span>
                    </div>
                    <div class="detail">
                        <span class="label">Wind Speed:</span>
                        <span class="value" id="windSpeed">-- km/h</span>
                    </div>
                    <div class="detail">
                        <span class="label">Pressure:</span>
                        <span class="value" id="pressure">-- hPa</span>
                    </div>
                    <div class="forecast">
                        <h3>Upcoming Forecast</h3>
                        <ul id="forecastList">
                        </ul>
                    </div>
                </div>
            </div>
        </div>
                `
}
function imgsAvailableForArea(){
     Container.innerHTML=`
         <div class="page1">
            <h1>API-Search Engine</h1>
            <div class="inputs">
                <input required type="text" id="userInput" class="userInput" autocomplete="off">
                <label for="userInput" class="inputLabel">Search anything</label>
                <button class="searchBtn" aria-label="Search Button"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                  </svg>
                </button>
            </div>
            <div class="searchResultsContainer">
    
                <div class="weatherContainer">
                    <div class="weatherInfo">
                        <div class="locationContainer">
                            <h5 id="location"></h5>
                            <img src="location-pin.png" id="locationIcon">
                        </div>
                        <h5 class="weatherCondition"></h5>
                        <img src="" class="weatherIcon">
                        <h3 class="temp"></h3>
                        <a href="#detailedWeatherSection" class="detailedWeatherBtn">View Detailed Weather</a>
                    </div>
                </div>
    
                <div class="imgContainer">
                    <div class="largeImgContainer">
                        <img class="largeImg">
                        <p class="seeMore">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                <path fill="#2196f3" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M22 22h4v11h-4V22zM26.5 16.5c0 1.379-1.121 2.5-2.5 2.5s-2.5-1.121-2.5-2.5S22.621 14 24 14 26.5 15.121 26.5 16.5z"></path>
                                </svg>
                        </p>
                        <p class="imageDescription"></p>
                    </div>
                    <div class="thumbnails">
    
                    </div>
                </div>  
    
            </div>
        </div>
       
        <div id="detailedWeatherSection" class="detailedWeatherSection">
            <h2>Detailed Weather Information</h2>
            <div class="weatherDetails">
                <div class="detail">
                    <span class="label">Humidity:</span>
                    <span class="value" id="humidity">--%</span>
                </div>
                <div class="detail">
                    <span class="label">Wind Speed:</span>
                    <span class="value" id="windSpeed">-- km/h</span>
                </div>
                <div class="detail">
                    <span class="label">Pressure:</span>
                    <span class="value" id="pressure">-- hPa</span>
                </div>
                <div class="forecast">
                    <h3>Upcoming Forecast</h3>
                    <ul id="forecastList">
                    </ul>
                </div>
            </div>
        </div>
     `
}


function displayWeatherError(message) {
    locations.innerText = "Error: " + message;
    weatherContainer.style.width = "0";
    weatherContainer.style.height = "0";
    weatherContainer.style.overflow = "hidden";
    locationIcon.style.opacity = "0";
    detailedWeatherSection.style.display = "none";
}


function updateWeatherUI(weatherData) {
    
    modalContent.src = "";
    body.style.overflow = "scroll";
   
    detailedWeatherSection.style.display = "block";
    detailedWeatherBtn.style.display = "inline-block";
    locations.innerText = weatherData.name;
    weatherInfo.style.animation = "locationAnimation 1.5s ease-in-out";
    locationIcon.style.opacity = "1";
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    temp.innerText = `${Math.floor(weatherData.main.temp)} °C`;
    weatherCondition.innerText = weatherData.weather[0].main;
    weatherContainer.style.width = "40%";
    weatherContainer.style.height = "auto";
    weatherContainer.style.overflow = "auto";
    

    animateTemperatureRange(weatherData.main.temp);
    
    imageDescription.style.opacity = "0";
    
   
    document.getElementById("humidity").innerText = weatherData.main.humidity + "%";
    document.getElementById("windSpeed").innerText = weatherData.wind.speed + " km/h";
    document.getElementById("pressure").innerText = weatherData.main.pressure + " hPa";
}


function updateForecastUI(forecastData) {
    if (forecastData.cod === "200") {
        const forecastList = document.getElementById("forecastList");
        forecastList.innerHTML = "";
        const dailyData = {};
        
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString(undefined, { weekday: "short" });
            if (!dailyData[date]) {
                dailyData[date] = {
                    temps: [],
                    condition: item.weather[0].main,
                    icon: item.weather[0].icon
                };
            }
            dailyData[date].temps.push(item.main.temp);
        });
        
        Object.keys(dailyData).forEach(date => {
            const avgTemp = Math.round(
                dailyData[date].temps.reduce((a, b) => a + b, 0) / dailyData[date].temps.length
            );
            const forecastItem = document.createElement("li");
            forecastItem.classList.add("forecastItem");
            forecastItem.innerHTML = `
                <span class="date">${date}</span>
                <img src="https://openweathermap.org/img/w/${dailyData[date].icon}.png" alt="${dailyData[date].condition}" class="forecastIcon">
                <span class="temp">${avgTemp}°C</span>
            `;
            forecastList.appendChild(forecastItem);
        });
    }
    else{
        body.style.overflow = "hidden";
    }
    
}

function animateValidInputs(unsplashResults, weatherData) {
    if (unsplashResults.length > 0 || weatherData) {
        inputsContainer.classList.add("validInput");
        inputsContainer.classList.remove("inputs");
    }
}

function updateImageGallery(unsplashResults) {
    
if(unsplashResults && unsplashResults.length > 0){
    imgContainer.style.opacity = "1";
    imgContainer.style.display="block";
 
    largeImg.src = unsplashResults[0].urls.regular;
    largeImg.classList.add("displayedImg");
    modalContent.src = unsplashResults[0].urls.raw;
    
    let currentImg = unsplashResults[0];
    
    unsplashResults.forEach(result => {
        const newImg = document.createElement("img");
        newImg.src = result.urls.thumb;
        thumbnails.appendChild(newImg);
        
        newImg.addEventListener("click", () => {
          
            resetImageState();
            largeImg.classList.add("hidden");
            seeMore.classList.add("hidden");
            
            setTimeout(() => {
                largeImg.src = result.urls.regular;
                largeImg.classList.remove("hidden");
                currentImg = result;
                seeMore.classList.remove("hidden");
                seeMore.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 48 48">
                    <path fill="#2196f3" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path>
                    <path fill="#fff" d="M22 22h4v11h-4V22zM26.5 16.5c0 1.379-1.121 2.5-2.5 2.5s-2.5-1.121-2.5-2.5S22.621 14 24 14 26.5 15.121 26.5 16.5z"></path>
                </svg>`;
            }, 300);
            modalContent.src = "";
        });
    });
    
    seeMore.addEventListener("click", () => {
        toggleImageDescription(currentImg);
    });
    

    largeImg.addEventListener("click", () => {
        modalContent.src = currentImg.urls.raw;
        modal.classList.remove("hidden");
        inputsContainer.style.zIndex = "0";
    });
}
    
}


function resetImageState() {
    imageDescription.innerText = "";
}


function toggleImageDescription(currentImg) {
    if (!currentImg) return;
    
    if (imageDescription.classList.contains("active")) {
        imageDescription.classList.remove("active");
        imageDescription.style.width = "0";
        imageDescription.style.opacity = "0";
        seeMore.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 48 48">
                <path fill="#2196f3" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path>
                <path fill="#fff" d="M22 22h4v11h-4V22zM26.5 16.5c0 1.379-1.121 2.5-2.5 2.5s-2.5-1.121-2.5-2.5S22.621 14 24 14 26.5 15.121 26.5 16.5z"></path>
            </svg>`;
    } else {
        imageDescription.classList.add("active");
        setTimeout(() => {
            imageDescription.innerText = currentImg.alt_description || "No description available";
            imageDescription.style.width = "auto";
            imageDescription.style.opacity = "1";
        }, 200);
        seeMore.innerHTML = `
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="#2F88FF" stroke="#00000" stroke-width="4"></path>
                <path d="M29.6569 18.3431L18.3432 29.6568" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M18.3432 18.3431L29.6569 29.6568" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>`;
    }
}


searchBtn.addEventListener("click", fetchData);

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});





function animateInvalidInputs() {
    let { unsplashResults, weatherData } = window.latestResults || {};
    if (!unsplashResults.length > 0 || !weatherData) {
        inputsContainer.classList.remove("validInput");
        inputsContainer.classList.add("inputs");
    }
}

searchBtn.addEventListener("click", function () {
    fetchData();
});

userInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        fetchData();
    }
});
closeModal.addEventListener("click", function () {
    document.querySelector(".imageModal").classList.add("hidden");
    inputsContainer.style.zIndex ="100";
    
});


function animateTemperatureRange(temperature) {
    backgroundContainer.innerHTML = "";

    if (temperature < 0) {
        for (let i = 0; i < 50; i++) {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            snowflake.style.left = `${Math.random() * 100}vw`;
            snowflake.style.animationDuration = `${Math.random() * 6 + 2}s`;
            backgroundContainer.appendChild(snowflake);
        }
    } else if (temperature >= 0 && temperature <= 15 && weatherCondition.innerText !=="Rain") {
        for (let i = 0; i < 30; i++) {
            const leaf = document.createElement('div');
            leaf.classList.add('leaf');
            leaf.style.left = `${Math.random() * 100}vw`;
            leaf.style.animationDuration = `${Math.random() * 5 + 2}s`;
            backgroundContainer.appendChild(leaf);
        }
    } else if (temperature > 15 && temperature <= 30 && weatherCondition.innerText !=="Rain") {
        for (let i = 0; i < 40; i++) {
            const sunbeam = document.createElement('div');
            sunbeam.classList.add('sunbeam');
            sunbeam.style.left = `${Math.random() * 100}vw`;
            sunbeam.style.animationDuration = `${Math.random() * 4 + 1}s`;
            backgroundContainer.appendChild(sunbeam);
        }
    } else if(weatherCondition.innerText ==="Rain"){
        const maxRaindrops = 100; 
        for (let i = 0; i < maxRaindrops; i++) {
            const raindrop = document.createElement('div');
            raindrop.classList.add('raindrop');
            raindrop.style.left = `${Math.random() * 100}vw`;
            raindrop.style.animationDuration = `${Math.random() * 8 + 1}s`;
            raindrop.style.animationDelay = 0;
            backgroundContainer.appendChild(raindrop);
        }
    }
    else {
        
        for (let i = 0; i < 20; i++) {
            const heatwave = document.createElement('div');
            heatwave.classList.add('heatwave');
            heatwave.style.left = `${Math.random() * 100}vw`;
            heatwave.style.animationDuration = `${Math.random() * 8 + 5}s`;
            backgroundContainer.appendChild(heatwave);
        }
    }
}


