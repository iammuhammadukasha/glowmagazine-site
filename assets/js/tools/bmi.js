/**
 * BMI Calculator. Metric & imperial, live result with category meter.
 */
( function () {
	'use strict';

	GMT.register( 'bmi', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var unit = 'metric';

			// Unit toggle.
			var toggle = h.el( 'div', { 'class': 'gmt-segmented', role: 'group', 'aria-label': 'Units' } );
			var bMetric = h.el( 'button', { type: 'button', 'aria-pressed': 'true', text: 'Metric (cm / kg)' } );
			var bImp = h.el( 'button', { type: 'button', 'aria-pressed': 'false', text: 'Imperial (in / lb)' } );
			toggle.appendChild( bMetric );
			toggle.appendChild( bImp );

			var height = h.el( 'input', { type: 'number', 'class': 'gmt-input', min: '0', step: 'any', inputmode: 'decimal', placeholder: '170' } );
			var weight = h.el( 'input', { type: 'number', 'class': 'gmt-input', min: '0', step: 'any', inputmode: 'decimal', placeholder: '65' } );

			var hField = h.field( 'Height (cm)', height );
			var wField = h.field( 'Weight (kg)', weight );

			function setUnit( u ) {
				unit = u;
				var metric = ( u === 'metric' );
				bMetric.setAttribute( 'aria-pressed', metric ? 'true' : 'false' );
				bImp.setAttribute( 'aria-pressed', metric ? 'false' : 'true' );
				hField.querySelector( 'label' ).textContent = metric ? 'Height (cm)' : 'Height (inches)';
				wField.querySelector( 'label' ).textContent = metric ? 'Weight (kg)' : 'Weight (pounds)';
				height.placeholder = metric ? '170' : '67';
				weight.placeholder = metric ? '65' : '145';
				calc();
			}
			bMetric.addEventListener( 'click', function () { setUnit( 'metric' ); } );
			bImp.addEventListener( 'click', function () { setUnit( 'imperial' ); } );

			form.appendChild( h.el( 'div', { 'class': 'gmt-field' }, toggle ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ hField, wField ] ) );

			var categories = [
				{ max: 18.5, name: 'Underweight', tip: 'You may benefit from gaining a little weight. Consider speaking with a healthcare provider.' },
				{ max: 25, name: 'Healthy weight', tip: 'Great — your BMI is in the healthy range. Keep up balanced eating and regular activity.' },
				{ max: 30, name: 'Overweight', tip: 'A small amount of weight loss can improve health markers. Focus on sustainable habits.' },
				{ max: Infinity, name: 'Obese', tip: 'Consider speaking with a healthcare provider about a healthy plan that suits you.' }
			];

			function calc() {
				var hv = parseFloat( height.value );
				var wv = parseFloat( weight.value );
				if ( ! ( hv > 0 ) || ! ( wv > 0 ) ) { result.innerHTML = ''; return; }

				var bmi;
				if ( unit === 'metric' ) {
					var m = hv / 100;
					bmi = wv / ( m * m );
				} else {
					bmi = ( wv / ( hv * hv ) ) * 703;
				}
				if ( ! isFinite( bmi ) || bmi <= 0 ) { result.innerHTML = ''; return; }

				var cat = categories.find( function ( c ) { return bmi < c.max; } );
				// Position pin across 15–40 BMI range for the meter.
				var pct = h.clamp( ( ( bmi - 15 ) / ( 40 - 15 ) ) * 100, 0, 100 );

				result.innerHTML = '';
				var box = h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Your BMI' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: h.num( bmi, 1 ) } ),
					h.el( 'div', { 'class': 'gmt-meter' }, h.el( 'span', { 'class': 'gmt-meter__pin', style: 'left:' + pct + '%' } ) ),
					h.el( 'p', {}, [ h.el( 'strong', { text: cat.name } ), document.createTextNode( ' — ' + cat.tip ) ] )
				] );
				result.appendChild( box );
			}

			height.addEventListener( 'input', calc );
			weight.addEventListener( 'input', calc );
		}
	} );
} )();
