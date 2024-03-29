<script setup>
import { ref, onMounted, reactive } from 'vue'
import WPAPI from 'wpapi';

const categories = reactive([]);

const fetchLists = async () => {
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

const addList = async () => {
  const wp = new WPAPI({
    endpoint: 'http://localhost/wordpress/index.php/wp-json/',
    username: 'clemerick',
    password: 'clemerick'
  });

    function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];
    return item;
    }    
    var defaultName = ['A LIST', 'A NEW LIST', 'ONE LITTLE LIST', 'YOUR LIST', 'YOUR NEW LIST', 'A BIG LIST', 'LIST', 'ONE BIG LIST', 'A LITTLE LIST', 'A LIL LIST', 'ONE LIL LIST', 'YOUR BIG LIST', 'YOUR LIL LIST', 'YOUR LITLE LIST']; // nom random pour chaque liste
    const randomName = getRandomItem(defaultName);

// ajouter une liste
    await wp.categories().create({
// ajouter un name à la liste, c'est le seul paramètre nécessaire
     name: randomName,
})
  .then(() => {
      console.log('Your category has been created');
      confirm('Your list has been successfully created ! :)');
      location.reload(true);
  })
  .catch(err => {
      console.log(err);
  });
  };

  onMounted(() => {
  fetchLists();
});
</script>

<template>
  <div @click="addList">Add a list</div>
</template>

<style></style>
