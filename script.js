const apiKey = "c9ea3a0e80b36a06c024c858d9291d2e";
const body = document.body;

// تغییر تم
document.getElementById("themeToggle").addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const icon = document.querySelector("#themeToggle i");
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");
});

const quotes = {
    Clear: "Sun is out, fun is out!",
    Clouds: "Just a few clouds in the sky.",
    Rain: "Grab an umbrella and enjoy the rhythm.",
    Snow: "Time for a snowball fight!",
    Thunderstorm: "Nature is being loud today.",
    Default: "Have a great day!"
};

async function checkWeather(city) {
    if (!city) return;
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`);
        if (res.status == 404) { alert("City not found!"); return; }
        
        const data = await res.json();
        const status = data.weather[0].main;

        document.getElementById("cityName").innerText = data.name;
        document.getElementById("temperature").innerText = Math.round(data.main.temp) + "°C";
        document.getElementById("humidity").innerText = data.main.humidity + "%";
        document.getElementById("wind").innerText = data.wind.speed + " km/h";
        document.getElementById("description").innerText = data.weather[0].description;
        document.getElementById("weatherQuote").innerText = quotes[status] || quotes.Default;

        updateIcon(status);
        updateBackground(status);
        updateWeatherEffects(status);

    } catch (err) { console.error(err); }
}

function updateIcon(status) {
    const icon = document.getElementById("weatherIcon");
    icon.className = "fas weather-icon-large ";
    if (status === "Clear") icon.classList.add("fa-sun");
    else if (status === "Clouds") icon.classList.add("fa-cloud");
    else if (status === "Rain") icon.classList.add("fa-cloud-showers-heavy");
    else if (status === "Snow") icon.classList.add("fa-snowflake");
    else icon.classList.add("fa-smog");
}

function updateBackground(status) {
    const backgrounds = {
        Clear: "https://images.unsplash.com/photo-1506452305024-9d3f02d1c90a?q=80&w=1920",
        Clouds: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1920",
        Rain: "https://images.unsplash.com/photo-1438449805896-28a666819a20?q=80&w=1920",
        Snow: "https://images.pexels.com/photos/60561/winter-snow-nature-ice-60561.jpeg?auto=compress&w=1920"
    };
    const url = backgrounds[status] || backgrounds.Clear;
    body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${url}')`;
}

async function updateWeatherEffects(status) {
    if (typeof tsParticles === "undefined") return;
    const container = tsParticles.domItem(0);
    if (container) container.destroy();

    if (status === "Rain") {
        await tsParticles.load("tsparticles", {
            particles: {
                number: { value: 100 },
                shape: { type: "line" },
                opacity: { value: 0.5 },
                size: { value: { min: 1, max: 2 } },
                move: { enable: true, speed: 20, direction: "bottom", straight: true }
            }
        });
    } else if (status === "Snow") {
        await tsParticles.load("tsparticles", {
            particles: {
                number: { value: 100 },
                shape: { type: "circle" },
                opacity: { value: 0.8 },
                size: { value: { min: 2, max: 5 } },
                move: { enable: true, speed: 2, direction: "bottom" }
            }
        });
    }
}

document.getElementById("searchBtn").addEventListener("click", () => checkWeather(document.getElementById("cityInput").value));
document.getElementById("cityInput").addEventListener("keypress", (e) => { if (e.key === "Enter") checkWeather(e.target.value); });
