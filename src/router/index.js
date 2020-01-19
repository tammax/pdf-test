import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Upload from "../views/Upload.vue";
import CustomUpload from "../views/CustomUpload.vue";
import List from "../views/List.vue";
import Posts from "../views/Posts.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/upload",
    name: "upload",
    component: Upload
  },
  {
    path: "/cupload",
    component: CustomUpload
  },
  {
    path: "/list",
    component: List
  },
  {
    path: "/posts",
    component: Posts
  }
];

const router = new VueRouter({
  routes
});

export default router;
