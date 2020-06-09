/**
 * Internal dependencies
 */
import { download, importThemeSettings } from './file';
import icons from '../icons';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, Component } from '@wordpress/element';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose, withInstanceId } from '@wordpress/compose';
import {
	BaseControl,
	MenuGroup,
	MenuItem,
	DropZoneProvider,
	DropZone,
	withSpokenMessages,
	Button,
} from '@wordpress/components';

class ThemeImportExport extends Component {
	constructor() {
		super( ...arguments );

		this.exportAsJSON = this.exportAsJSON.bind( this );
		this.onFilesUpload = this.onFilesUpload.bind( this );
		this.state = {
			isImported: false,
		};
	}

	exportAsJSON() {
		const { themeSettings } = this.props;

		//do export magic
		const fileContent = JSON.stringify( themeSettings, null, 2 );

		const fileName = 'iceberg-theme-settings.json';
		download( fileName, fileContent, 'application/json' );
	}

	onFilesUpload( files ) {
		const { updateThemeSettings, loadConfig, updateState } = this.props;
		let file = files[ 0 ];

		if ( files.target ) {
			file = event.target.files[ 0 ];
		}

		if ( ! file ) {
			return;
		}

		importThemeSettings( file )
			.then( ( importedSettings ) => {
				updateState( 'themeSettings', importedSettings );
				updateState( 'theme', importedSettings.theme );
				updateThemeSettings( importedSettings );
				this.setState( { isImported: true } );

				// reload variables
				loadConfig( importedSettings.theme, importedSettings );
			} )
			.catch( () => {
				this.setState( { error: true } );
			} );
	}

	render() {
		const { onToggle, onClose } = this.props;

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
					<DropZoneProvider>
						<div>
							{ __(
								'Drag and drop iceberg-theme-settings.json file in here.',
								'iceberg'
							) }
							<DropZone
								onFilesDrop={ this.onFilesUpload }
								onHTMLDrop={ this.onFilesUpload }
								onDrop={ this.onFilesUpload }
							/>
						</div>
					</DropZoneProvider>
				</div>
				<MenuGroup>
					<MenuItem
						className="components-iceberg-theme-switcher__back"
						onClick={ () => {
							onClose();
							onToggle();
							onToggle();

							// focus manually to fix closing outside bug
							document
								.querySelector(
									'.components-iceberg-theme-switcher__content .components-popover__content'
								)
								.focus();
						} }
					>
						{ __( 'Back to editor themes', 'iceberg' ) }
						{ icons.back }
					</MenuItem>
				</MenuGroup>
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
