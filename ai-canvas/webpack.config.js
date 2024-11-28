const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
    const config = await createExpoWebpackConfigAsync({
        ...env,
        // Optionally you can turn off treeshaking to see the resulting bundle
        // babel: { dangerouslyAddModulePathsToTranspile: ["react-native-web"] },
    }, argv);

    // Check if it's a web build
    if (env.platform === 'web') {
        // Alias 'canvas' to a mock or a no-op function for web builds
        config.resolve.alias['canvas'] = 'react-native-canvas';
    }

    return config;
};
