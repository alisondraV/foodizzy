import VueRouter, { NavigationGuardNext, Route, RouteConfig, Location } from 'vue-router';
import Authentication from '@/utils/Authentication';
import { CurrentFamily } from '@/types';
import { PathName } from '@/utils/enums';
import Vue from 'vue';

const { isNavigationFailure, NavigationFailureType } = VueRouter;
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: PathName.SignIn,
    name: 'SignIn',
    component: () => import('../views/SignIn.vue')
  },
  {
    path: PathName.SignUp,
    name: 'SignUp',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: PathName.StorageSetup,
    name: 'StorageSetup',
    component: () => import('../views/StorageSetup.vue')
  },
  {
    path: PathName.CreateFamily,
    name: 'CreateFamily',
    component: () => import('../views/CreateFamily.vue')
  },
  {
    path: PathName.Home,
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: PathName.Storage,
    name: 'Storage',
    component: () => import('../views/Storage.vue')
  },
  {
    path: PathName.ShoppingList,
    name: 'ShoppingList',
    component: () => import('../views/ShoppingList.vue')
  },
  {
    path: PathName.UserProfile,
    name: 'UserProfile',
    component: () => import('../views/UserProfile.vue'),
  },
  {
    path: PathName.Family,
    name: 'Family',
    component: () => import('../views/profile-settings/Family.vue')
  },
  {
    path: PathName.Invitations,
    name: 'Invitations',
    component: () => import('../views/profile-settings/Invitations.vue')
  },
  {
    path: PathName.PersonalInformation,
    name: 'PersonalInformation',
    component: () => import('../views/profile-settings/PersonalInformation.vue')
  },
  {
    path: PathName.ChangePassword,
    name: 'ChangePassword',
    component: () => import('../views/profile-settings/ChangePassword.vue')
  },
  {
    path: PathName.InviteMembers,
    name: 'InviteMembers',
    component: () => import('../views/profile-settings/InviteMembers.vue')
  },
  {
    path: PathName.QuitFamily,
    name: 'QuitFamily',
    component: () => import('../views/profile-settings/QuitFamily.vue')
  },
  {
    path: PathName.Recipes,
    name: 'Recipes',
    component: () => import('../views/Recipes.vue')
  },
  {
    path: PathName.NewProduct,
    name: 'NewProduct',
    component: () => import('../views/NewProduct.vue'),
    props: route => ({ query: route.params.location })
  },
  {
    path: PathName.CustomProduct,
    name: 'CustomProduct',
    component: () => import('../views/CustomProduct.vue'),
    props: route => ({ query: route.params.location })
  },
  {
    path: PathName.OnboardingTrackWaste,
    name: 'OnboardingTrackWaste',
    component: () => import('../views/onboarding/OnboardingTrackWaste.vue')
  },
  {
    path: PathName.OnboardingMakeLists,
    name: 'OnboardingMakeLists',
    component: () => import('../views/onboarding/OnboardingMakeLists.vue')
  },
  {
    path: PathName.OnboardingInviteMembers,
    name: 'OnboardingInviteMembers',
    component: () => import('../views/onboarding/OnboardingInviteMembers.vue')
  },
  {
    path: '*',
    name: '404',
    component: () => import('../views/404.vue')
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
        next(PathName.SignIn);
      }
    } else if (!userHasFamily) {
      if (!destinationIsOneOf(authWithoutFamilyRoutes)) {
        next(PathName.UserProfile);
      }
    } else if (destinationIsOneOf(authWithFamilyRestrictedRoutes)) {
      next(PathName.Home);
    }
    next();
  } catch (e) {
    console.error(e.message);
    next(PathName.SignIn);
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
