import { CurrentFamily } from "@/types";
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
    path: "/fridge-setup",
    name: "FridgeSetup",
    component: () => import("../views/FridgeSetup.vue")
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
    component: () => import("../views/NewFamilyMembers.vue")
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
    path: "/invites",
    name: "Invites",
    component: () => import("../views/Invites.vue")
  },
  {
    path: "*",
    name: "404",
    component: () => import("../views/404.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

function getRedirectRoute(
  isLoggedIn: boolean,
  hasFamily: boolean,
  destinationName: string
): string | null {
  const anonymousRoutes = ["SignIn", "SignUp", "Invites"];
  const authWithoutFamilyRoutes = [
    "SignIn",
    "SignUp",
    "Invites",
    "NewFamily",
    "UserProfile"
  ];

  const destinationIsOneOf = routes =>
    routes.some(routeName => destinationName === routeName);

  if (!isLoggedIn) {
    if (!destinationIsOneOf(anonymousRoutes)) {
      return "/sign-in";
    }
  } else if (!hasFamily) {
    if (!destinationIsOneOf(authWithoutFamilyRoutes)) {
      return "/profile";
    }
  }

  return null;
}

router.beforeEach(
  async (to: Route, from: Route, next: NavigationGuardNext<Vue>) => {
    try {
      const user = await Authentication.instance.getCurrentUser();
      const userLoggedIn = user != null;
      let userHasFamily = false;
      if (userLoggedIn) {
        userHasFamily = await CurrentFamily.instance.existsFor(user!);
      }

      const redirectRoute = getRedirectRoute(
        userLoggedIn,
        userHasFamily,
        to.name ?? ""
      );

      if (redirectRoute) {
        next(redirectRoute);
      } else {
        next();
      }
    } catch (e) {
      console.error(e.message);
      next("sign-in");
    }
  }
);

export default router;
