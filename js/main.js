const GITHUB_ISSUES_LINK ="https://github.com/thetestgame/gh-pages-url-shortener";
const BASE_SHORTENER_URL = "https://ttg.wtf/";
const PATH_SEGMENTS_TO_SKIP = 0;

/**
 * Checks if a string is a valid URL. This function is based 
 * on Regex from https://stackoverflow.com/a/3809435
 * @param {*} url 
 * @returns true if the string is a valid URL, false otherwise
 */
function isUrl(url) {
    return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,24}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)+$/.test(url);
}

/**
 * Performs a GET request to a GitHub issues link and redirects the user to the corresponding website.
 * @function redirect
 * @returns {void}
 */
function redirect() {
    var location = window.location;
    var issueNumber = location.pathname.split("/")[PATH_SEGMENTS_TO_SKIP + 1];

    // Make a XML http request to the GitHub issues api to get the issue title
    // and redirect the user to the corresponding website
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var redirectUrl = BASE_SHORTENER_URL;
        try {
            var payload = JSON.parse(xhr.response);
            var message = payload.message;
            var title = payload.title;
    
            // Check if the URL is invalid and if it is set the redirect URL
            // to the issue's url.
            if (message === "Not Found" || !title || !isUrl(title) || new URL(title).hostname === location.hostname) {
                redirectUrl = title;
            }
        } catch (e) {} 
    
        console.log(redirectUrl);
        //location.replace(redirectUrl); // Redirect to to the redirect URL       
    };

    //xhr.onerror = function () { location.replace(BASE_SHORTENER_URL); };
    xhr.open("GET", GITHUB_ISSUES_LINK + issueNumber);
    xhr.send();
}

redirect();