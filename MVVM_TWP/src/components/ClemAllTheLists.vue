<template>
  <div id="app">
    <div class="board">
      <div v-for="(category, index) in categories" :key="index" class="column" :style="{ backgroundColor: category.color }">
        <div class="column-header">{{ category.name }}</div>
          <button class="add-card-button" @click="addCard(category.id)">+ Add a card</button>
        <div class="cards" :style="{ backgroundColor: category.color }">
          <div v-for="(card, cardIndex) in category.cards" :key="cardIndex" class="card" :style="{ backgroundColor: category.color }">
            <div class="card-header">
              <div class="card-title">{{ card.title }}</div>
              <button class="delete-button" @click="deleteCard(category.id, card.id, cardIndex)">x</button>
            </div>
            <!-- <div class="card-content">{{ card.content }}</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import WPAPI from 'wpapi';


const categories = ref([]);

// color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// WPAPI
const wp = new WPAPI({
  endpoint: 'http://localhost/wordpress/index.php/wp-json/',
  username: 'clemerick',
  password: 'clemerick'
});

const fetchCategories = async () => {
  try {
    // recup des categories
    const categoriesData = await wp.categories();
    const categoriesWithCards = await Promise.all(categoriesData.map(async (category) => {
      //récup les cartes pour chaque catégorie avc WPAPI
      const cardsData = await wp.posts().categories(category.id);
      const cards = cardsData.map(card => ({
        id: card.id,
        title: card.title.rendered,
        content: card.content.rendered.replace(/<\/?p>/g, '')
      }));
      // 2 lignes color
      const color = getRandomColor();
      return { id: category.id, name: category.name, cards, color }; 
    }));
    categories.value = categoriesWithCards;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const addCard = async (categoryId) => {
  try {
    // new card
    const newCard = {
      title: 'New card'
    };
    // WPAPI pour new card
    const response = await wp.posts().create({
      title: 'newCard.title',
      content: '',
      status: "publish",
      categories: [categoryId]
    });
    if (response.id) {
      // Add new card à la liste des cartes de la catégorie
      categories.value.forEach(category => {
        if (category.id === categoryId) {
          category.cards.push({
            id: response.id,
            title: newCard.title,
            content: ''
          });
        }
      });
    } else {
      console.error('Error creating card');
    }
  } catch (error) {
    console.error('Error creating card:', error);
  }
};

const deleteCard = async (categoryId, cardId, cardIndex) => {
  try {
    const response = await wp.posts().id(cardId).delete();
    if (response) {
      categories.value.forEach(category => {
        if (category.id === categoryId) {
          category.cards.splice(cardIndex, 1);
        }
      });
    } else {
      console.error('Error deleting card');
    }
  } catch (error) {
    console.error('Error deleting card:', error); 
  }
};

onMounted(fetchCategories);

</script>

<style>
.board {
  display: flex;
  justify-content: space-around;
}

.column {
  flex: 1;
  background-color: #ebecf0;
  border-radius: 3px;
  padding: 8px;
  margin: 0 8px;
  min-width: 250px; 
}

.column-header {
  font-weight: bold;
  margin-bottom: 8px;
  /* background-color: #4e4e4e; */
  color: #fff; 
  padding: 8px;
  border-radius: 3px;
}

.cards {
  background-color: #ebecf0;
  border-radius: 3px;
  padding: 8px;
}

.card {
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  margin-bottom: 8px;
  padding: 8px;
  color: black
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
}

.card-title {
  font-weight: bold;
}

.card-content {
  margin-top: 8px;
}

.add-card-button {
  background-color: transparent;
  color: black;
  padding: 8px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-top: 8px;
  cursor: pointer;
  border-radius: 3px;
}

.add-card-button:hover {
  background-color: transparent;
}

.delete-button {
  background-color: transparent;
  color: red;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 5px 8px;
}

.delete-button:hover {
  color: red;
}

.delete-button::before {
  content: '';
  position: absolute;
  display: block;
  width: 100%;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: red;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
</style>