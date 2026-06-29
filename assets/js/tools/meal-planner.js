/** Meal Planner — split daily calories across meals with a balanced macro guide. */
( function () {
	'use strict';
	var PLANS = {
		'3': [ [ 'Breakfast', 30 ], [ 'Lunch', 40 ], [ 'Dinner', 30 ] ],
		'4': [ [ 'Breakfast', 25 ], [ 'Lunch', 30 ], [ 'Snack', 15 ], [ 'Dinner', 30 ] ],
		'5': [ [ 'Breakfast', 25 ], [ 'Snack', 10 ], [ 'Lunch', 30 ], [ 'Snack', 10 ], [ 'Dinner', 25 ] ]
	};
	GMT.register( 'meal-planner', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var cals = h.el( 'input', { type: 'number', min: '0', 'class': 'gmt-input', placeholder: '2000' } );
			var meals = h.el( 'select', { 'class': 'gmt-select' } );
			[ '3', '4', '5' ].forEach( function ( n ) { meals.appendChild( h.el( 'option', { value: n, text: n + ' meals a day' } ) ); } );
			form.appendChild( h.field( 'Daily calories (kcal)', cals ) );
			form.appendChild( h.field( 'Meals per day', meals ) );

			function calc() {
				var c = parseFloat( cals.value );
				if ( ! ( c > 0 ) ) { result.innerHTML = ''; return; }
				var plan = PLANS[ meals.value ];
				var rows = plan.map( function ( meal ) {
					var k = Math.round( c * meal[ 1 ] / 100 );
					return h.el( 'div', { 'class': 'gmt-result__cell' }, [
						h.el( 'span', { 'class': 'gmt-result__label', text: meal[ 0 ] + ' · ' + meal[ 1 ] + '%' } ),
						h.el( 'b', { text: k + ' kcal' } ),
						h.el( 'span', { 'class': 'hint', text: Math.round( k * 0.3 / 4 ) + 'P / ' + Math.round( k * 0.4 / 4 ) + 'C / ' + Math.round( k * 0.3 / 9 ) + 'F g' } )
					] );
				} );
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Your daily meal plan (balanced 30/40/30 split)' } ),
					h.el( 'div', { 'class': 'gmt-result__grid', style: 'grid-template-columns:1fr' }, rows )
				] ) );
			}
			cals.addEventListener( 'input', calc ); meals.addEventListener( 'change', calc );
		}
	} );
} )();
