"use strict";

let cheerio = require('cheerio');
let request = require('request');
let fs = require('fs');

class Crawler {
	start() {
		let term = 'iphone';
		let path = `search.php?hledat=${term}&rubriky=www&hlokalita=&humkreis=25&cenaod=&cenado=&Submit=Hľadať&kitx=ano`;
		let url = this.urlForPath(path);

		this.listings = [];

		console.log('loading initial: ', path);

		request(url, this.receive.bind(this));
	}

	urlForPath(path) {
		let server = 'http://www.bazos.sk/';
		return server + path;
	}

	receive(err, resp) {
		let $ = cheerio.load(resp.body);

		// Extract listings
		let listings = this.extractListings($);
		this.listings = this.listings.concat(listings);

		console.log('writing', this.listings.length, 'listings');
		fs.writeFileSync('listings.json', JSON.stringify(this.listings), 'utf8');

		// Find the "next" link
		let $a = $('p.strankovani a:last-child');
		if ($a.text() != 'Ďalšia') {
			console.log('DONE');
			return;
		}

		let path = $a.attr('href');
		let url = this.urlForPath(path);

		console.log('loading next:', path);

		request(url, this.receive.bind(this));
	}

	extractListings($) {
		let $listings = $('table.inzeraty');

		let listings = $listings.map((i, listing) => {
			let $listing = $(listing);
			let title = $listing.find('span.nadpis').text();
			let link = $listing.find('span.nadpis a').attr('href');
			let description = $listing.find('div.popis').text();
			let price = $listing.find('span.cena').text();
			let location = $($listing.find('td')[2]).text().replace(/\d/g, '');

			return { title, link, description, price, location };
		}).toArray();

		return listings;
	}
}




let crawler = new Crawler();
crawler.start();