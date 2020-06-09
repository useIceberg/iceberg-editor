/**
 * Internal dependencies
 */
import { download } from './file';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, Component } from '@wordpress/element';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose, withInstanceId } from '@wordpress/compose';
import {
	MenuGroup,
	MenuItem,
	BaseControl,
	RangeControl,
	SelectControl,
	withSpokenMessages,
	Button,
} from '@wordpress/components';

class ThemeImportExport extends Component {
	constructor() {
		super( ...arguments );

		this.exportAsJSON = this.exportAsJSON.bind( this );
	}

	exportAsJSON() {
		const { themeSettings } = this.props;

		//do export magic
		const fileContent = JSON.stringify( themeSettings, null, 2 );

		const fileName = 'iceberg-theme-settings.json';
		download( fileName, fileContent, 'application/json' );
	}

	render() {
		const {
			onToggle,
			onClose,
			themeSettings,
			loadConfig,
			isEditingTypography,
			updateState,
		} = this.props;

		return (
			<Fragment>
				<div className="components-iceberg-theme-switcher__import-export">
					<BaseControl>
						{ __( 'Export theme settings', 'iceberg' ) }
					</BaseControl>
					<Button
						isSecondary
						onClick={ () => {
							this.exportAsJSON();
						} }
					>
						{ __( 'Export', 'iceberg' ) }
					</Button>

					<BaseControl>{ __( 'Import', 'iceberg' ) }</BaseControl>
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withInstanceId,
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
] )( ThemeImportExport );
