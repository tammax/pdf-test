<template>
  <div id="hoge">
    <h2>PDF CUSTOM UPLOAD</h2>
    <section style="margin: 10px;">
      <progress-bar :val="progressVal"></progress-bar>

      <div id="saga">
   <div>
     <quill-editor v-model="content" ref="quillEditor"
                   :options="editorOption"></quill-editor >
  </div>
  <div id="preview" class="content ql-editor" v-html="content"></div>
      </div>
      <br><br><br><br><br><br><br>

      <file-pond
        name="test"
        ref="pond"
        :label-idle="label"
        accepted-file-types="application/pdf"
        v-bind:files="myFiles"
        :disabled="canUpload"
      />
      <button @click="upload">登録</button>
    </section>
  </div>
</template>

<script>
import { db, storage } from "@/config/firebase";

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

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

// プラグインの追加
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
      progressVal: 0,
      label: labelIdle,
      canUpload: false,
      content: 'Hellow contents',
      editorOption: {
        theme: 'snow'
      }
    };
  },
  components: {
    FilePond,
    ProgressBar,
    quillEditor
  },
  watch: {
    '$refs': {
      handler: function (val, oldVal) {
        // console.log('watch 1', 'newval: ', val, '   oldVal:', oldVal)
        alert(val, oldVal);
      },
      deep: true
    }
  },
  methods: {
    init() {
      this.progressVal = 0;
      this.myFiles = [];
      this.label = labelIdle;
      this.content = "";
      this.canUpload = false;
    },
    upload() {
      if (!this.$refs.pond.getFile() || !this.description) {
        alert("必須項目エラー");
        return false;
      }

      let uploadFile = this.$refs.pond.getFile().file;
      console.log(uploadFile.name);
      // ストレージオブジェクト作成
      let storageRef = storage.ref();
      // ファイルのパスを設定
      // let mountainsRef = storageRef.child(`images/${this.photo.name}`);
      let mountainsRef = storageRef.child(`pdfs/${uploadFile.name}`);
      // ファイルを適用してファイルアップロード開始
      let uploadTask = mountainsRef.put(uploadFile);
      // ステータスを監視
      uploadTask.on(
        "state_changed",
        snapshot => {
          console.log(snapshot);
          // let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 85;
          this.progressVal = progress;

          console.log("Upload is " + progress + "% done");
          console.log(snapshot.state);
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
    this.init();
  },
  destroyed() {
    this.init();
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