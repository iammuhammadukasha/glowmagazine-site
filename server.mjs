/** Minimal static server with clean-URL support (mirrors production hosting). */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const ROOT = dirname( fileURLToPath( import.meta.url ) );
const PORT = process.env.PORT || 4321;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };

createServer( async ( req, res ) => {
	try {
		let p = decodeURIComponent( req.url.split( '?' )[ 0 ] );
		if ( p.endsWith( '/' ) ) { p += 'index.html'; }
		else if ( ! extname( p ) ) { p += '/index.html'; }
		const file = normalize( join( ROOT, p ) );
		if ( ! file.startsWith( ROOT ) ) { res.writeHead( 403 ).end( 'Forbidden' ); return; }
		const data = await readFile( file );
		res.writeHead( 200, { 'Content-Type': MIME[ extname( file ) ] || 'application/octet-stream' } );
		res.end( data );
	} catch {
		res.writeHead( 404, { 'Content-Type': 'text/html' } );
		res.end( '<h1>404 — Not found</h1><p><a href="/">Home</a> · <a href="/tools/">All tools</a></p>' );
	}
} ).listen( PORT, () => console.log( `GlowMagazine running at http://localhost:${ PORT }` ) );
