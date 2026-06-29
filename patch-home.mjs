/** One-off: wire homepage links to real tool URLs + root-absolute assets. */
import { readFile, writeFile } from 'node:fs/promises';
const f = new URL( './index.html', import.meta.url );
let s = await readFile( f, 'utf8' );

/* root-absolute asset paths (so the served site resolves them at any depth) */
s = s.replace( 'href="assets/css/style.css?v=3"', 'href="/assets/css/style.css?v=4"' );
s = s.replace( 'src="assets/js/main.js"', 'src="/assets/js/main.js"' );

/* logos -> home */
s = s.replaceAll( '<a href="#" class="logo"', '<a href="/" class="logo"' );

/* primary menu */
s = s.replace( '<a href="#" class="is-active">Home</a>', '<a href="/" class="is-active">Home</a>' );
s = s.replace( '<span class="has-sub">Tools <span class="material-symbols-outlined">expand_more</span></span>', '<a href="/tools/">Tools</a>' );
s = s.replace( '<span class="has-sub">Categories <span class="material-symbols-outlined">expand_more</span></span>', '<a href="/tools/">Categories</a>' );

/* popular tool cards -> real, whole-card links (whitespace-tolerant) */
const card = ( glyph, name, url ) => {
	const re = new RegExp(
		'<div class="tool-card">\\s*' +
		'<div class="tool-card__ico ([a-z-]+)"><span class="material-symbols-outlined">' + glyph + '</span></div>\\s*' +
		'<h3>([^<]+)</h3>\\s*' +
		'<p>([^<]+)</p>\\s*' +
		'<a href="#" class="tool-card__link">Use Now <span class="material-symbols-outlined">arrow_forward</span></a>\\s*' +
		'</div>', 'm'
	);
	s = s.replace( re, function ( _m, tint, _h, desc ) {
		return '<a class="tool-card" href="' + url + '">\n' +
			'\t\t\t\t\t<div class="tool-card__ico ' + tint + '"><span class="material-symbols-outlined">' + glyph + '</span></div>\n' +
			'\t\t\t\t\t<h3>' + name + '</h3>\n' +
			'\t\t\t\t\t<p>' + desc + '</p>\n' +
			'\t\t\t\t\t<span class="tool-card__link">Use Now <span class="material-symbols-outlined">arrow_forward</span></span>\n' +
			'\t\t\t\t</a>';
	} );
};
card( 'hourglass_empty', 'Age Calculator', '/age-calculator/' );
card( 'fitness_center', 'BMI Calculator', '/bmi-calculator/' );
card( 'account_balance', 'EMI Calculator', '/emi-calculator/' );
card( 'percent', 'Percentage Calculator', '/percentage-calculator/' );
card( 'qr_code_2', 'QR Generator', '/qr-code-generator/' );

/* CTAs */
s = s.replace( '<a href="#" class="btn btn--primary"><span class="material-symbols-outlined">apps</span> View All Tools</a>', '<a href="/tools/" class="btn btn--primary"><span class="material-symbols-outlined">apps</span> View All Tools</a>' );

/* footer: Quick Links "All Tools"/"Categories" + Popular Tools list */
s = s.replace( '<li><a href="#popular">All Tools</a></li>', '<li><a href="/tools/">All Tools</a></li>' );
s = s.replace( '<li><a href="#categories">Categories</a></li>', '<li><a href="/tools/">Categories</a></li>' );
s = s.replace( '<li><a href="#">Age Calculator</a></li>', '<li><a href="/age-calculator/">Age Calculator</a></li>' );
s = s.replace( '<li><a href="#">BMI Calculator</a></li>', '<li><a href="/bmi-calculator/">BMI Calculator</a></li>' );
s = s.replace( '<li><a href="#">EMI Calculator</a></li>', '<li><a href="/emi-calculator/">EMI Calculator</a></li>' );
s = s.replace( '<li><a href="#">Percentage Calculator</a></li>', '<li><a href="/percentage-calculator/">Percentage Calculator</a></li>' );
s = s.replace( '<li><a href="#">QR Code Generator</a></li>', '<li><a href="/qr-code-generator/">QR Code Generator</a></li>' );

/* footer categories column -> real category pages */
const fcat = [ [ 'Calculators', '/tools/health/' ], [ 'Converters', '/tools/utilities/' ], [ 'Generators', '/tools/utilities/' ], [ 'SEO Tools', '/tools/' ], [ 'Text Tools', '/tools/utilities/' ], [ 'All Categories', '/tools/' ] ];
fcat.forEach( function ( c ) { s = s.replace( '<li><a href="#">' + c[ 0 ] + '</a></li>', '<li><a href="' + c[ 1 ] + '">' + c[ 0 ] + '</a></li>' ); } );

await writeFile( f, s, 'utf8' );
console.log( 'Homepage links patched.' );
