/**
 * External dependencies
 */
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; 

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import domReady from '@wordpress/dom-ready';
import { Fragment, Component, RawHTML, render } from '@wordpress/element';


class IcebergEditorialCalendar extends Component {
	render() {
		return (
			<Fragment>
				<FullCalendar
					defaultView="dayGridMonth"
					header={ {
						left: 'prev,next today',
						center: 'title',
						right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
					} }
					plugins={ [ dayGridPlugin, timeGridPlugin, interactionPlugin ] }
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