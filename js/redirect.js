/**
 * MIT License
 * 
 * Copyright (c) 2024 Jordan Maxwell
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const PATH_SEGMENTS_TO_SKIP = 0;

/**
 * Checks if a string is a valid URL. This function is based 
 * on Regex from https://stackoverflow.com/a/3809435
 * @function isUrl
 * @param {*} url Url to check
 * @returns true if the string is a valid URL, false otherwise
 */
function isUrl(url) {
    return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,24}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)+$/.test(url);
}

/**
 * Checks if the issuer is authorized to use the shortener.
 * @function IsIssuerAuthorized
 * @param {*} issuer Issuer to check
 * @returns {boolean} true if the issuer is authorized, false otherwise
 */
function isIssuerAuthorized(issuer) {
    // Load the json file from <domain>/data/users.json and
    // parse the json file to check if the issuer is authorized.
    var xhr = new XMLHttpRequest();
    var baseUrl = getBaseUrl();

    xhr.open("GET", baseUrl + "data/users.json", false);
    xhr.send();

    var users = JSON.parse(xhr.response);
    return users.includes(issuer);
}

/**
 * Redirects the user to the shortener's website with an error message
 * @function redirectToError
 * @param {*} errorCode Error code to display
 * @param {*} errorMessage Error message to display
 */
function redirectToError(errorCode, errorMessage) {
    console.log("Redirect Error. Code: " + errorCode + " Message: " + errorMessage);

    var location = window.location;
    var encodedMessage = encodeURIComponent(errorMessage);
    var baseUrl = getBaseUrl();

    var errorLocation = baseUrl + "?error-code=" + errorCode + "&error-message=" + encodedMessage;
    location.replace(errorLocation);
}

/**
 * Redirects the user to the corresponding website based on the response
 * from the GitHub issues API. If the URL is invalid, the user is redirected
 * back to the shortener's website.
 * @function redirectToPage
 * @param {*} response Response from the Github issues API
 * @returns {void}
 */
function redirectToPage(response) {
    var location = window.location;
    try {
        // Parse the response from the GitHub issues API
        var payload = JSON.parse(response);
        var title = payload.title;

        // Log debug information to the console about the
        // issue that the user is trying to access.
        console.log("Title: " + title);
        console.log("URL: " + new URL(title).hostname);

        // Verify that the issuer is authorized to use the shortener
        if (isIssuerAuthorized(payload.user.login)) {
        
            // Check if the URL is invalid and if it is set the redirect URL
            // to the issue's url.
            if (!title || !isUrl(title) || new URL(title).hostname != location.hostname) {
                console.log("Redirecting to: " + title);
                location.replace(title); 
            }
        } else {
            redirectToError(401, "Unauthorized url");
        }
    } catch (e) {
        redirectToError(500, e.message);
    }
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
    xhr.onload = function() { redirectToPage(xhr.response); };
    xhr.onerror = function () { location.replace(getBaseUrl()); };
    xhr.open("GET", GITHUB_ISSUES_LINK + issueNumber);
    xhr.send();
}

redirect();