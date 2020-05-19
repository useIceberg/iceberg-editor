/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Fragment, Component } from '@wordpress/element';
import {
	withSpokenMessages,
	DropdownMenu,
	BaseControl,
	TextControl,
	TextareaControl,
	Button,
} from '@wordpress/components';

class FeedbackPopover extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			name: '',
			message: '',
			sent: false,
		};
	}

	componentDidMount() {
		const element = document.querySelector(
			'.components-iceberg-feedback'
		);
		if ( element ) {
			element.parentElement.style.display = 'block';
		}
	}

	render() {
		const { sendFeedback, themeSettings } = this.props;
		const { name, message, sent } = this.state;

		const POPOVER_PROPS = {
			className:
				'components-iceberg-feedback__content components-iceberg-popover',
			position: 'top right',
			focusOnMount: 'container',
		};

		const TOGGLE_PROPS = {
			tooltipPosition: 'bottom',
			children: __( 'Beta', 'iceberg' ),
		};

		return (
			<Fragment>
				<div className="components-iceberg-feedback">
					<DropdownMenu
						className="components-iceberg-feedback__trigger"
						label={ __( 'Send feedback', 'iceberg' ) }
						icon={ null }
						popoverProps={ POPOVER_PROPS }
						toggleProps={ TOGGLE_PROPS }
					>
						{ () => (
							<Fragment>
								{ ! sent ? (
									<Fragment>
										<BaseControl>
											{ __(
												'Tell us how we can make Iceberg work better for you. We love feedback.',
												'iceberg'
											) }
										</BaseControl>
										<TextControl
											label={ __( 'Name', 'iceberg' ) }
											value={ name }
											onChange={ ( getName ) => {
												this.setState( {
													name: getName,
												} );
											} }
										/>
										<TextareaControl
											label={ __(
												'Feedback',
												'iceberg'
											) }
											value={ message }
											onChange={ ( getMessage ) => {
												this.setState( {
													message: getMessage,
												} );
											} }
										/>
										<Button
											isPrimary
											isSmall
											onClick={ () => {
												sendFeedback(
													name,
													message +
														'\nEditor theme:' +
														themeSettings.theme
												);
												this.setState( {
													sent: true,
													name: '',
													message: '',
												} );
											} }
										>
											{ __( 'Send', 'iceberg' ) }
										</Button>
									</Fragment>
								) : (
									<p>
										{ __(
											'Thank you for providing feedback!',
											'iceberg'
										) }
									</p>
								) }
							</Fragment>
						) }
					</DropdownMenu>
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		return {
			themeSettings: select( 'iceberg-settings' ).getThemeSettings(),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		sendFeedback( name, message ) {
			dispatch( 'iceberg-settings' ).sendBetaFeedback( name, message );
		},
	} ) ),
	withSpokenMessages,
] )( FeedbackPopover );
