# Cross-Venue Spread Monitor

Client-side execution tool: polls free public exchange APIs from your browser
(no server, no keys) for the same asset's bid/ask across venues, computes the
fee-adjusted executable cross using only fresh quotes, logs positive-edge
moments, charts the session, and exports JSON. Venue list encodes researched
CORS/geo caveats (Coinbase + Bitstamp are the verified browser-workable core);
venues that fail simply show an error status and are excluded from the cross.

Open `index.html` and click Start.
