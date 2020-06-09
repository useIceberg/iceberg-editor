/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, Component } from '@wordpress/element';
import { withDispatch } from '@wordpress/data';
import { compose, withInstanceId } from '@wordpress/compose';
import {
	MenuGroup,
	MenuItem,
	BaseControl,
	RangeControl,
	SelectControl,
	withSpokenMessages,
} from '@wordpress/components';

class ThemeImportExport extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			updatedSettings: {},
		};
	}
	componentDidMount() {
		this.setState( { updatedSettings: this.props.themeSettings } );
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

		return <Fragment>asdfasdf</Fragment>;
	}
}

export default compose( [
	withInstanceId,
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
