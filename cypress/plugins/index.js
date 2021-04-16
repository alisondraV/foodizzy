// import * as admin from 'firebase-admin';
// import { plugin } from 'cypress-firebase';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const admin = require('firebase-admin');
const cypressFirebasePlugin = require('cypress-firebase').plugin;

module.exports = (on, config) => {
  return cypressFirebasePlugin(on, config, admin);
};
