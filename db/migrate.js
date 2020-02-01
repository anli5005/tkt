"use strict";

const umzug = require("./umzug.js");

umzug.up({}).then(() => {
    console.log("Complete!")
});