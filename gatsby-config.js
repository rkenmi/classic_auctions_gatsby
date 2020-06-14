/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* This only works for development */
  proxy: {
    prefix: "/api",
    url: "https://classic-ah.com",
  },
  plugins: [
    // `gatsby-transformer-json`,
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     path: `./src/json/`,
    //   },
    // },
  ]
};
