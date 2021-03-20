import { CurrentFamily } from '@/types';
import Authentication from '@/utils/Authentication';
import Vue from 'vue';
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from 'vue-router';
const { isNavigationFailure, NavigationFailureType } = VueRouter;

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/sign-in',
    name: 'SignIn',
    component: () => import('../views/SignIn.vue')
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/fridge-setup',
    name: 'FridgeSetup',
    component: () => import('../views/FridgeSetup.vue')
  },
  {
    path: '/create-family',
    name: 'CreateFamily',
    component: () => import('../views/CreateFamily.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/fridge',
    name: 'Fridge',
    component: () => import('../views/Fridge.vue')
  },
  {
    path: '/shopping-list',
    name: 'ShoppingList',
    component: () => import('../views/ShoppingList.vue')
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: () => import('../views/UserProfile.vue')
  },
  {
    path: '/family',
    name: 'Family',
    component: () => import('../views/profile-settings/Family.vue')
  },
  {
    path: '/invitations',
    name: 'Invitations',
    component: () => import('../views/profile-settings/Invitations.vue')
  },
  {
    path: '/personal-info',
    name: 'PersonalInformation',
    component: () => import('../views/profile-settings/PersonalInformation.vue')
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: () => import('../views/profile-settings/ChangePassword.vue')
  },
  {
    path: '/invite-members',
    name: 'InviteMembers',
    component: () => import('../views/profile-settings/InviteMembers.vue')
  },
  {
    path: '/quit-family',
    name: 'QuitFamily',
    component: () => import('../views/profile-settings/QuitFamily.vue')
  },
  {
    path: '/recipes',
    name: 'Recipes',
    component: () => import('../views/Recipes.vue')
  },
  {
    path: '/new-product',
    name: 'NewProduct',
    component: () => import('../views/NewProduct.vue'),
    props: route => ({ query: route.params.location })
  },
  {
    path: '/custom-product',
    name: 'CustomProduct',
    component: () => import('../views/CustomProduct.vue'),
    props: route => ({ query: route.params.location })
  },
  {
    path: '*',
    name: '404',
    component: () => import('../views/404.vue')
  },
  {
    path: '/onboarding-track-waste',
    name: 'OnboardingTrackWaste',
    component: () => import('../views/onboarding/OnboardingTrackWaste.vue')
  },
  {
    path: '/onboarding-shopping-lists',
    name: 'OnboardingShoppingLists',
    component: () => import('../views/onboarding/OnboardingShoppingLists.vue')
  },
  {
    path: '/onboarding-family-members',
    name: 'OnboardingFamilyMembers',
    component: () => import('../views/onboarding/OnboardingFamilyMembers.vue')
  }
];

type ExtendedRouter = VueRouter & {
  safePush?;
  safeReplace?;
};

const router: ExtendedRouter = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to: Route, from: Route, next: NavigationGuardNext<Vue>) => {
  try {
    const user = await Authentication.instance.getCurrentUser();
    const userLoggedIn = user != null;
    let userHasFamily = false;
    if (userLoggedIn) {
      userHasFamily = await CurrentFamily.instance.existsFor(user!);
    }
    const anonymousRoutes = ['SignIn', 'SignUp', 'Invitations'];
    const authWithoutFamilyRoutes = [
      'SignIn',
      'SignUp',
      'Family',
      'Invitations',
      'UserProfile',
      'CreateFamily',
      'ChangePassword',
      'PersonalInformation',
      'OnboardingTrackWaste',
      'OnboardingShoppingLists',
      'OnboardingFamilyMembers',
    ];
    const authWithFamilyRestrictedRoutes = ['SignIn', 'SignUp', 'CreateFamily'];

    const destinationIsOneOf = routes => routes.some(routeName => to.name === routeName);

    if (!userLoggedIn) {
      if (!destinationIsOneOf(anonymousRoutes)) {
        next('/sign-in');
      }
    } else if (!userHasFamily) {
      if (!destinationIsOneOf(authWithoutFamilyRoutes)) {
        next('/profile');
      }
    } else if (destinationIsOneOf(authWithFamilyRestrictedRoutes)) {
      next('/');
    }
    next();
  } catch (e) {
    console.error(e.message);
    next('sign-in');
  }
});

function handleError(error) {
  if (isNavigationFailure(error, NavigationFailureType.redirected)) {
    console.warn('Router Error: You do not have access to this page');
  } else {
    console.error(`Router Error: An error occured during navigation: ${error.message}`);
  }
}

router.safePush = async params => {
  return router.push(params).catch(handleError);
};

router.safeReplace = async params => {
  return router.replace(params).catch(handleError);
};

export default router;
