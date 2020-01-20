<template>
  <div class="posts">
    <h2>posts</h2>
    <div v-for="(post, index) in posts" :key="index">
      <div class="card">
        <h3>{{ post.title }}</h3>
        <p>{{ post.body }}</p>
      </div>
    </div>
  </div>
</template>

<script>
    // import { db } from "@/config/firebase";
    // import pdf from "vue-pdf";

    export default {
        components: {},
        data() {
            return {
                posts: [
                    {
                        title: 'タイトル',
                        body: '本文'
                    },
                    {
                        title: 'タイトル',
                        body: '本文'
                    },
                    {
                        title: 'タイトル',
                        body: '本文'
                    },
                    {
                        title: 'タイトル',
                        body: '本文'
                    },
                ]
            };
        },
        methods: {},
        mounted() {
        }
    };
</script>
<style scoped>
  .posts {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .card {
    position: relative;
    border: 1px solid #000000;
    border-radius: 4px;
    margin: 2rem;
    text-align: left;
    padding: 1rem;
  }
</style>
