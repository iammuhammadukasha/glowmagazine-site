/** Unit Converter — length, weight, temperature, volume, speed. */
( function () {
	'use strict';
	var SETS = {
		Length: { base: 'm', units: { 'Millimetre': 0.001, 'Centimetre': 0.01, 'Metre': 1, 'Kilometre': 1000, 'Inch': 0.0254, 'Foot': 0.3048, 'Yard': 0.9144, 'Mile': 1609.344 } },
		Weight: { base: 'kg', units: { 'Milligram': 1e-6, 'Gram': 0.001, 'Kilogram': 1, 'Tonne': 1000, 'Ounce': 0.0283495, 'Pound': 0.453592, 'Stone': 6.35029 } },
		Volume: { base: 'L', units: { 'Millilitre': 0.001, 'Litre': 1, 'Cubic metre': 1000, 'Teaspoon': 0.00492892, 'Tablespoon': 0.0147868, 'Cup': 0.24, 'Pint (US)': 0.473176, 'Quart (US)': 0.946353, 'Gallon (US)': 3.78541 } },
		Speed: { base: 'm/s', units: { 'Metres/sec': 1, 'Kilometres/hour': 0.277778, 'Miles/hour': 0.44704, 'Knot': 0.514444, 'Feet/sec': 0.3048 } },
		Temperature: { base: '', units: { 'Celsius': 'C', 'Fahrenheit': 'F', 'Kelvin': 'K' } }
	};
	GMT.register( 'unit', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var cat = h.el( 'select', { 'class': 'gmt-select' } );
			Object.keys( SETS ).forEach( function ( k ) { cat.appendChild( h.el( 'option', { value: k, text: k } ) ); } );
			var value = h.el( 'input', { type: 'number', step: 'any', 'class': 'gmt-input', value: '1' } );
			var from = h.el( 'select', { 'class': 'gmt-select' } );
			var to = h.el( 'select', { 'class': 'gmt-select' } );

			form.appendChild( h.field( 'Category', cat ) );
			form.appendChild( h.field( 'Value', value ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'From', from ), h.field( 'To', to ) ] ) );

			function fillUnits() {
				var units = Object.keys( SETS[ cat.value ].units );
				[ from, to ].forEach( function ( sel ) { sel.innerHTML = ''; units.forEach( function ( u ) { sel.appendChild( h.el( 'option', { value: u, text: u } ) ); } ); } );
				to.selectedIndex = Math.min( 1, units.length - 1 );
				calc();
			}
			function toBaseTemp( v, u ) { return u === 'Celsius' ? v : u === 'Fahrenheit' ? ( v - 32 ) * 5 / 9 : v - 273.15; }
			function fromBaseTemp( c, u ) { return u === 'Celsius' ? c : u === 'Fahrenheit' ? c * 9 / 5 + 32 : c + 273.15; }
			function calc() {
				var v = parseFloat( value.value );
				if ( isNaN( v ) ) { result.innerHTML = ''; return; }
				var set = SETS[ cat.value ], out;
				if ( cat.value === 'Temperature' ) { out = fromBaseTemp( toBaseTemp( v, from.value ), to.value ); }
				else { out = v * set.units[ from.value ] / set.units[ to.value ]; }
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: h.num( v, 4 ).replace( /\.?0+$/, '' ) + ' ' + from.value + ' =' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: h.num( out, 4 ).replace( /\.?0+$/, '' ) + ' ' + to.value } )
				] ) );
			}
			cat.addEventListener( 'change', fillUnits );
			[ value, from, to ].forEach( function ( i ) { i.addEventListener( 'input', calc ); i.addEventListener( 'change', calc ); } );
			fillUnits();
		}
	} );
} )();
