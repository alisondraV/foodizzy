import {
  initializeAdminApp,
  initializeTestApp,
  useEmulators
} from '@firebase/rules-unit-testing';

useEmulators({
  firestore: {
    host: 'localhost',
    port: 8888
  }
});

const testApp = initializeTestApp({
  projectId: 'my-test-project',
  auth: { uid: 'alice', email: 'alice@example.com' }
});

const adminApp = initializeAdminApp({ projectId: 'my-test-project' });

describe('Firestore', () => {
  it('runs', () => {
    expect(true).toBeTruthy();
  });
});
