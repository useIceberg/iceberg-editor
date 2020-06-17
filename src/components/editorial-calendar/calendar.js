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
import createIcebergStore from '../../extensions/settings-store/store';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { format, date } from '@wordpress/date';
import {
	withDispatch,
	withSelect,
	select,
	registerGenericStore,
} from '@wordpress/data';
import { compose } from '@wordpress/compose';
const { Placeholder, Spinner, withSpokenMessages, Button } = wp.components;
import { Fragment, Component, RawHTML, render } from '@wordpress/element';

registerGenericStore( 'iceberg-settings', createIcebergStore() );

class IcebergEditorialCalendarView extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const { reSchedule, postType } = this.props;

		return (
			<Fragment>
				<FullCalendar
					editable={ true }
					defaultView="dayGridMonth"
					height="auto"
					contentHeight="auto"
					nextDayThreshold="24:59:59"
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
								moment( start ).format( 'YYYY-MM-DD' ),
								moment( end ).format( 'YYYY-MM-DD' ),
								callback
							);
						}
					} }
					eventDrop={ ( info ) => {
						reSchedule(
							info.oldEvent.extendedProps.ID,
							info.event.start,
							postType
						);
						// console.log( info.oldEvent.extendedProps );
						// console.log( info.event.start );
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
	withDispatch( ( dispatch ) => {
		const { updatePostData } = dispatch( 'iceberg-settings' );
		return {
			reSchedule( postID, newDate, postType ) {
				updatePostData( postID, {
					date: moment( newDate ).format( 'YYYY-MM-DDTHH:mm:ss' ),
				} );
			},
		};
	} ),
	withSpokenMessages,
] )( IcebergEditorialCalendarView );
