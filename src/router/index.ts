import Authentication from "@/utils/Authentication";
import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/sign-in",
    name: "SignIn",
    component: () => import("../views/SignIn.vue")
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: () => import("../views/SignUp.vue")
  },
  {
    path: "/create-family",
    name: "NewFamily",
    component: () => import("../views/NewFamily.vue")
  },
  {
    path: "/",
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
    path: "/family",
    name: "Family",
    component: () => import("../views/Family.vue")
  },
  {
    path: "/new-family-members",
    name: "NewFamilyMembers",
    component: () => import("../views/NewFamilyMembers.vue"),
  },
  {
    path: "/recipes",
    name: "Recipes",
    component: () => import("../views/Recipes.vue")
  },
  {
    path: "/new-product",
    name: "NewProduct",
    component: () => import("../views/NewProduct.vue"),
    props: route => ({ query: route.params.location })
  },
  {
    path: "/custom-product",
    name: "CustomProduct",
    component: () => import("../views/CustomProduct.vue"),
    props: route => ({ query: route.params.location })
  },
  {
    path: "/accept-invite",
    name: "AcceptInvite",
    component: () => import("../views/AcceptInvite.vue"),
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(
  async (to: Route, from: Route, next: NavigationGuardNext<Vue>) => {
    try {
      console.log("getting user info...");

      const user = await Authentication.instance.getCurrentUser();
      if (to.name === "SignIn" || to.name === "SignUp" || user !== null) {
        next();
      } else {
        next("/sign-in");
      }
    } catch (e) {
      console.error(e.message);
      next("sign-in");
    }
  }
);

export default router;
