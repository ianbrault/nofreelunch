const express = require('express');
const app = express();

app.get('/stripeoauth/register', (req, res) => {
    console.log("redirecting for /stripeoauth/register/");
    res.redirect('nofreelunch://stripeoauth/register/');
});

app.listen(3000, () => { console.log("listening on port 3000") });
