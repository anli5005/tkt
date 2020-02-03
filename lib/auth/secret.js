require("dotenv").config();

module.exports = process.env.NOW_GITHUB_COMMIT_REF === "master" ? process.env.PROD_JWT_SECRET : process.env.JWT_SECRET;