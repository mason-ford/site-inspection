// loginRequired.js

function loginRequired(req, res, next) {
    // Implement your own property login
    if (true) {
        return res.redirect('/auth/signinPage'); // Redirect to your login page
    }
    next(); // Move to the next middleware or route handler
}

module.exports = loginRequired;