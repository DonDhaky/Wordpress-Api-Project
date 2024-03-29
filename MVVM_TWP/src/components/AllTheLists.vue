<script setup>
import { ref, onMounted } from 'vue'
import CreateList from '../components/CreateList.vue'
import WPAPI from 'wpapi'

const categories = ref([]);

const fetchCategories = async () => {
  const wp = new WPAPI({
    endpoint: 'http://localhost/wordpress/index.php/wp-json/',
    username: 'clemerick',
    password: 'clemerick'
  });

  // afficher les listes
  await wp.categories().get()
    .then(response => {
      categories.value = response;
      console.log(categories.value);
    })
    .catch(err => {
      console.log(err);
    });
  };


const deleteList = async (categoryId) => {
  const wp = new WPAPI({
    endpoint: 'http://localhost/wordpress/index.php/wp-json/',
    username: 'clemerick',
    password: 'clemerick'
  });

    // supprimer une liste
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

const saveList = async (categoryId) => {
  const wp = new WPAPI({
    endpoint: 'http://localhost/wordpress/index.php/wp-json/',
    username: 'clemerick',
    password: 'clemerick'
  });
    // enregistrer le changement de nom d'une liste
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

</script>

<template>
  <div class="all">
    <h1 class="titre">LE TRELLO DU PAUVRE</h1>
    <br />

    <div class="notes-grid">
      <div><CreateList class="button-53" role="button" /></div>
      <div v-for="category in categories" :key="category.id" class="note">
        <div>
          <button @click="saveList(category)">Save list's name</button>
          <button @click="deleteList(category.id)">Delete the list</button>
          <input type="text" v-model="category.name" id="title" />
        </div>
      </div>
    </div>
    </div>
</template>

<style>
.content-area {
  resize: none;
  max-height: 500px;
}
label {
  color: white;
  font-size: larger;
}

.save-button,
.detail-button,
.delete-button {
  text-align: center;
  background-color: rgb(105, 93, 62);
  border: 0 solid #e5e7eb;
  box-sizing: border-box;
  color: #ffffff;
  display: flex;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  justify-content: center;
  margin-bottom: 2px;
  font-size: medium;
  width: 100%;
  max-width: 460px;
  position: relative;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.save-button,
.detail-button,
.delete-button:focus {
  outline: 0;
}

.save-button,
.detail-button,
.delete-button:after {
  content: '';
  border: 1px solid #000000;
}

.button-53 {
  text-align: center;
  margin-top: 60%;
  background-color: rgb(105, 93, 62);
  border: 0 solid #e5e7eb;
  box-sizing: border-box;
  color: #ffffff;
  display: flex;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 1rem;
  font-weight: 700;
  justify-content: center;
  line-height: 1.75rem;
  padding: 0.75rem 1.65rem;
  position: relative;
  text-align: center;
  text-decoration: none #000000 solid;
  text-decoration-thickness: auto;
  width: 100%;
  max-width: 460px;
  position: relative;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-53:focus {
  outline: 0;
}

.button-53:after {
  content: '';
  position: absolute;
  border: 1px solid #000000;
  bottom: 4px;
  left: 4px;
  width: calc(100% - 1px);
  height: calc(100% - 1px);
}

.button-53:hover:after {
  bottom: 2px;
  left: 2px;
}

@media (min-width: 768px) {
  .button-53 {
    padding: 0.75rem 3rem;
    font-size: 1.25rem;
  }
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.titre {
  text-align: center;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 50px;
  color: #fff;
  text-shadow:
    0 0 7px #fff,
    0 0 10px #fff,
    0 0 21px #fff,
    0 0 42px rgb(155, 134, 82),
    0 0 82px rgb(155, 134, 82);
}
.instrus {
  text-align: center;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}
.notes-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(200px, 1fr));
  gap: 20px;
}

.note {
  text-align: center;
  margin-top: 10%;
  background-color: rgb(105, 93, 62);
  border: 0 solid #e5e7eb;
  box-sizing: border-box;
  color: #ffffff;
  display: grid;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 1rem;
  font-weight: 700;
  justify-content: center;
  line-height: 1.75rem;
  padding: 0.75rem 1.65rem;
  position: relative;
  text-align: center;
  text-decoration: none #000000 solid;
  text-decoration-thickness: auto;
  width: 100%;
  max-width: 460px;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  border-radius: 10px;
  padding: 10px;
}

.note h3 {
  margin-top: 0;
  margin-bottom: 10px;
  text-align: center;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

.note p {
  margin-top: 0;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}
</style>
