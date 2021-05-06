// import * as admin from 'firebase-admin';
// import { plugin } from 'cypress-firebase';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const admin = require('firebase-admin');
const cypressFirebasePlugin = require('cypress-firebase').plugin;

module.exports = (on, config) => {
  require('cypress-log-to-output').install(on);
  return cypressFirebasePlugin(on, config, admin);
};
