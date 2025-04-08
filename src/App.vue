<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const genres = ref([
  { name: 'Все фильмы', value: '' },
  { name: 'Комедия', value: 'комедия' },
  { name: 'Драма', value: 'драма' },
  { name: 'Боевик', value: 'боевик' },
  { name: 'Фантастика', value: 'фантастика' },
  { name: 'Триллер', value: 'триллер' },
  { name: 'Ужасы', value: 'ужасы' },
  { name: 'Мультфильм', value: 'мультфильм' },
  { name: 'Детектив', value: 'детектив' },
  { name: 'Мелодрама', value: 'мелодрама' }
])

const activeGenre = ref('')
</script>

<template>
  <div class="main">
    <nav>
      <RouterLink 
        v-for="genre in genres" 
        :key="genre.value"
        class="genre-link"
        :class="{ active: activeGenre === genre.value }"
        :to="`/?genre=${genre.value}`"
        @click="activeGenre = genre.value"
      >
        {{ genre.name }}
      </RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
}

nav {
  background: linear-gradient(135deg, #2c3e50, #4a148c);
  height: 100vh;
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 20px;
  box-shadow: 3px 0px 15px rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
}

.genre-link {
  color: #ffffff;
  text-decoration: none;
  font-size: 1em;
  margin: 10px 0;
  padding: 10px 20px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
  width: 80%;
  text-align: center;
}

.genre-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.genre-link.active {
  background: linear-gradient(135deg, #512da8, #304ffe);
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
}

main {
  width: calc(100% - 250px);
  margin-left: 250px;
  padding: 20px;
  background: linear-gradient(135deg, #1e1e30, #3a0ca3);
  min-height: 100vh;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>