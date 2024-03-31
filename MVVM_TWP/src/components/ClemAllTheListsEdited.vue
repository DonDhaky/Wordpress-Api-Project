


<script setup>
import { ref, onMounted } from 'vue';
import CreateList from '../components/CreateList.vue'
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
  endpoint: 'http://localhost:8888/wordpress/wp-json',
  username: 'clemerick',
  password: 'clemerick'
});

// CRUD POUR LES LISTS -------------------------------------------------------------------------------------------------------------------------------------

// afficher les lists
const fetchCategories = async () => {
  try {
    // recup des categories
    const categoriesData = await wp.categories();
    const categoriesWithCards = await Promise.all(categoriesData.map(async (category) => {
      // récup les posts dans chaque catégorie
      const cardsData = await wp.posts().categories(category.id);
      const cards = cardsData.map(card => ({
        id: card.id,
        title: card.title.rendered,
        content: card.content.rendered.replace(/<\/?p>/g, '')
      }));
      
      // 2 lignes color
      const color = getRandomColor();
      return {
        id: category.id, 
        name: category.name, 
        cards, 
        color 
      }; 
    }));

    categories.value = categoriesWithCards;
  } catch (error) {
    console.error(error);
  }
};

// supprimer une list
const deleteList = async (categoryId) => {
  const wp = new WPAPI({
    endpoint: 'http://localhost:8888/wordpress/wp-json',
    username: 'clemerick',
    password: 'clemerick'
  });
   await wp.categories().id(categoryId).delete({ force: true })
    .then(() => {
      console.log('Select category has been deleted :(');
      confirm('Your list has been successfully deleted !');
      fetchCategories();
    })
    .catch(err => {
      console.log(err);
    });
  };
  
  onMounted(() => {
  fetchCategories();
});

// save le nom d'une liste
const saveList = async (categoryId) => {
  const wp = new WPAPI({
    endpoint: 'http://localhost:8888/wordpress/wp-json',
    username: 'clemerick',
    password: 'clemerick'
  });
   await wp.categories().id(categoryId.id).update({
    name: categoryId.name,
   })
    .then(() => {
      console.log("CategoryId's name has been edited !");
      confirm("Your list's name has been edited !");
      fetchCategories();
    })
    .catch(err => {
      console.log(err);
    });
  };

// CRUD POUR LES CARDS --------------------------------------------------------------------------------------------------------------------------------------

// Add une card
const addCard = async (categoryId) => {
  try {
    const newCard = {
      title: 'New card'
    };
    const response = await wp.posts().create({
      title: 'newCard.title',
      content: '',
      status: "publish",
      categories: [categoryId]
    });
    if (response.id) {
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
    console.error(error);
  }
};

// supprimer une card
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

// edit une card
const selectedCard = ref(null);
const saveCardChanges = async () => {
  try {
    if (selectedCard.value) {
      
      const wp = new WPAPI({
        endpoint: 'http://localhost:8888/wordpress/wp-json',
        username: 'clemerick',
        password: 'clemerick'
      });
    
      await wp.posts().id(selectedCard.value.id).update({
        title: selectedCard.value.title,
        content: selectedCard.value.content.replace(/<[^>]*>/g, ''),
      });
  
      console.log("The card has been edited");
      confirm("Your card has been successfully edited ! :)");
      closeCardModal();
    } else {
      console.error('No card selected');
    }
  } catch (error) {
    console.error(error);
  }
};

// récupérer les commentaires d'une card
const fetchCommentsForCard = async (card) => {
  try {
    const commentsData = await wp.posts().id(card.id).comments();
    const comments = commentsData.map(comment => ({
      id: comment.id,
      content: comment.content.rendered
    }));
    return comments;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// ouvrir une card via un modal (pop-up) avec ses comments
const openCardModal = async (card) => {
  try {
    const comments = await fetchCommentsForCard(card);
    card.comments = comments; // add les comments à la carte
    selectedCard.value = card;
  } catch (error) {
    console.error('Error fetching comments for card:', error);
  }
};
// fermer...
const closeCardModal = () => {
  selectedCard.value = null;
};

// supprimer les balises html
// .replace(/<[^>]*>/g, '')

onMounted(fetchCategories);
</script>

<template>
  <div id="app">
    <div class="board">
      <p><CreateList class="create-list-button" role="button"/></p>
      <div v-for="(category, index) in categories" :key="index" class="column" :style="{ backgroundColor: category.color }">
        <div class="save-button-container">
          <input type="text" v-model="category.name" id="column-header" />
            <button class="save-button checkmark" @click="saveList(category)"></button>
             <button class="save-button" @click="deleteList(category.id)">x</button>
              <button class="add-card-button" @click="addCard(category.id)">+ Add a card</button>
                <div class="cards" :style="{ backgroundColor: category.color }">
                  <div v-for="(card, cardIndex) in category.cards" :key="cardIndex" class="card" :style="{ backgroundColor: category.color }">
                    <div class="card-header">
                     <div class="card-title">{{ card.title }}</div> 
                      <button @click="openCardModal(card)" class="see-button">👁</button>
                      <!-- AJOUTER TOUTE LA CARTE EN DEROULANT AU CLICK DU BOUTON ET LA RENDRE MODIFIABLE DIRECTEMENT ??? -->
                        <button class="delete-button" @click="deleteCard(category.id, card.id, cardIndex)">x</button>
            
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
    <!-- CECI EST UN ELEMENT MODAL, EQUIVALENT D'UN POP UP QUI AFFICHE LE CONTENU D'UNE CARD ET SES COMMENTAIRES -->
    <Modal v-if="selectedCard" @close="closeCardModal">
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <button @click="closeCardModal" class="close-button">X</button>
          </div>
          <div class="modal-body">
            <div v-if="selectedCard">
              <input class="modalcardname" type="text" v-model="selectedCard.title"/><br/><br/>
              <h5>Description :</h5>
              <textarea rows="8" cols="30" type="text" v-model="selectedCard.content"></textarea><br/>
              <button @click="saveCardChanges" class="save-button">Save changes</button><br/><br/>
              <h5>Comments :</h5>
                <div v-for="(comment, index) in selectedCard.comments" :key="index">
                  <input type="text" v-model="comment.content"/>
                </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style>


.checkmark::before {
  content: '✓';
}
.save-button-container {
  position: relative;
}

.save-button {
  position: relative;
  bottom: -10px;
  left: 5px; 
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  color: black;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.modalcardname {
  /* style à ajouter */
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.modal-body {
  /* Style du corps du modal */
}

/* Style pour les grandes résolutions */
.board {
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 2%;
}

.column {
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
#column-header {
  width: 80%;
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

.create-list-button {
  background-color: goldenrod;
  color: black;
  padding: 8px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 150%;
  cursor: pointer;
  border-radius: 3px;
  margin-top: 35%;
  margin-left: 25%;
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

.see-button {
  position : absolute;
  background-color: transparent;
  color: black;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 5px 8px;
  margin-left: 63%;
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

/* Media queries responsive à partir de 500 pixels */
@media screen and (max-width: 500px) {
  .board {
    grid-template-columns: repeat(1, auto);
    gap: 5%;
  }

  .column {
    margin: 0 auto 20px;
    min-width: calc(100% - 16px);
  }

  .add-card-button {
    margin-top: 0;
    margin-bottom: 8px;
    width: 100%;
  }

  .create-list-button {
    margin-top: 15%;
    margin-left: 0;
    width: 100%;
    font-size: 120%;
  }
}


</style>