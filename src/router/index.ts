import VueRouter, { NavigationGuardNext, RawLocation, Route, RouteConfig, Location } from 'vue-router';
import Authentication from '@/utils/Authentication';
import { CurrentFamily } from '@/types';
import Vue from 'vue';

const { isNavigationFailure, NavigationFailureType } = VueRouter;
Vue.use(VueRouter);

export type PathName =
  | '/sign-in'
  | '/sign-up'
  | '/storage-setup'
  | '/create-family'
  | '/'
  | '/storage'
  | '/shopping-list'
  | '/profile'
  | '/profile/family'
  | '/profile/invitations'
  | '/profile/personal-info'
  | '/profile/change-password'
  | '/invite-members'
  | '/quit-family'
  | '/recipes'
  | '/new-product'
  | '/custom-product'
  | '/onboarding/track-waste'
  | '/onboarding/make-lists'
  | '/onboarding/invite-members';

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
    path: '/storage-setup',
    name: 'StorageSetup',
    component: () => import('../views/StorageSetup.vue')
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
    path: '/storage',
    name: 'Storage',
    component: () => import('../views/Storage.vue')
  },
  {
    path: '/shopping-list',
    name: 'ShoppingList',
    component: () => import('../views/ShoppingList.vue')
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: () => import('../views/UserProfile.vue'),
  },
  {
    path: '/profile/family',
    name: 'Family',
    component: () => import('../views/profile-settings/Family.vue')
  },
  {
    path: '/profile/invitations',
    name: 'Invitations',
    component: () => import('../views/profile-settings/Invitations.vue')
  },
  {
    path: '/profile/personal-info',
    name: 'PersonalInformation',
    component: () => import('../views/profile-settings/PersonalInformation.vue')
  },
  {
    path: '/profile/change-password',
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
    path: '/onboarding/track-waste',
    name: 'OnboardingTrackWaste',
    component: () => import('../views/onboarding/OnboardingTrackWaste.vue')
  },
  {
    path: '/onboarding/make-lists',
    name: 'OnboardingMakeLists',
    component: () => import('../views/onboarding/OnboardingMakeLists.vue')
  },
  {
    path: '/onboarding/invite-members',
    name: 'OnboardingInviteMembers',
    component: () => import('../views/onboarding/OnboardingInviteMembers.vue')
  }
];

type ExtendedRouter = VueRouter & {
  safePush?(location: Location | PathName): Promise<void | Route>;
  safeReplace?(location: Location | PathName): Promise<void | Route>;
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
      'OnboardingMakeLists',
      'OnboardingInviteMembers'
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

router.safePush = async (location: Location | PathName) => {
  return router.push(location).catch(handleError);
};

router.safeReplace = async (location: Location | PathName) => {
  return router.replace(location).catch(handleError);
};

export default router;
