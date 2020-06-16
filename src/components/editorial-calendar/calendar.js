/**
 * External dependencies
 */
import moment from 'moment';
import { isUndefined, pickBy, map } from 'lodash';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

/**
 * Internal dependencies
 */
import fetchPosts from './api';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { format, date } from '@wordpress/date';
import { withDispatch, withSelect, select } from '@wordpress/data';
import { compose } from '@wordpress/compose';
const { Placeholder, Spinner, withSpokenMessages, Button } = wp.components;
import { Fragment, Component, RawHTML, render } from '@wordpress/element';

class IcebergEditorialCalendarView extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const { getEvents, postType } = this.props;

		return (
			<Fragment>
				<FullCalendar
					editable={ true }
					defaultView="dayGridMonth"
					header={ {
						left: 'prev,next today',
						center: 'title',
						right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
					} }
					plugins={ [
						dayGridPlugin,
						timeGridPlugin,
						interactionPlugin,
					] }
					events={ ( { start, end }, callback ) => {
						if ( callback ) {
							fetchPosts(
								postType,
								moment( start ).format( 'YYYY-MM-DDTHH:mm:ss' ),
								moment( end ).format( 'YYYY-MM-DDTHH:mm:ss' ),
								callback
							);
						}
					} }
					loading={ ( isLoading, view ) => {
						console.log( isLoading );
					} }
				/>
			</Fragment>
		);
	}
}

export default compose( [
	withDispatch( ( dispatch ) => ( {
		getEvents( type ) {
			const { getEntityRecords } = select( 'core' );
			const postsListQuery = pickBy(
				{
					iceberg_per_page: 500,
				},
				( value ) => ! isUndefined( value )
			);

			return getEntityRecords( 'postType', type, postsListQuery );
		},
	} ) ),
	withSpokenMessages,
] )( IcebergEditorialCalendarView );

