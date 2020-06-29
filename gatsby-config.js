/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: `Classic AH WoW`,
    description: `Search engine for Auction House pricing data and graphs on Classic WoW`,
    author: `rkenmi`,
    siteUrl: 'https://classic-ah.com'
  },
  plugins: [
    `gatsby-plugin-offline`,
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://classic-ah.com',
        sitemap: 'https://classic-ah.com/sitemap.xml',
        policy: [{ userAgent: '*', allow: '/' }]
      }
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: "classic-ah.com",
      },
    },
    {
      resolve: "gatsby-plugin-load-script",
      options: {
        src: "https://wow.zamimg.com/widgets/power.js",
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Classic AH WoW`,
        short_name: `Classic AH`,
        start_url: `/`,
        background_color: `#444`,
        theme_color: `#aaa`,
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: `standalone`,
        icon: `static/manifest.jpg`, // This path is relative to the root of the site.
      },
    }
  ]
};
