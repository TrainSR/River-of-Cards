window.configs = {
    apiUrl: '/choreo-apis/river-of-cards/backend/v1',
};
// sample JavaScript code snippet
const apiUrl = window?.configs?.apiUrl ? window.configs.apiUrl : "/";

// sample JavaScript code snippet
// Provide the correct resource path
const response = await axios.get(apiUrl/{RESOURCE_PATH});
