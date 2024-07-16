# Notes during development

## Firefox fires a request twice
I observed that firefox firefox fires a GET request twice and yet Chrome fires ones. 
It was noted that this happens due to the fact that firefox performs a request to `https://localhost:3000/favicon.ico` which still fails. The middleware runs on every path.
Don't set middleware globally. Instead, set it on all paths you need to access.
