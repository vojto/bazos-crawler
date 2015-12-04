"use strict";

let fs = require('fs');

let kProductIphone6s = 'iphone6s';
let kProductIphone6sPlus = 'iphone6s_plus';
let kProductIphone6Plus = 'iphone6_plus';
let kProductIphone6 = 'iphone6';
let kProductIphone5s = 'iphone5s';
let kProductIphone5c = 'iphone5c';
let kProductIphone5 = 'iphone5';

let kSize128gb = '128gb';
let kSize64gb = '64gb';
let kSize32gb = '32gb';
let kSize16gb = '16gb';
let kSize8gb = '8gb';

class Cleaner {
	start() {
		let listings = JSON.parse(fs.readFileSync('listings.json', 'utf8'));

		// Work with a sample for now
		// listings = listings.slice(0, 100);

		// Derive product details
		this.deriveProductDetails(listings);

		// Filter out products with prices
		listings = listings.filter(l => l.price);


		// Filter out products with plausible prices
		listings = listings.filter(l => l.price > 300 && l.price < 1200);


		// Filter out iPhone 6S
		listings = listings.filter(l => l.product == kProductIphone6s);


		// Filter out 64GB
		listings = listings.filter(l => l.size == kSize64gb);

		listings.forEach(listing => {
			console.log(listing.price, listing.link);
			// console.log(listing.link);
			// console.log('');
		});

		console.log('no of 6s listings', listings.length);

	}

	deriveProductDetails(listings) {
		listings.forEach(listing => {
			listing.product = this.productForTitle(listing.title);
			listing.size = this.sizeForTitle(listing.title);
			if (listing.price) {
				listing.price = parseFloat(listing.price.replace(/[^\d]/, ''));
			}
		});
	}

	productForTitle(title) {
		return this.match(title, [
			[ /iphone\s*6s\s*plus/i, kProductIphone6sPlus ],
			[ /iphone\s*6s/i, kProductIphone6s ],
			[ /iphone\s*6\s*plus/i, kProductIphone6Plus ],
			[ /iphone\s*6/i, kProductIphone6 ],
			[ /iphone\s*5s/i, kProductIphone5s ],
			[ /iphone\s*5c/i, kProductIphone5c ],
			[ /iphone\s*6/i, kProductIphone5 ]
		]);
	}

	sizeForTitle(title) {
		return this.match(title, [
			[ /128\s*gb/i, kSize128gb ],
			[ /64\s*gb/i, kSize64gb ],
			[ /32\s*gb/i, kSize32gb ],
			[ /16\s*gb/i, kSize16gb ],
			[ /8\s*gb/i, kSize8gb ]
		]);
	}

	match(title, matchers) {
		var match = null;

		matchers.forEach(matcher => {
			let regex = matcher[0];
			let type = matcher[1];

			if (!match && title.match(regex)) {
				match = type;
			}
		});

		return match;
	}


}



let cleaner = new Cleaner();
cleaner.start();