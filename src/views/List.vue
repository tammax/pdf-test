<template>
  <div>
    <h2>PDF List</h2>
    <div>直近の３件を表示させる</div>
    <div v-for="(pdf, index) in pdfs" :key="index">
    <pdf
      :src="pdf.pdfUrl"
      @num-pages="1"
      @page-loaded="1"
      :page="1"
    ></pdf>
    <h3>タイトル:{{ pdf.description }}</h3>
    <hr>
    </div>
  </div>
</template>

<script>
import { db } from "@/config/firebase";
import pdf from "vue-pdf";

export default {
  components: {
    pdf
  },
  data() {
    return {
      pdfs: [],
      // currentPage: 1,
      // pageCount: 0,
      // src:
      //   "https://firebasestorage.googleapis.com/v0/b/pdf-test-7a1fb.appspot.com/o/%20sample2.pdf?alt=media&token=e232e689-b76b-4beb-9cec-e608d7172c0b",
      // comment: "",
      // comments: []
    };
  },
  methods: {

  },
  mounted() {
    db.collection("events")
      .orderBy("createdAt", "desc")
      .limit(3)
      .get()
      .then(data => {
        data.forEach(doc => {
          this.pdfs.push(doc.data());
        });
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }
};
</script>
