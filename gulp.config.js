module.exports = function () {
	var config = {
		
		//all js to vet
		alljs: [
			'./script.js',
			'./gulpfile.js'
		],
		
		/**
		 * browser sync
		 */
		browserReloadDelay: 5000
	};

	return config;
};