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

const BASE_SHORTENER_URL = "https://ttg.wtf/";

// Load the error code from a error-code query parameter
const urlParams = new URLSearchParams(window.location.search);
const errorCode = urlParams.get('error-code');

// If we have an error code set the inner text and the data-text 
// attribute to match the query parameter.
if (errorCode) {
  document.getElementById('error-code').innerText = errorCode;
  document.getElementById('error-code').setAttribute('data-text', errorCode);
}

// Load the error message from a error-message query parameter
// and set the inner text and the data-text attribute to match the query parameter.
const errorMessage = urlParams.get('error-message');

if (errorMessage) {
  document.getElementById('error-message').innerText = errorMessage;
}