/**
 * GlowMagazine — tool runtime (static-site version).
 * Same GMT.register(name,{init(ctx)}) API as the plugin, so calculator modules
 * are portable. Search reads window.GMT_TOOLS (emitted by the generator).
 */
( function () {
	'use strict';

	var GMT = window.GMT || {};
	window.GMT = GMT;
	GMT._modules = {};

	GMT.register = function ( name, def ) {
		GMT._modules[ name ] = def;
		if ( GMT._mounted ) {
			mountOne( document.querySelector( '.gmt-tool[data-handler="' + name + '"]' ) );
		}
	};

	/* ----------------------------- helpers ----------------------------- */
	var h = {
		el: function ( tag, props, children ) {
			var node = document.createElement( tag );
			if ( props ) {
				Object.keys( props ).forEach( function ( k ) {
					if ( k === 'class' ) { node.className = props[ k ]; }
					else if ( k === 'html' ) { node.innerHTML = props[ k ]; }
					else if ( k === 'text' ) { node.textContent = props[ k ]; }
					else if ( k.indexOf( 'on' ) === 0 && typeof props[ k ] === 'function' ) { node.addEventListener( k.slice( 2 ).toLowerCase(), props[ k ] ); }
					else if ( props[ k ] !== null && props[ k ] !== undefined && props[ k ] !== false ) { node.setAttribute( k, props[ k ] ); }
				} );
			}
			h.append( node, children );
			return node;
		},
		append: function ( node, children ) {
			if ( children === null || children === undefined ) { return node; }
			if ( Array.isArray( children ) ) { children.forEach( function ( c ) { h.append( node, c ); } ); }
			else if ( children instanceof Node ) { node.appendChild( children ); }
			else { node.appendChild( document.createTextNode( String( children ) ) ); }
			return node;
		},
		field: function ( label, input, hint ) {
			var id = input.id || ( 'f-' + Math.random().toString( 36 ).slice( 2, 8 ) );
			input.id = id;
			var kids = [ h.el( 'label', { 'for': id, text: label } ), input ];
			if ( hint ) { kids.push( h.el( 'small', { 'class': 'hint', text: hint } ) ); }
			return h.el( 'div', { 'class': 'field' }, kids );
		},
		num: function ( v, dp ) {
			if ( v === null || v === undefined || isNaN( v ) ) { return '—'; }
			dp = ( dp === undefined ) ? 2 : dp;
			return Number( v ).toLocaleString( undefined, { minimumFractionDigits: dp, maximumFractionDigits: dp } );
		},
		clamp: function ( v, min, max ) { return Math.min( max, Math.max( min, v ) ); },
		debounce: function ( fn, wait ) {
			var t;
			return function () { var a = arguments, c = this; clearTimeout( t ); t = setTimeout( function () { fn.apply( c, a ); }, wait ); };
		},
		getJSON: function ( url, opts ) {
			opts = opts || {};
			var ctrl = ( 'AbortController' in window ) ? new AbortController() : null;
			var timer = ctrl ? setTimeout( function () { ctrl.abort(); }, opts.timeout || 12000 ) : null;
			return fetch( url, { signal: ctrl ? ctrl.signal : undefined, headers: { 'Accept': 'application/json' } } )
				.then( function ( r ) { if ( timer ) { clearTimeout( timer ); } if ( ! r.ok ) { throw new Error( 'HTTP ' + r.status ); } return r.json(); } );
		},
		copy: function ( text ) {
			if ( navigator.clipboard && navigator.clipboard.writeText ) { return navigator.clipboard.writeText( text ); }
			var ta = document.createElement( 'textarea' ); ta.value = text; document.body.appendChild( ta ); ta.select();
			try { document.execCommand( 'copy' ); } catch ( e ) {} document.body.removeChild( ta ); return Promise.resolve();
		}
	};
	GMT.h = h;

	/* ----------------------------- mounting ---------------------------- */
	function mountOne( root ) {
		if ( ! root || root.getAttribute( 'data-mounted' ) === '1' ) { return; }
		var name = root.getAttribute( 'data-handler' );
		var def = GMT._modules[ name ];
		var form = root.querySelector( '[data-gmt="form"]' );
		var result = root.querySelector( '[data-gmt="result"]' );
		if ( ! def || ! form ) { return; }
		root.setAttribute( 'data-mounted', '1' );
		var loading = form.querySelector( '[data-gmt="loading"]' );
		if ( loading ) { loading.remove(); }
		try { def.init( { root: root, form: form, result: result, h: h } ); enhanceDates( form ); }
		catch ( e ) {
			form.appendChild( h.el( 'p', { 'class': 'gmt-notice gmt-notice--error', text: 'Sorry, this tool failed to load.' } ) );
			if ( window.console ) { console.error( '[GMT] tool "' + name + '" failed:', e ); }
		}
	}
	function mountAll() {
		GMT._mounted = true;
		Array.prototype.forEach.call( document.querySelectorAll( '.gmt-tool[data-handler]' ), mountOne );
	}

	/* ------------------------------ search ----------------------------- */
	function initSearch( box ) {
		var input = box.querySelector( '[data-gmt="search-input"]' );
		var list = box.querySelector( '[data-gmt="search-results"]' );
		var data = window.GMT_TOOLS || [];
		if ( ! input || ! list ) { return; }

		function render( items ) {
			list.innerHTML = '';
			if ( ! items.length ) { list.hidden = true; return; }
			items.slice( 0, 12 ).forEach( function ( it ) {
				var a = h.el( 'a', { href: it.url, 'class': 'tool-search__hit' }, [
					h.el( 'span', { 'class': 'ico' }, h.el( 'span', { 'class': 'material-symbols-outlined', text: it.icon } ) ),
					h.el( 'b', { text: it.name } ),
					h.el( 'span', { 'class': 'cat', text: it.category } )
				] );
				list.appendChild( h.el( 'li', { role: 'option' }, a ) );
			} );
			list.hidden = false;
		}
		function run() {
			var q = input.value.trim().toLowerCase();
			if ( ! q ) { list.hidden = true; return; }
			render( data.filter( function ( t ) {
				return ( t.name + ' ' + t.slug + ' ' + t.category ).toLowerCase().indexOf( q ) !== -1;
			} ) );
		}
		input.addEventListener( 'input', run );
		input.addEventListener( 'focus', run );
		document.addEventListener( 'click', function ( e ) { if ( ! box.contains( e.target ) ) { list.hidden = true; } } );
	}
	function initSearches() {
		Array.prototype.forEach.call( document.querySelectorAll( '[data-gmt="search"]' ), initSearch );
	}

	/* --------------------------- themed datepicker --------------------------- */
	function pad( n ) { return ( n < 10 ? '0' : '' ) + n; }
	function iso( d ) { return d.getFullYear() + '-' + pad( d.getMonth() + 1 ) + '-' + pad( d.getDate() ); }
	function strip( d ) { return new Date( d.getFullYear(), d.getMonth(), d.getDate() ); }
	function parseISO( s ) { if ( ! s ) { return null; } var p = String( s ).split( '-' ); if ( p.length !== 3 ) { return null; } var d = new Date( +p[ 0 ], +p[ 1 ] - 1, +p[ 2 ] ); return isNaN( d ) ? null : d; }

	GMT.datepicker = function ( input ) {
		if ( input.getAttribute( 'data-dp' ) ) { return; }
		input.setAttribute( 'data-dp', '1' );
		var min = parseISO( input.getAttribute( 'min' ) ), max = parseISO( input.getAttribute( 'max' ) );
		input.type = 'text'; input.readOnly = true; input.setAttribute( 'autocomplete', 'off' );
		input.classList.add( 'gmt-date' );
		if ( ! input.getAttribute( 'placeholder' ) ) { input.setAttribute( 'placeholder', 'Select a date' ); }

		var wrap = h.el( 'div', { 'class': 'gmt-dp' } );
		input.parentNode.insertBefore( wrap, input ); wrap.appendChild( input );
		wrap.appendChild( h.el( 'span', { 'class': 'gmt-dp__btn material-symbols-outlined', 'aria-hidden': 'true', text: 'calendar_month' } ) );
		var pop = h.el( 'div', { 'class': 'gmt-dp__pop', hidden: true } ); wrap.appendChild( pop );

		var sel = parseISO( input.value );
		var view = new Date( ( sel || new Date() ).getTime() ); view.setDate( 1 );

		function isDisabled( d ) { return ( min && d < strip( min ) ) || ( max && d > strip( max ) ); }
		function render() {
			pop.innerHTML = '';
			var head = h.el( 'div', { 'class': 'gmt-dp__head' } );
			var prev = h.el( 'button', { type: 'button', 'class': 'gmt-dp__nav material-symbols-outlined', text: 'chevron_left', 'aria-label': 'Previous month' } );
			var next = h.el( 'button', { type: 'button', 'class': 'gmt-dp__nav material-symbols-outlined', text: 'chevron_right', 'aria-label': 'Next month' } );
			prev.addEventListener( 'click', function ( e ) { e.stopPropagation(); view.setMonth( view.getMonth() - 1 ); render(); } );
			next.addEventListener( 'click', function ( e ) { e.stopPropagation(); view.setMonth( view.getMonth() + 1 ); render(); } );
			head.appendChild( prev );
			head.appendChild( h.el( 'span', { 'class': 'gmt-dp__title', text: view.toLocaleDateString( undefined, { month: 'long', year: 'numeric' } ) } ) );
			head.appendChild( next );
			pop.appendChild( head );

			var dow = h.el( 'div', { 'class': 'gmt-dp__dow' } );
			[ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ].forEach( function ( d ) { dow.appendChild( h.el( 'span', { text: d } ) ); } );
			pop.appendChild( dow );

			var grid = h.el( 'div', { 'class': 'gmt-dp__grid' } );
			var startDay = new Date( view.getFullYear(), view.getMonth(), 1 ).getDay();
			for ( var i = 0; i < startDay; i++ ) { grid.appendChild( h.el( 'span', {} ) ); }
			var dim = new Date( view.getFullYear(), view.getMonth() + 1, 0 ).getDate();
			var today = strip( new Date() );
			for ( var day = 1; day <= dim; day++ ) {
				( function ( day ) {
					var d = new Date( view.getFullYear(), view.getMonth(), day );
					var cls = 'gmt-dp__day';
					if ( sel && iso( sel ) === iso( d ) ) { cls += ' is-sel'; }
					if ( iso( d ) === iso( today ) ) { cls += ' is-today'; }
					var b = h.el( 'button', { type: 'button', 'class': cls, text: String( day ) } );
					if ( isDisabled( d ) ) { b.disabled = true; }
					else { b.addEventListener( 'click', function ( e ) { e.stopPropagation(); sel = d; input.value = iso( d ); input.dispatchEvent( new Event( 'input', { bubbles: true } ) ); input.dispatchEvent( new Event( 'change', { bubbles: true } ) ); close(); } ); }
					grid.appendChild( b );
				} )( day );
			}
			pop.appendChild( grid );
		}
		function open() { sel = parseISO( input.value ) || sel; if ( sel ) { view = new Date( sel.getTime() ); view.setDate( 1 ); } render(); pop.hidden = false; wrap.classList.add( 'is-open' ); }
		function close() { pop.hidden = true; wrap.classList.remove( 'is-open' ); }
		input.addEventListener( 'click', function () { pop.hidden ? open() : close(); } );
		input.addEventListener( 'keydown', function ( e ) { if ( e.key === 'Enter' || e.key === ' ' ) { e.preventDefault(); open(); } } );
		document.addEventListener( 'click', function ( e ) { if ( ! wrap.contains( e.target ) ) { close(); } } );
	};
	function enhanceDates( form ) { Array.prototype.forEach.call( form.querySelectorAll( 'input[type=date]' ), GMT.datepicker ); }

	/* ------------------------------- quiz engine ------------------------------- */
	GMT.quiz = function ( ctx, cfg ) {
		var form = ctx.form, result = ctx.result;
		var answers = {};
		cfg.questions.forEach( function ( q, qi ) {
			var opts = h.el( 'div', { 'class': 'gmt-quiz__opts' } );
			q.a.forEach( function ( opt ) {
				var b = h.el( 'button', { type: 'button', 'class': 'gmt-quiz__opt', text: opt.t } );
				b.addEventListener( 'click', function () {
					Array.prototype.forEach.call( opts.children, function ( c ) { c.classList.remove( 'is-on' ); } );
					b.classList.add( 'is-on' ); answers[ qi ] = opt.s;
				} );
				opts.appendChild( b );
			} );
			form.appendChild( h.el( 'div', { 'class': 'gmt-quiz__q' }, [ h.el( 'p', { 'class': 'gmt-quiz__qt', text: ( qi + 1 ) + '. ' + q.q } ), opts ] ) );
		} );
		var btn = h.el( 'button', { 'class': 'gmt-btn gmt-btn--block', type: 'button', text: cfg.cta || 'See my result', style: 'margin-top:8px' } );
		form.appendChild( btn );
		btn.addEventListener( 'click', function () {
			if ( Object.keys( answers ).length < cfg.questions.length ) {
				result.innerHTML = ''; result.appendChild( h.el( 'p', { 'class': 'gmt-notice gmt-notice--error', text: 'Please answer all the questions first.' } ) ); return;
			}
			var tally = {};
			Object.keys( answers ).forEach( function ( k ) { var s = answers[ k ]; Object.keys( s ).forEach( function ( key ) { tally[ key ] = ( tally[ key ] || 0 ) + s[ key ]; } ); } );
			var best = null, bv = -1;
			Object.keys( tally ).forEach( function ( key ) { if ( tally[ key ] > bv ) { bv = tally[ key ]; best = key; } } );
			var r = cfg.results[ best ] || { title: best, text: '' };
			result.innerHTML = '';
			result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
				h.el( 'div', { 'class': 'gmt-result__label', text: cfg.resultLabel || 'Your result' } ),
				h.el( 'div', { 'class': 'gmt-result__big', style: 'font-size:1.7rem', text: r.title } ),
				h.el( 'p', { text: r.text } ),
				r.tips ? h.el( 'p', { 'class': 'hint', text: r.tips } ) : null
			] ) );
			if ( result.scrollIntoView ) { result.scrollIntoView( { behavior: 'smooth', block: 'nearest' } ); }
		} );
	};

	function boot() { mountAll(); initSearches(); }
	if ( document.readyState === 'loading' ) { document.addEventListener( 'DOMContentLoaded', boot ); }
	else { boot(); }
} )();
