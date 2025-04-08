<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const API_KEY = 'NRJ4H93-BY142Z7-PJWMP19-KW78C1W'
const route = useRoute()
const router = useRouter()
const movie = ref(null)
const isLoading = ref(true)
const error = ref(null)

const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.";

const fetchMovieDetails = async (id) => {
  try {
    isLoading.value = true
    const response = await fetch(`https://api.kinopoisk.dev/v1.4/movie/${id}`, {
      headers: {
        'X-API-KEY': API_KEY
      }
    })
    if (!response.ok) throw new Error('Ошибка загрузки данных')
    const data = await response.json()
    movie.value = data
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  if (route.query.id) {
    fetchMovieDetails(route.query.id)
  }
})

watch(() => route.query.id, (newId) => {
  if (newId) {
    fetchMovieDetails(newId)
  }
})
</script>


<template>
    <div class="about">
      <button @click="goBack" class="back-button">← Назад к фильмам</button>
  
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Загрузка данных...</p>
      </div>
  
      <div v-if="error" class="error">
        {{ error }}
      </div>
  
      <div v-if="!isLoading && !error && movie" class="movie-details">
        <div class="movie-header">
          <div class="poster-container">
            <img 
              v-if="movie.poster && movie.poster.url" 
              :src="movie.poster.url" 
              :alt="movie.name"
              class="movie-poster"
            >
            <div v-else class="no-poster">Нет изображения</div>
          </div>
          <div class="movie-meta">
            <h1>{{ movie.name || 'Без названия' }}</h1>
            <p class="original-name" v-if="movie.alternativeName">{{ movie.alternativeName }}</p>
  
            <div class="rating-container">
              <div class="rating-box" v-if="movie.rating?.kp">
                <span class="rating-value">{{ movie.rating.kp.toFixed(1) }}</span>
                <span class="rating-label">КиноПоиск</span>
              </div>
  
              <div class="rating-box" v-if="movie.rating?.imdb">
                <span class="rating-value">{{ movie.rating.imdb.toFixed(1) }}</span>
                <span class="rating-label">IMDb</span>
              </div>
            </div>
  
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Год:</span>
                <span class="info-value">{{ movie.year || 'Н/Д' }}</span>
              </div>
  
              <div class="info-item">
                <span class="info-label">Длительность:</span>
                <span class="info-value">{{ movie.movieLength || 'Н/Д' }} мин</span>
              </div>
  
              <div class="info-item">
                <span class="info-label">Страны:</span>
                <span class="info-value">
                  <span v-for="(country, index) in movie.countries" :key="country.name">
                    {{ country.name }}<span v-if="index < movie.countries.length - 1">, </span>
                  </span>
                  <span v-if="!movie.countries || movie.countries.length === 0">Н/Д</span>
                </span>
              </div>
  
              <div class="info-item">
                <span class="info-label">Жанры:</span>
                <span class="info-value">
                  <span v-for="(genre, index) in movie.genres" :key="genre.name">
                    {{ genre.name }}<span v-if="index < movie.genres.length - 1">, </span>
                  </span>
                  <span v-if="!movie.genres || movie.genres.length === 0">Н/Д</span>
                </span>
              </div>
            </div>
          </div>
        </div>
  
        <div class="movie-description">
          <h2>Описание</h2>
          <p>{{ movie.description || loremText }}</p>
        </div>
  
        <!-- 🎬 Плеер -->
        <div class="movie-player" v-if="movie.watchability?.items?.length">
          <h2>Смотреть онлайн</h2>
          <iframe
            :src="movie.watchability.items[0].url"
            frameborder="0"
            allowfullscreen
            class="player-iframe"
          ></iframe>
        </div>
      </div>
  
      <div v-if="!isLoading && !error && !movie" class="no-movie">
        <h2>Фильм не найден</h2>
        <p>Попробуйте выбрать другой фильм</p>
      </div>
    </div>
  </template>
  
<style scoped>
.movie-player {
  margin-top: 40px;
}

.movie-player h2 {
  color: #ffffff;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
}

.player-iframe {
  width: 100%;
  height: 500px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .player-iframe {
    height: 300px;
  }
}

.about {
  padding: 20px;
  color: #e0e0e0;
}

.back-button {
  background: linear-gradient(135deg, #512da8, #304ffe);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.4);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  color: #ff6b6b;
  text-align: center;
  padding: 20px;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 5px;
}

.movie-details {
  max-width: 1200px;
  margin: 0 auto;
}

.movie-header {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.poster-container {
  flex: 0 0 300px;
}

.movie-poster {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.no-poster {
  width: 300px;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2c3e50;
  color: #bdc3c7;
  border-radius: 10px;
}

.movie-meta {
  flex: 1;
  min-width: 300px;
}

h1 {
  font-size: 2.2em;
  margin-bottom: 10px;
  color: #ffffff;
}

.original-name {
  font-size: 1.2em;
  color: #bdc3c7;
  margin-bottom: 20px;
  font-style: italic;
}

.rating-container {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.rating-box {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px 20px;
  text-align: center;
  min-width: 80px;
}

.rating-value {
  display: block;
  font-size: 1.8em;
  font-weight: bold;
  color: #f1c40f;
}

.rating-label {
  font-size: 0.9em;
  color: #bdc3c7;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.info-item {
  margin-bottom: 10px;
}

.info-label {
  display: block;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 5px;
}

.info-value {
  color: #bdc3c7;
}

.movie-description {
  margin-bottom: 40px;
  line-height: 1.6;
}

.movie-description h2 {
  color: #ffffff;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
}

.movie-description p {
  text-align: justify;
}

.no-movie {
  text-align: center;
  padding: 50px;
}

.no-movie h2 {
  color: #ffffff;
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .movie-header {
    flex-direction: column;
  }
  
  .poster-container {
    margin: 0 auto;
  }
}
</style>