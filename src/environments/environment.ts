import { NgxLoggerLevel } from 'ngx-logger';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  logLevel: NgxLoggerLevel.TRACE,
  serverLogLevel: NgxLoggerLevel.OFF,
  firebase: {
    projectId: 'fificard-staging',
    appId: '1:536378676158:web:758439956a634973215fef',
    databaseURL: 'https://fificard-staging-default-rtdb.firebaseio.com',
    storageBucket: 'fificard-staging.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyD-M5TcXBiZel7mlv8sK9J6qdAdACQIiZE',
    authDomain: 'fificard-staging.firebaseapp.com',
    messagingSenderId: '536378676158',
  }
};
