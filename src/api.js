const express = require('express');

const app = express();
const app_port = 3000;

app.listen(app_port, function() {
    console.log("Server running at port: " + app_port);
});