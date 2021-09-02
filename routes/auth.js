var graph = require('../graph/graph');
var router = require('express-promise-router')();

/* GET auth callback. */
router.get('/signin',
    async function (req, res) {
        const urlParameters = {
            scopes: process.env.OAUTH_SCOPES.split(','),
            redirectUri: process.env.OAUTH_REDIRECT_URI
        };

        try {
            const authUrl = await req.app.locals
                .msalClient.getAuthCodeUrl(urlParameters);
            res.redirect(authUrl);
        }
        catch (error) {
            //console.log(`Error: ${error}`);
            req.flash('error_msg', {
                message: 'Error getting auth URL',
                debug: JSON.stringify(error, Object.getOwnPropertyNames(error))
            });
            res.redirect('/');
        }
    }
);

router.get('/callback',
    async function(req, res) {
        const tokenRequest = {
            code: req.query.code,
            scopes: process.env.OAUTH_SCOPES.split(','),
            redirectUri: process.env.OAUTH_REDIRECT_URI
        };

        try {
            const response = await req.app.locals
                .msalClient.acquireTokenByCode(tokenRequest);

            // Save the user's homeAccountId in their session
            req.session.userId = response.account.homeAccountId;

            const user = await graph.getUserDetails(response.accessToken);

            // Add the user to user storage
            req.app.locals.users[req.session.userId] = {
                displayName: user.displayName,
                email: user.userPrincipalName
            };
            //console.log('User: '+req.app.locals.users[req.session.userId].displayName);
        } catch (error) {
            const error_msg = {
                message: 'Error completing authentication',
                debug: JSON.stringify(error, Object.getOwnPropertyNames(error))
            }
            //console.log(error_msg);
        }

        res.redirect('/');
    }
);

router.get('/signout',
    async function(req, res) {
        // Sign out
        if (req.session.userId) {
            // Look up the user's account in the cache
            const accounts = await req.app.locals.msalClient
                .getTokenCache()
                .getAllAccounts();

            const userAccount = accounts.find(a => a.homeAccountId === req.session.userId);

            // Remove the account
            if (userAccount) {
                req.app.locals.msalClient
                .getTokenCache()
                .removeAccount(userAccount);
            }
        }

        // Destroy the user's session
        req.session.destroy(function (err) {
            res.redirect('/');
        });
    }
);

router.get('/signinPage', (req, res) => {
    res.render('auth/signinPage', {page:'Sign In', menuId: 'auth'})
});

module.exports = router;