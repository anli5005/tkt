require("dotenv").config();

module.exports = {
    webpack(config) {
        config.module.rules.push({
            test: /\.(graphql|gql)$/,
            exclude: /node_modules/,
            loader: 'graphql-tag/loader'
        });

        config.module.rules.push({
            test: /\.(handlebars|hbs)$/,
            exclude: /node_modules/,
            loader: 'handlebars-loader'
        });

        return config;
    }
};