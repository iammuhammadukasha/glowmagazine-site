/**
 * GlowMagazine — site-wide search (tools + articles + categories).
 * Reads window.GMT_SITE_INDEX (emitted by build.mjs) and ?q= from the URL.
 */
( function () {
	'use strict';

	var data = window.GMT_SITE_INDEX || [];
	var input = document.querySelector( '[data-site-search="input"]' );
	var list = document.querySelector( '[data-site-search="results"]' );
	var meta = document.querySelector( '[data-site-search="meta"]' );
	if ( ! input || ! list ) { return; }

	var params = new URLSearchParams( window.location.search );
	var initial = params.get( 'q' ) || '';
	if ( initial ) { input.value = initial; }

	var TYPE_LABEL = { tool: 'Tool', article: 'Article', category: 'Category' };

	function filter( q ) {
		q = ( q || '' ).trim().toLowerCase();
		if ( ! q ) { return []; }
		return data.filter( function ( item ) {
			var hay = ( item.name + ' ' + item.excerpt + ' ' + item.category + ' ' + item.type ).toLowerCase();
			return hay.indexOf( q ) !== -1;
		} );
	}

	function el( tag, props, children ) {
		var node = document.createElement( tag );
		if ( props ) {
			Object.keys( props ).forEach( function ( k ) {
				if ( k === 'class' ) { node.className = props[ k ]; }
				else if ( k === 'text' ) { node.textContent = props[ k ]; }
				else if ( props[ k ] !== null && props[ k ] !== undefined ) { node.setAttribute( k, props[ k ] ); }
			} );
		}
		if ( children ) {
			( Array.isArray( children ) ? children : [ children ] ).forEach( function ( c ) {
				if ( c ) { node.appendChild( typeof c === 'string' ? document.createTextNode( c ) : c ); }
			} );
		}
		return node;
	}

	function render( q ) {
		var hits = filter( q );
		list.innerHTML = '';
		if ( ! q.trim() ) {
			if ( meta ) { meta.textContent = 'Type to search tools, articles and categories.'; }
			return;
		}
		if ( meta ) {
			meta.textContent = hits.length
				? hits.length + ' result' + ( hits.length === 1 ? '' : 's' ) + ' for \u201c' + q.trim() + '\u201d'
				: 'No results for \u201c' + q.trim() + '\u201d. Try different keywords.';
		}
		hits.slice( 0, 24 ).forEach( function ( item ) {
			var row = el( 'a', { href: item.url, class: 'site-search__hit', role: 'option' }, [
				el( 'span', { class: 'ico' }, el( 'span', { class: 'material-symbols-outlined', text: item.icon || 'search' } ) ),
				el( 'span', { class: 'site-search__body' }, [
					el( 'b', { text: item.name } ),
					item.excerpt ? el( 'span', { class: 'site-search__excerpt', text: item.excerpt } ) : null
				] ),
				el( 'span', { class: 'site-search__type', text: TYPE_LABEL[ item.type ] || item.type } )
			] );
			list.appendChild( el( 'li', {}, row ) );
		} );
	}

	var timer;
	input.addEventListener( 'input', function () {
		clearTimeout( timer );
		timer = setTimeout( function () { render( input.value ); }, 120 );
	} );

	render( input.value );
} )();
