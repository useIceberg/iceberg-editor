/**
 * External dependencies
 */
import { map, merge } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { Component, Fragment } from '@wordpress/element';
import { compose, withInstanceId } from '@wordpress/compose';
import {
	withSpokenMessages,
	Modal,
	CheckboxControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import Section from './section';

class AccessControl extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			themeSettings: {},
		};
	}

	componentDidMount() {
		this.setState( { themeSettings: this.props.themeSettings } );
	}

	render() {
		const { closeModal, updateThemeSettings } = this.props;
		const { themeSettings } = this.state;
		const { userRoles } = window.icebergSettings;

		return (
			<Fragment>
				<Modal
					className="components-iceberg-options-modal"
					title={ __( 'Iceberg access control', 'iceberg' ) }
					onRequestClose={ closeModal }
				>
					<Section title={ __( 'User roles', 'iceberg' ) }>
						<Fragment>
							<p className="license-help">
								{ __(
									'Set iceberg as default editor for specific user roles.',
									'iceberg'
								) }
							</p>
							{ userRoles &&
								map( userRoles, ( roleName, role ) => {
									return (
										<CheckboxControl
											label={ roleName }
											value={ role }
											checked={
												themeSettings?.roles?.[ role ]
											}
											onChange={ ( value ) => {
												const updatedSettings = merge(
													{},
													themeSettings,
													{
														roles: {
															[ role ]: value,
														},
													}
												);
												this.setState( {
													themeSettings: updatedSettings,
												} );
												updateThemeSettings(
													updatedSettings
												);
											} }
										/>
									);
								} ) }
						</Fragment>
					</Section>
				</Modal>
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const { getThemeSettings } = select( 'iceberg-settings' );

		return {
			themeSettings: getThemeSettings(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setThemeSettings } = dispatch( 'iceberg-settings' );

		return {
			updateThemeSettings( settings ) {
				setThemeSettings( settings );
			},
		};
	} ),
	withSpokenMessages,
] )( AccessControl );
