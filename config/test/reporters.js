const {SpecReporter} = require('jasmine-spec-reporter');

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
  spec: {
    displayErrorMessages: true,
    displayStacktrace: true,
    displaySuccessful: true,
    displayFailed: true,
    displayPending: true,
    displayDuration: true,
  },
  summary: {
    displayErrorMessages: false,
    displayStacktrace: false,
    displaySuccessful: false,
    displayFailed: false,
    displayPending: false,
    displayDuration: false,
  },
  colors: {
    enabled: true,
    successful: 'green',
    failed: 'red',
    pending: 'yellow',
  },
}));
