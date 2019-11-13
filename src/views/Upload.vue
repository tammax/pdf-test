<template>
  <div>
    <h2>PDF UPLOAD</h2>
    <button @click="upload">Upload</button>
    <div class="center">Firebaseストレージ</div>
    <section style="margin: 10px;">
      <input type="file" name="photo" @change="fileChange" accept="application/pdf" />
      <input type="text" v-model="description" />
      <button @click="upload">アップロード</button>
      <div v-if="photo_url">
        <div class="center">
          <img :src="photo_url" width="80%" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { db, storage } from "@/config/firebase";

export default {
  name: "upload",
  data() {
    return {
      description: "",
      photo: null,
      photo_url: null
    };
  },
  methods: {
    fileChange: function(e) {
      this.photo = e.target.files[0];
    },
    upload() {
      // ストレージオブジェクト作成
      var storageRef = storage.ref();
      // ファイルのパスを設定
      // var mountainsRef = storageRef.child(`images/${this.photo.name}`);
      var mountainsRef = storageRef.child(`pdfs/${this.photo.name}`);
      // ファイルを適用してファイルアップロード開始
      var uploadTask = mountainsRef.put(this.photo);
      // ステータスを監視
      uploadTask.on(
        "state_changed",
        function(snapshot) {
          // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        function(err) {
          alert(err);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            // DB登録
            alert(this.description);
            db.collection("events")
              .add({
                pdfUrl: downloadURL,
                description: this.description,
                createdAt: new Date()
              })
              .then(function({ id }) {
                alert(`document writing sucess: id ${id}`);
              })
              .catch(function(error) {
                alert("Error writing document: ", error);
              });
          });
        }
      );
    }
  }
};
</script>
