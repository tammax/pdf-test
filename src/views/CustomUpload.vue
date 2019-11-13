<template>
  <div id="hoge">
    <h2>PDF CUSTOM UPLOAD</h2>
    <section style="margin: 10px;">
      <progress-bar :val="progressVal"></progress-bar>

      <div id="saga">
        <input type="text" v-model="description" placeholder="タイトルを入力してね" />
      </div>

      <file-pond
        name="test"
        ref="pond"
        :label-idle="label"
        accepted-file-types="application/pdf"
        v-bind:files="myFiles"
        instantUpload="instantUpload"
        :disabled="canUpload"
      />
      <button @click="upload">登録</button>
    </section>
  </div>
</template>

<script>
import { db, storage } from "@/config/firebase";
import ProgressBar from "vue-simple-progress";

// Import Vue FilePond
import vueFilePond from "vue-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import FilePond plugins
// Please note that you need to install these plugins separately

// Import image preview plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

const labelIdle = "<span class='filepond--label-action'>ファイルを選択してください</span>";
const labelComplete = "ファイルのアップロードに成功しました<br>アップロード成功後はイベントIDをコピーするページに切り替える予定";

export default {
  name: "CustomUpload",
  data() {
    return {
      myFiles: [],
      description: "",
      photo: null,
      photo_url: null,
      instantUpload: false,
      progressVal: 0,
      label: labelIdle,
      canUpload: false
    };
  },
  components: {
    FilePond,
    ProgressBar
  },
  methods: {
    upload() {
      if (!this.$refs.pond.getFile() || !this.description) {
        alert("必須項目エラー");
        return false;
      }

      let uploadFile = this.$refs.pond.getFile().file;
      console.log(uploadFile.name);
      // ストレージオブジェクト作成
      var storageRef = storage.ref();
      // ファイルのパスを設定
      // var mountainsRef = storageRef.child(`images/${this.photo.name}`);
      var mountainsRef = storageRef.child(`pdfs/${uploadFile.name}`);
      // ファイルを適用してファイルアップロード開始
      var uploadTask = mountainsRef.put(uploadFile);
      // ステータスを監視
      uploadTask.on(
        "state_changed",
        snapshot => {
          console.log(snapshot);
          // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 95;
          this.progressVal = progress;

          console.log("Upload is " + progress + "% done");
          console.log(snapshot.state);
          // switch (snapshot.state) {
          //   case storage.TaskState.PAUSED: // or 'paused'
          //     console.log('Upload is paused');
          //     break;
          //   case storage.TaskState.RUNNING: // or 'running'
          //     console.log('Upload is running');
          //     break;
          // }
        },
        err => {
          console.log(err);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log("File available at", downloadURL);
            // DB登録
            db.collection("events")
              .add({
                pdfUrl: downloadURL,
                description: this.description,
                createdAt: new Date()
              })
              .then(({ id }) => {
                this.progressVal = 100;
                this.myFiles = [];
                this.label = labelComplete;
                this.canUpload = true;
                console.log(`document writing sucess: id ${id}`);
                // reset
                // this.myFiles = [];
                // resolve(id);
              })
              .catch(error => {
                console.error("Error writing document: ", error);
              });
          });
        }
      );
    },
  },
  mounted() {



    //   db.collection("events")
    // // .orderBy("score", "desc")
    // .limit(3)
    // .get()
    // .then(data => {
    //   data.forEach(doc => {
    //     this.rankings.push(doc.data());
    //   });
    // })
    // .catch(function(error) {
    //   console.log("Error getting document:", error);
    // });
  },
  destroyed() {
    this.progressVal = 0;
    this.myFiles = [];
    this.label = labelIdle;
    this.description = "";
    this.canUpload = false;
  }
};
</script>

<style scoped lang="scss">
#hoge {
  max-width: 600px;
  margin: 0 auto;
}

#saga {
  height: 35px;
  padding: 20px 0;
  color: rgba(0, 0, 0, 0.87);
  input {
    width: 98%;
    font-size: 22px;
  }
}

button {
  background-color: #2185d0;
  color: #fff;
  text-shadow: none;
  background-image: none;
  height: 35px;
  padding: 20px 0;
  width: 99%;
  font-size: 22px;
  line-height: 5px;
  &.inactive{
    background-color: #cccccc;
    color: #222222;
  }
}
</style>