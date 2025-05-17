

// Global elements
const backgroundContainer = document.querySelector('.background');
const closeModal = document.querySelector(".closeModal");
const body = document.body;
const loader = document.querySelector(".loader");

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
    const cachedWeather = getCachedData(`weather_${query}`, 3600000);
    const cachedForecast = getCachedData(`forecast_${query}`, 3600000);
    const cachedUnsplash = getCachedData(`unsplash_${query}`, 86400000);

    if(cachedWeather&&cachedForecast&&cachedUnsplash){
        console.log("Using cached data");
        console.log(localStorage);
        updateWeatherUI(cachedWeather);
        updateForecastUI(cachedForecast);
        updateImageGallery(cachedUnsplash);
        animateValidInputs(cachedUnsplash, cachedWeather);
        return;
    }
    
    try {
        const [unsplashResponse, weatherResponse, forecastResponse] = 
        await Promise.all([
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
         

        setCacheData(`weather_${query}`, weatherData);
        setCacheData(`forecast_${query}`, forecastData);
        setCacheData(`unsplash_${query}`, unsplashResults);

        if (unsplashResults.length > 0) {
            updateImageGallery(unsplashResults);
        }
        

        if (weatherData.cod !== 200) {
            displayWeatherError(weatherData.message);
        } else {
            loader.style.display = "block";
            updateWeatherUI(weatherData);
            updateForecastUI(forecastData);
            updateBodyVisibility(forecastData);

        }
        animateValidInputs(unsplashResults, weatherData);
   
    
    } catch (error) {
        console.error("Could not fetch data:", error);
        alert("Failed to load data. Please check your internet connection and try again.");
        loader.style.display = "block";
    }
}


function setCacheData(key, data){
    localStorage.setItem(key, JSON.stringify({data, timestamp: Date.now()}));
}
function getCachedData(key, maxAge){
    const cachedData= localStorage.getItem(key);
    if(!cachedData){
        return null;
    }
    const parsedCache = JSON.parse(cachedData);
    return Date.now() - parsedCache.timestamp < maxAge ? parsedCache.data:null;
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
    if (!weatherData || !weatherData.weather || weatherData.weather.length === 0) {
    console.error("Invalid weather data received!", weatherData);
    weatherContainer.style.width ="0";
    weatherContainer.style.overflow ="hidden";
    return; 
}


    if (weatherData.weather && weatherData.weather.length > 0) {
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    } else {
    console.error("Weather data missing or empty!", weatherData);
    }

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
            loader.style.display = "block";
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
            }, 1000);
            largeImg.onload = () =>{
                 setTimeout(() => {
                    loader.style.display = "none"; 
                }, 150); 
            }
            modalContent.src = "";
        });
    });
    
    seeMore.addEventListener("click", () => {
        toggleImageDescription(currentImg);
    });
    

    largeImg.addEventListener("click", () => {
        
        modalContent.src = "";
        loader.style.display = "block";
        modalContent.src = currentImg.urls.raw;
        modal.classList.remove("hidden");
        inputsContainer.style.zIndex = "0";
        modalContent.onload= () => {
                setTimeout(() => {
                    loader.style.display = "none"; 
                }, 100); 
        };

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
searchBtn.addEventListener("click",()=>{
    fetchData()
    document.querySelector(".searchResultsContainer").classList.add("fade-in");
    });
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
    body.classList.add("fade-in");
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
function animateTemperatureRange(temperature, weatherCondition) {
    backgroundContainer.innerHTML = "";
    const fragment = document.createDocumentFragment(); 

    if (weatherCondition === "Rain") {
        generateElements(fragment, "raindrop", 100, "raindrop-fall");
    } else if (temperature < 0) {
        generateElements(fragment, "snowflake", 50, "snowflake-fall");
    } else if (temperature >= 0 && temperature <= 15) {
        generateElements(fragment, "leaf", 30, "leaf-fall");
    } else if (temperature > 15 && temperature <= 30) {
        generateElements(fragment, "sunbeam", 40, "sunbeam-rise");
    } else {
        generateElements(fragment, "heatwave", 20, "heatwave-expand");
    }

    backgroundContainer.appendChild(fragment); 
}
function updateBodyVisibility(forecastData){
    if(forecastData && forecastData.list.length>0 && forecastData.list){
        backgroundContainer.style.height = "200vh"
    }
    else{
        backgroundContainer.style.height = "100vh";
        body.style.overflow ="hidden"
    }
}

function generateElements(fragment, className, count, animationName) {
    for (let i = 0; i < count; i++) {
        const element = document.createElement("div");
        element.classList.add(className);
        element.style.left = `${Math.random() * 100}vw`;
        element.style.top = `${Math.random() * 100}vh`;
        element.style.animationDuration = `${Math.random() * 8 + 2}s`;
        element.style.animationName = animationName;
        fragment.appendChild(element); 
    }
}

