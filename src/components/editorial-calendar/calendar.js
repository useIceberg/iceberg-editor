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
import {
	withDispatch,
	registerGenericStore,
} from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { withViewportMatch } from '@wordpress/viewport';
import { ESCAPE } from '@wordpress/keycodes';
import { addQueryArgs } from '@wordpress/url';
const {
	Popover,
	Spinner,
	withSpokenMessages,
	Button,
	Dashicon,
	TimePicker,
} = wp.components;
import { Fragment, Component, RawHTML, render } from '@wordpress/element';

registerGenericStore( 'iceberg-settings', createIcebergStore() );

class IcebergEditorialCalendarView extends Component {
	constructor() {
		super( ...arguments );

		this.onSelectionEnd = this.onSelectionEnd.bind( this );

		this.state = {
			anchorRef: null,
			currentEvent: false,
			isDatePickerOpen: false,
			datePickerData: null,
		};
	}

	componentDidMount(){
		document.addEventListener( 'mouseup', this.onSelectionEnd );
		document.addEventListener( 'keyup', this.onSelectionEnd );
	}

	onSelectionEnd( event ){
		const { keyCode } = event;
		if ( ESCAPE === keyCode ) {
			this.setState( { anchorRef: null } );
		}
		
		if (
			event.target.classList.contains( 'fc-event-container' ) ||
			event.target.classList.contains( 'fc-widget-content' ) ||
			event.target.classList.contains( 'fc-day-top' )
		) {
			this.setState( { anchorRef: null } );
		}
	}

	render() {
		const { reSchedule, postType, isMobile } = this.props;
		const { anchorRef, currentEvent, isDatePickerOpen } = this.state;
		return (
			<Fragment>
				<FullCalendar
					editable={ true }
					defaultView={ isMobile ? 'timeGridDay' : 'dayGridMonth' }
					allDaySlot={ false }
					eventDurationEditable={ false }
					height="auto"
					contentHeight="auto"
					nextDayThreshold="24:59:59"
					header={ {
						left: 'prev,next today',
						center: 'title, forceRefresh',
						right: isMobile
							? null
							: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
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
						// this.setState( { anchorRef: null } );
					} }
					eventClick={ ( info ) => {
						const ElementRect = info.el.getBoundingClientRect();
						this.setState( {
							isDatePickerOpen: false,
							currentEvent: info,
							anchorRef: ElementRect,
						} );
					} }
					eventRender={ ( info ) => {
						const title = info.el.querySelector( '.fc-title' );
						title.innerHTML =
							'<span class="fc-title-inner">' +
							title.innerHTML +
							'</span>';
						info.el
							.querySelector( '.fc-time' )
							.insertAdjacentHTML(
								'afterend',
								'<span class="fc-status">' +
									info.event.extendedProps.status +
									'</span>'
							);

						info.el.classList.add(
							'fc-status-' + info.event.extendedProps.status
						);

						return info.el;
					} }
					loading={ ( isLoading, view ) => {
						// console.log( isLoading );
					} }
				/>
				{ anchorRef && (
					<Popover
						className="component-iceberg-editorial-calendar-info"
						position="bottom left"
						focusOnMount="container"
						anchorRect={ anchorRef }
						onFocusOutside={ () => {
							this.setState( { anchorRef: null } );
						} }
					>
						<div className="fc-event-info--close">
							<Button
								icon="no"
								onClick={ () => {
									this.setState( { anchorRef: null } );
								} }
							>
								{ __( 'Close', 'iceberg' ) }
							</Button>
						</div>
						{ ! isDatePickerOpen && (
							<Fragment>
								<h3>{ currentEvent.event.title }</h3>
								<span className="fc-event-info--date">
									{ moment( currentEvent.event.start ).format(
										'MMMM DD, YYYY @ H:mmA'
									) }
								</span>
								<span className="fc-event-info--status">
									<Dashicon icon="welcome-write-blog" />
									{ currentEvent.event.extendedProps.status }
								</span>

								<div className="fc-event-info--actions">
									<Button
										isLink
										onClick={ () => {
											this.setState( {
												isDatePickerOpen: true,
											} );
										} }
									>
										{ __( 'Reschedule', 'iceberg' ) }
									</Button>
									<Button
										isLink
										href={ addQueryArgs( 'post.php', {
											post:
												currentEvent.event.extendedProps
													.ID,
											action: 'edit',
										} ) }
									>
										{ __( 'Edit', 'iceberg' ) }
									</Button>
									<Button
										isLink
										href={ addQueryArgs(
											currentEvent.event.extendedProps.guid,
											{
												preview: 'true',
											}
										) }
									>
										{ __( 'Preview', 'iceberg' ) }
									</Button>
								</div>
							</Fragment>
						) }

						{ isDatePickerOpen && (
							<Fragment>
								<Button
									isLink
									icon="arrow-left-alt"
									onClick={ () => {
										this.setState( {
											isDatePickerOpen: false,
										} );
									} }
								>
									{ __( 'Back', 'iceberg' ) }
								</Button>
								<TimePicker
									currentTime={ currentEvent.event.start }
									onChange={ ( date ) => {
										this.setState( {
											datePickerData: date,
										} );
									} }
									is12Hour={ true }
								/>
								<Button
									isPrimary
									onClick={ () => {
										reSchedule(
											currentEvent.event.extendedProps.ID,
											this.state.datePickerData,
											postType
										);

										this.setState( { anchorRef: null } );
									} }
								>
									{ __( 'Reschedule', 'iceberg' ) }
								</Button>
							</Fragment>
						) }
					</Popover>
				) }
			</Fragment>
		);
	}
}

export default compose( [
	withViewportMatch( { isMobile: '< small' } ),
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
