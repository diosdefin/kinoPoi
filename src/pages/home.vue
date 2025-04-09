<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const API_KEY = '0J9YYFC-APA4FT2-G9K40HE-34JWBNM'
const movies = ref([])
const isLoading = ref(true)
const error = ref(null)
const router = useRouter()
const route = useRoute()

const fetchMovies = async (genre = '') => {
  try {
    isLoading.value = true
    let url = 'https://api.kinopoisk.dev/v1.4/movie?page=1&limit=20&rating.kp=7-10'
    
    if (genre) {
      url += `&genres.name=${encodeURIComponent(genre)}`
    }

    const response = await fetch(url, {
      headers: {
        'X-API-KEY': API_KEY
      }
    })
    if (!response.ok) throw new Error('Ошибка загрузки данных')
    const data = await response.json()
    movies.value = data.docs
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

const showMovieDetails = (movie) => {
  router.push({
    path: '/about',
    query: { id: movie.id }
  })
}

onMounted(() => {
  fetchMovies(route.query.genre)
})

watch(() => route.query.genre, (newGenre) => {
  fetchMovies(newGenre)
})
</script>

<template>
  <div class="home">
    <h1 v-if="!route.query.genre">Популярные фильмы</h1>
    <h1 v-else>Фильмы в жанре: {{ route.query.genre }}</h1>
    
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка данных...</p>
    </div>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
    
    <div class="movies-grid" v-if="!isLoading && !error">
      <div 
        v-for="movie in movies" 
        :key="movie.id" 
        class="movie-card"
        @click="showMovieDetails(movie)"
      >
        <div class="movie-poster">
          <img 
            v-if="movie.poster && movie.poster.url" 
            :src="movie.poster.url" 
            :alt="movie.name"
          >
          <div v-else class="no-poster">Нет изображения</div>
        </div>
        <div class="movie-info">
          <h3>{{ movie.name || 'Без названия' }}</h3>
          <p>{{ movie.year }}, {{ movie.movieLength }} мин</p>
          <div class="genres" v-if="movie.genres">
            <span v-for="genre in movie.genres.slice(0, 2)" :key="genre.name" class="genre-tag">
              {{ genre.name }}
            </span>
          </div>
          <div class="rating">
            <span>Рейтинг: {{ movie.rating?.kp?.toFixed(1) || 'Н/Д' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
  color: #e0e0e0;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
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

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 10px;
}

.movie-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.movie-poster {
  height: 300px;
  overflow: hidden;
}

.movie-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.movie-card:hover .movie-poster img {
  transform: scale(1.05);
}

.no-poster {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2c3e50;
  color: #bdc3c7;
}

.movie-info {
  padding: 15px;
}

.movie-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-info p {
  margin: 5px 0;
  font-size: 0.9em;
  color: #bdc3c7;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 10px 0;
}

.genre-tag {
  background: rgba(81, 45, 168, 0.5);
  padding: 3px 8px;
  border-radius: 15px;
  font-size: 0.7em;
}

.rating {
  margin-top: 10px;
  font-weight: bold;
  color: #f1c40f;
}
</style>