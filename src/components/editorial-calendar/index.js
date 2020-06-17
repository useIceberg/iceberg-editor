/**
 * Internal dependencies
 */

import IcebergEditorialCalendarView from './calendar';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import domReady from '@wordpress/dom-ready';
import { Fragment, Component, RawHTML, render } from '@wordpress/element';

class IcebergEditorialCalendar extends Component {
	render() {
		const container = document.getElementById(
			'iceberg-render-editorial-calendar'
		);
		return (
			<Fragment>
				<IcebergEditorialCalendarView
					postType={ container.getAttribute( 'type' ) }
				/>
			</Fragment>
		);
	}
}

domReady( () => {
	render(
		<IcebergEditorialCalendar />,
		document.getElementById( 'iceberg-render-editorial-calendar' )
	);
} );
