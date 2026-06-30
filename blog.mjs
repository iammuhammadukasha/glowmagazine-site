/**
 * GlowMagazine — Contentful blog source.
 * Pulls published `blogPost` entries from the Content Delivery API at build time
 * and normalises them for build.mjs. No SDK / npm deps — plain fetch (Node 18+).
 *
 * Required env (local .env or Vercel project env vars):
 *   CONTENTFUL_SPACE_ID
 *   CONTENTFUL_CDA_TOKEN        (Content Delivery API access token — published, not preview/CMA)
 *   CONTENTFUL_ENVIRONMENT      (optional, defaults to "master")
 *
 * Graceful fallback: if env is missing or the API errors, fetchPosts() resolves
 * to [] and the build keeps the static placeholder blog instead of failing.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname( fileURLToPath( import.meta.url ) );

/* --------------------------- tiny .env loader --------------------------- */
async function loadEnv() {
	try {
		const raw = await readFile( join( ROOT, '.env' ), 'utf8' );
		for ( const line of raw.split( /\r?\n/ ) ) {
			const m = line.match( /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/ );
			if ( ! m || line.trimStart().startsWith( '#' ) ) continue;
			let v = m[ 2 ].trim();
			if ( ( v.startsWith( '"' ) && v.endsWith( '"' ) ) || ( v.startsWith( "'" ) && v.endsWith( "'" ) ) ) v = v.slice( 1, -1 );
			if ( process.env[ m[ 1 ] ] === undefined ) process.env[ m[ 1 ] ] = v;
		}
	} catch { /* no .env — rely on real process.env (e.g. Vercel) */ }
}

/* ------------------------------ html escape ------------------------------ */
const esc = ( s = '' ) => String( s ).replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' );

/* --------------------- Contentful rich-text -> HTML --------------------- */
const MARK = { bold: [ '<strong>', '</strong>' ], italic: [ '<em>', '</em>' ], underline: [ '<u>', '</u>' ], code: [ '<code>', '</code>' ] };

function renderText( node ) {
	let html = esc( node.value || '' ).replace( /\n/g, '<br>' );
	for ( const m of node.marks || [] ) {
		const tag = MARK[ m.type ];
		if ( tag ) html = tag[ 0 ] + html + tag[ 1 ];
	}
	return html;
}

function renderNodes( nodes, assets ) {
	return ( nodes || [] ).map( ( n ) => renderNode( n, assets ) ).join( '' );
}

function renderNode( node, assets ) {
	switch ( node.nodeType ) {
		case 'text': return renderText( node );
		case 'paragraph': return `<p>${ renderNodes( node.content, assets ) }</p>`;
		case 'heading-1': return `<h2>${ renderNodes( node.content, assets ) }</h2>`; // H1 reserved for page title
		case 'heading-2': return `<h2>${ renderNodes( node.content, assets ) }</h2>`;
		case 'heading-3': return `<h3>${ renderNodes( node.content, assets ) }</h3>`;
		case 'heading-4': return `<h4>${ renderNodes( node.content, assets ) }</h4>`;
		case 'heading-5': return `<h5>${ renderNodes( node.content, assets ) }</h5>`;
		case 'heading-6': return `<h6>${ renderNodes( node.content, assets ) }</h6>`;
		case 'unordered-list': return `<ul>${ renderNodes( node.content, assets ) }</ul>`;
		case 'ordered-list': return `<ol>${ renderNodes( node.content, assets ) }</ol>`;
		case 'list-item': return `<li>${ renderNodes( node.content, assets ) }</li>`;
		case 'blockquote': return `<blockquote>${ renderNodes( node.content, assets ) }</blockquote>`;
		case 'hr': return '<hr>';
		case 'hyperlink': {
			const uri = esc( node.data?.uri || '#' );
			const ext = /^https?:\/\//.test( uri ) ? ' target="_blank" rel="noopener nofollow"' : '';
			return `<a href="${ uri }"${ ext }>${ renderNodes( node.content, assets ) }</a>`;
		}
		case 'embedded-asset-block': {
			const a = assets.get( node.data?.target?.sys?.id );
			if ( ! a || ! a.url ) return '';
			return `<figure class="article__figure"><img src="${ esc( a.url ) }" alt="${ esc( a.title ) }" loading="lazy">${ a.title ? `<figcaption>${ esc( a.title ) }</figcaption>` : '' }</figure>`;
		}
		default: // embedded-entry-block/inline, tables etc. — recurse if it has children
			return node.content ? renderNodes( node.content, assets ) : '';
	}
}

/* ------------------------------ normalise ------------------------------ */
function assetMap( includes ) {
	const map = new Map();
	for ( const a of includes?.Asset || [] ) {
		const file = a.fields?.file;
		if ( ! file?.url ) continue;
		map.set( a.sys.id, { url: 'https:' + file.url, title: a.fields?.title || a.fields?.description || '' } );
	}
	return map;
}

function fmtDate( iso ) {
	const d = new Date( iso );
	if ( isNaN( d ) ) return '';
	return d.toLocaleDateString( 'en-US', { year: 'numeric', month: 'long', day: 'numeric' } );
}

const BADGE_TINTS = [ 't-indigo', 't-purple', 't-pink', 't-blue', 't-violet' ];
const tintFor = ( s = '' ) => BADGE_TINTS[ Array.from( s ).reduce( ( a, c ) => a + c.charCodeAt( 0 ), 0 ) % BADGE_TINTS.length ];

function normalise( item, assets ) {
	const f = item.fields || {};
	const cover = f.coverImage?.sys?.id ? assets.get( f.coverImage.sys.id ) : null;
	const iso = f.publishedDate || item.sys?.createdAt;
	return {
		slug: f.slug,
		title: f.title || 'Untitled',
		category: f.category || 'Blog',
		excerpt: f.excerpt || '',
		cover: cover?.url || '',
		coverAlt: cover?.title || f.title || '',
		bodyHtml: f.body ? renderNodes( f.body.content, assets ) : '',
		iso,
		date: fmtDate( iso ),
		tint: tintFor( f.category || '' ),
		seoTitle: f.seoTitle || f.title,
		seoDescription: f.seoDescription || f.excerpt || '',
	};
}

/* ------------------------------- fetch -------------------------------- */
export async function fetchPosts() {
	await loadEnv();
	const space = process.env.CONTENTFUL_SPACE_ID;
	const token = process.env.CONTENTFUL_CDA_TOKEN;
	const envId = process.env.CONTENTFUL_ENVIRONMENT || 'master';
	if ( ! space || ! token ) {
		console.warn( '⚠ Contentful env not set (CONTENTFUL_SPACE_ID / CONTENTFUL_CDA_TOKEN) — keeping static blog.' );
		return [];
	}

	const url = `https://cdn.contentful.com/spaces/${ space }/environments/${ envId }/entries`
		+ `?content_type=blogPost&order=-fields.publishedDate&include=2&limit=200`;

	try {
		const res = await fetch( url, { headers: { Authorization: `Bearer ${ token }` } } );
		if ( ! res.ok ) {
			console.warn( `⚠ Contentful ${ res.status } ${ res.statusText } — keeping static blog.` );
			return [];
		}
		const data = await res.json();
		const assets = assetMap( data.includes );
		const posts = ( data.items || [] ).map( ( it ) => normalise( it, assets ) ).filter( ( p ) => p.slug );
		console.log( `✓ Contentful: ${ posts.length } blog post(s) fetched.` );
		return posts;
	} catch ( e ) {
		console.warn( `⚠ Contentful fetch failed (${ e.message }) — keeping static blog.` );
		return [];
	}
}
