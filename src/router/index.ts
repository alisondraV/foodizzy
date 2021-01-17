import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "SignIn",
    component: () => import("../views/SignIn.vue")
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: () => import("../views/SignUp.vue")
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home.vue")
  },
  {
    path: "/fridge",
    name: "Fridge",
    component: () => import("../views/Fridge.vue")
  },
  {
    path: "/shopping-list",
    name: "ShoppingList",
    component: () => import("../views/ShoppingList.vue")
  },
  {
    path: "/profile",
    name: "UserProfile",
    component: () => import("../views/UserProfile.vue")
  },
  {
    path: "/recipes",
    name: "Recipes",
    component: () => import("../views/Recipes.vue")
  },
  {
    path: "/new-product",
    name: "NewProduct",
    component: () => import("../views/NewProduct.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
