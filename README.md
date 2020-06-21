![logo](/the_great_gatsby_trailer.jpg)
# Classic Auctions - Gatsby
An app that serves near real-time auctions with in-game Auctioneer data.
## Design
This is roughly based on the early stage diagram below. Some things have changed since the inception (no pun intended ^^) but it is still mostly the same. The biggest change would be the separation of the API and front-end resources. The front-end is now served from a CDN via SSR (Server-side rendering). Another change is that a RDBMS is used for historical marketprice trends.

## Diagram
![diagram](/ClassicAH.png)

## How to run locally
Note: The API server is located in a different repository, which is required to fetch auction items and graph data. On develop/staging, the API server should run on port 8080.

1. `npm install` to pull all dependencies
2. `npm run develop` or `gatsby develop`
3. Go to your browser page at http://localhost:8000

## How to run staging (pre-prod)
1. `npm install` to pull all dependencies
2. `npm run staging`
3. Go to your browser page at http://localhost:9000

