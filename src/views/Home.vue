<template>
  <div>
    {{ currentPage }} / {{ pageCount }}
    <pdf
      :src="src"
      @num-pages="pageCount = $event"
      @page-loaded="currentPage = $event"
      :page="currentPage"
    ></pdf>
    <button @click="nextPage">next</button>
    <button @click="prevPage">prev</button>
    <ul>
      <input type="text" v-model="comment" />
      <button @click="addComment">投稿</button>
      <li v-for="(comment, index) in comments" :key="index">
        <div>{{ comment.name }}:{{ comment.text }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import pdf from "vue-pdf";

export default {
  components: {
    pdf
  },
  data() {
    return {
      currentPage: 1,
      pageCount: 0,
      src:
        "https://firebasestorage.googleapis.com/v0/b/pdf-test-7a1fb.appspot.com/o/%20sample2.pdf?alt=media&token=e232e689-b76b-4beb-9cec-e608d7172c0b",
      comment: "",
      comments: []
    };
  },
  methods: {
    nextPage() {
      this.currentPage++;
      this.page++;
    },
    prevPage() {
      this.currentPage--;
      this.page--;
    },
    addComment() {
      if (this.comment !== "") {
        let addComment = {
          name: "匿名",
          text: `投稿したページ数:${this.currentPage}ページ:${this.comment}`,
          createdAt: ""
        };
        this.comments.push(addComment);
        this.comment = "";
      }
    }
  },
  mounted() {
    let addComment = {
      name: "匿名",
      text: `投稿したページ数:${this.currentPage}: 最初のコメント`,
      createdAt: ""
    };
    this.comments.push(addComment);
  }
};
</script>
