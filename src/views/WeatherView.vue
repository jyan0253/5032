<template>
  <section class="container py-4 weather-view">
    <h1 class="mb-3">Weather Check</h1>

    <div class="input-group mb-3">
      <input
        v-model="city"
        type="text"
        class="form-control"
        placeholder="Search by city (e.g. Clayton, AU)"
        @keyup.enter="searchByCity"
      />
      <button class="btn btn-primary" type="button" @click="searchByCity">
        Search
      </button>
    </div>

    <main>
      <div v-if="weatherData" class="card">
        <div class="card-body">
          <h2 class="card-title">
            {{ weatherData.name }}, {{ weatherData.sys.country }}
          </h2>

          <div class="d-flex align-items-center gap-3 mb-2">
            <img
              v-if="iconUrl"
              :src="iconUrl"
              alt="Weather Icon"
              width="80"
              height="80"
            />
            <p class="display-6 mb-0">{{ temperature }} °C</p>
          </div>

          <span class="text-muted text-capitalize">
            {{ weatherData.weather[0].description }}
          </span>
        </div>
      </div>
    </main>

    <p v-if="!weatherData" class="text-muted">
      Enter a city above or allow location access to check the current weather.
    </p>

    <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
      {{ errorMessage }}
    </div>
  </section>
</template>

<script>
import axios from "axios";

const apikey = "4ab8171d17727b340709bac99c0dfd47";

export default {
  name: "WeatherView",
  data() {
    return {
      city: "",
      weatherData: null,
      hourlyForecast: [],
      dailyForecast: [],
      errorMessage: "",
    };
  },
  computed: {
    temperature() {
      if (!this.weatherData?.main || this.weatherData.main.temp == null) {
        return null;
      }
      return Math.round(Number(this.weatherData.main.temp));
    },
    iconUrl() {
      return this.weatherData
        ? `https://openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`
        : null;
    },
  },
  mounted() {
    this.fetchCurrentLocationWeather();
  },
  methods: {
    async fetchCurrentLocationWeather() {
      if (!apikey || apikey === "YOUR_OPENWEATHERMAP_API_KEY") {
        this.errorMessage =
          "Set your OpenWeatherMap API key to enable weather lookups.";
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`;
            await this.fetchWeatherData(url);
          },
          () => {
            this.errorMessage =
              "Unable to fetch your current location. Please search by city.";
          }
        );
      } else {
        this.errorMessage =
          "Geolocation is not supported in this browser. Please search by city.";
      }
    },
    async searchByCity() {
      const targetCity = this.city.trim();

      if (!targetCity) {
        this.errorMessage = "Please enter a city name.";
        return;
      }

      if (!apikey || apikey === "YOUR_OPENWEATHERMAP_API_KEY") {
        this.errorMessage =
          "Set your OpenWeatherMap API key to enable weather lookups.";
        return;
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        targetCity
      )}&units=metric&appid=${apikey}`;
      await this.fetchWeatherData(url);
    },
    async fetchWeatherData(url) {
      try {
        this.errorMessage = "";
        const response = await axios.get(url);
        this.weatherData = response.data;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        this.weatherData = null;
        this.errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Unable to retrieve weather information. Please try again.";
      }
    },
  },
};
</script>

<style scoped>
.weather-view main .card {
  max-width: 28rem;
}
</style>
