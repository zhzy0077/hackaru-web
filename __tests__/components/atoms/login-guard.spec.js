import { Store } from 'vuex-mock-store';
import { shallowMount } from '@vue/test-utils';
import LoginGuard from '@/components/atoms/login-guard';

describe('LoginGuard', () => {
  const $store = new Store({});
  const $router = { replace: jest.fn() };

  const factory = () =>
    shallowMount(LoginGuard, {
      mocks: {
        $store,
        $router,
        $route: { fullPath: '/secure' },
        $ga: { set: jest.fn() },
        localePath: t => t
      }
    });

  beforeEach(() => {
    sessionStorage.clear();
    $store.reset();
  });

  describe('when user is not logged-in', () => {
    beforeEach(() => {
      $store.getters['auth/isLoggedIn'] = false;
      factory();
    });

    it('redirect to login page', () => {
      expect($router.replace).toHaveBeenCalledWith('auth');
    });

    it('save current path', () => {
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'previousPath',
        '/secure'
      );
    });
  });

  describe('when user is logged-in', () => {
    beforeEach(() => {
      $store.getters['auth/isLoggedIn'] = true;
      factory();
    });

    it('does not redirect', () => {
      expect($router.replace).not.toHaveBeenCalled();
    });
  });
});
