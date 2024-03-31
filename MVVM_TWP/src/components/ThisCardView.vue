<script setup>
import { ref, onMounted } from 'vue';
import WPAPI from 'wpapi';

// WPAPI
const wp = new WPAPI({
  endpoint: 'http://localhost:8888/wordpress/wp-json',
  username: 'clemerick',
  password: 'clemerick'
});

const posts = ref([]);

const fetchPosts = async () => {
  try {
    const allPosts = await wp.posts();
    
    // Pour chaque post, récupérez les commentaires
    for (const onePost of allPosts) {
      const allComments = await wp.comments().post(onePost.id);
      const comments = allComments.map(comment => ({
        id: comment.id,
        content: comment.content.rendered.replace(/<\/?p>/g, '')
      }));
      
      // Ajoutez un post avec ses comments aux posts
      posts.value.push({
        id: onePost.id,
        title: onePost.title.rendered,
        content: onePost.content.rendered.replace(/<\/?p>/g, ''),
        comments: comments
      });
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchPosts();
});
</script>

<template>

    <div v-for="post in posts" :key="post.id" class="card-informations">
      <div>
         <h2 class="post-title">{{ post.title }}</h2>
         <p class="post-content">{{ post.content }}</p>
         <ul>
           <li class="comments" v-for="comment in post.comments" :key="comment.id">- {{ comment.content }}</li>
         </ul>
      </div>
    </div>

</template>

<style>
.card-informations {
  color: black;
  margin-bottom: 20px;
  margin-left: 20px;
  background-color: #f9f9f9;
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.post-title {
  color: black;
  font-size: 30px;
  margin-bottom: 10px;
}

.post-content {
  color: black;
  margin-bottom: 15px;
}

.comments {
  color: black;
  list-style: none;
  margin-left: 0;
}

.comments li {
  color: black;
  margin-bottom: 5px;
}
</style>