define({
	tunnel: 'NullTunnel',
	tunnelOptions: {
		hostname: 'localhost',
		port: '4444'
	},
	maxConcurrency: 1,
	environments: [
		{ browserName: 'chrome' }
	],

	loaderOptions: {
		isDebug: true,
		packages: [
			{ name: 'js', location: 'js' }
		]
	},

	suites: [ 'tests/unit/all' ],
	functionalSuites: [  'tests/functional/all' ],
	excludeInstrumentation: /^(?:tests|node_modules)\//
});
