const webp = require('webp-converter');

// this will grant 755 permission to webp executables
webp.grant_permission();

const result = webp.cwebp("not_found.jpg", "nodejs_logo.webp", "-q 80", logging = "-v");
result.then((response) => {
    console.log(response);
});