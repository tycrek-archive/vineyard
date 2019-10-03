## Page loading

Page loading will occur in two ways:
1. Full
2. Partial

## Full loads

Full loading sends the entire DOM to the client, including the specific body content requested by the user.

Anything path with these prefixes will perform a full load:

- /		(root index)
- /v	(video viewer)
- /u	(user page)
- /s	(search tool)

## Partial loads

Partial loading is only done by client-side JavaScript to make the site feel more like an "app".
The `fetch` API is used to get the specific `body` content for the page.

Partial loads request content as follows:

- /p/x

Where x is one of: v, u, s, or blank for index.