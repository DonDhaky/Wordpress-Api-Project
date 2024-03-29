<script setup>
import { RouterView } from "vue-router";
import ClemAllTheListsEdited from "./components/ClemAllTheListsEdited.vue";
</script>

<template>
  <header>
    <div class="wrapper">
      <div>
        <div class="lists-grid">
          <ClemAllTheListsEdited />
        </div>
      </div>
    </div>
  </header>
<!-- 
  <RouterView /> -->
</template>

<style scoped>
/* .lists-grid {
}

@media (min-width: 1024px) {
  .lists-grid {
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
} */
</style>