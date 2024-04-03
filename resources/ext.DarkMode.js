/**
 * Some code adapted from the enwiki gadget https://w.wiki/5Ktj
 */
// eslint-disable-next-line strict
$( () => {
	// eslint-disable-next-line no-jquery/no-global-selector
	const $darkModeLink = $( '.ext-darkmode-link' );

	/**
	 * @param {boolean} darkMode is dark mode currently enabled?
	 */
	function updateLink( darkMode ) {
		// Update the icon.
		if ( darkMode ) {
			$darkModeLink.find( '.mw-ui-icon-moon' )
				.removeClass( 'mw-ui-icon-moon' )
				.addClass( 'mw-ui-icon-bright' );
		} else {
			$darkModeLink.find( '.mw-ui-icon-bright' )
				.removeClass( 'mw-ui-icon-bright' )
				.addClass( 'mw-ui-icon-moon' );
		}
		// Use different CSS selectors for the dark mode link based on the skin.
		// eslint-disable-next-line unicorn/prefer-includes
		const labelSelector = [ 'vector', 'vector-2022', 'minerva' ].indexOf( mw.config.get( 'skin' ) ) !== -1 ?
			'span:not( .mw-ui-icon, .vector-icon, .minerva-icon )' :
			'a';

		// Update the link text and tooltip.
		$darkModeLink.find( labelSelector )
			.text( mw.msg( darkMode ? 'darkmode-default-link' : 'darkmode-link' ) )
			.attr( 'title', mw.msg( darkMode ?
				'darkmode-default-link-tooltip' :
				'darkmode-link-tooltip'
			) );
	}

	$darkModeLink.on( 'click', ( e ) => {
		e.preventDefault();

		const docClassList = document.documentElement.classList;
		// NOTE: this must be on <html> element because the CSS filter creates
		// a new stacking context.
		// See comments in Hooks::onBeforePageDisplay() for more information.
		const darkMode = !docClassList.contains( 'skin-theme-clientpref-night' );

		localStorage.setItem("skin-theme", darkMode ? 'night' : 'day' );
		docClassList.add( darkMode ? 'skin-theme-clientpref-night' : "skin-theme-clientpref-day" )
		docClassList.remove( darkMode ? 'skin-theme-clientpref-day' : 'skin-theme-clientpref-night');
		if ( darkMode ) docClassList.add( 'client-darkmode' );
		if ( !darkMode ) docClassList.remove( 'client-darkmode' );
		if (!mw.user.isAnon() ) {
			new mw.Api().saveOption( 'darkmode', darkMode ? '1' : '0' );
		}
		updateLink( darkMode );

		// Update the mobile theme-color
		// eslint-disable-next-line no-jquery/no-global-selector
		$( 'meta[name="theme-color"]' ).attr( 'content', darkMode ? '#000000' : '#eaecf0' );
	} );

	function isDarkModeEnabled() {
		return document.documentElement.classList.contains( 'skin-theme-clientpref-night' );
	}

	if ( !mw.user.isNamed() && isDarkModeEnabled() ) {
		updateLink( true );
	}
} );
