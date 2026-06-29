/**
 * Currency Converter. Live rates via the free ExchangeRate API (open.er-api.com,
 * no key). Rates cached in-memory per base to limit requests.
 */
( function () {
	'use strict';

	GMT.register( 'currency', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var API = 'https://open.er-api.com/v6/latest/';
			var cache = {}; // base -> { rates, time }

			var POPULAR = [ 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'SGD', 'AED', 'HKD', 'NZD', 'ZAR', 'MYR' ];

			var amount = h.el( 'input', { type: 'number', 'class': 'gmt-input', value: '1', min: '0', step: 'any', inputmode: 'decimal' } );
			var from = h.el( 'select', { 'class': 'gmt-select' } );
			var to = h.el( 'select', { 'class': 'gmt-select' } );

			form.appendChild( h.field( 'Amount', amount ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [
				h.field( 'From', from ),
				h.field( 'To', to )
			] ) );

			var swap = h.el( 'button', { 'class': 'gmt-btn gmt-btn--ghost', type: 'button', text: '⇅ Swap' } );
			form.appendChild( swap );

			function fillSelect( sel, list, selected ) {
				sel.innerHTML = '';
				list.forEach( function ( code ) {
					var o = h.el( 'option', { value: code, text: code } );
					if ( code === selected ) { o.selected = true; }
					sel.appendChild( o );
				} );
			}

			function loading() {
				result.innerHTML = '';
				result.appendChild( h.el( 'p', { 'class': 'gmt-notice', text: 'Fetching latest rates…' } ) );
			}

			function getRates( base ) {
				if ( cache[ base ] ) { return Promise.resolve( cache[ base ] ); }
				return h.getJSON( API + encodeURIComponent( base ) ).then( function ( data ) {
					if ( ! data || data.result !== 'success' || ! data.rates ) {
						throw new Error( 'Bad rate response' );
					}
					cache[ base ] = { rates: data.rates, time: data.time_last_update_utc || '' };
					return cache[ base ];
				} );
			}

			function convert() {
				var amt = parseFloat( amount.value );
				var b = from.value, t = to.value;
				if ( ! ( amt >= 0 ) || ! b || ! t ) { result.innerHTML = ''; return; }

				loading();
				getRates( b ).then( function ( pack ) {
					var rate = pack.rates[ t ];
					if ( ! rate ) { throw new Error( 'Unsupported currency' ); }
					var out = amt * rate;

					result.innerHTML = '';
					result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
						h.el( 'div', { 'class': 'gmt-result__label', text: h.num( amt, 2 ) + ' ' + b + ' equals' } ),
						h.el( 'div', { 'class': 'gmt-result__big', text: h.num( out, 2 ) + ' ' + t } ),
						h.el( 'p', { 'class': 'gmt-hint', text: '1 ' + b + ' = ' + h.num( rate, 4 ) + ' ' + t + ( pack.time ? ' · ' + pack.time : '' ) } )
					] ) );
				} ).catch( function () {
					result.innerHTML = '';
					result.appendChild( h.el( 'p', { 'class': 'gmt-notice gmt-notice--error', text: 'Could not load exchange rates right now. Please try again in a moment.' } ) );
				} );
			}

			swap.addEventListener( 'click', function () {
				var tmp = from.value; from.value = to.value; to.value = tmp; convert();
			} );
			amount.addEventListener( 'input', h.debounce( convert, 250 ) );
			from.addEventListener( 'change', convert );
			to.addEventListener( 'change', convert );

			// Initial: populate with popular list, then expand to the full list from USD.
			fillSelect( from, POPULAR, 'USD' );
			fillSelect( to, POPULAR, 'EUR' );
			convert();

			getRates( 'USD' ).then( function ( pack ) {
				var all = Object.keys( pack.rates ).sort();
				fillSelect( from, all, 'USD' );
				fillSelect( to, all, 'EUR' );
			} ).catch( function () { /* keep popular list */ } );
		}
	} );
} )();
