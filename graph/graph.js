var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

module.exports = {
  getUserDetails: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client
      .api('/me')
      .select('displayName,userPrincipalName')
      .get();
    return user;
  },
};

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate requests

    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  return client;
}