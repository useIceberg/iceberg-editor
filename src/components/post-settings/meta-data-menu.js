/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { Fragment, Component } from '@wordpress/element';
import { withSpokenMessages, MenuGroup, MenuItem } from '@wordpress/components';

class MetaDataMenu extends Component {
	render() {
		const { switchView } = this.props;

		return (
			<Fragment>
				<MenuGroup className="components-iceberg-post-settings__metadata-menu">
					<MenuItem
						icon="arrow-right-alt2"
						info={ __(
							'Extra content for search engines',
							'iceberg'
						) }
						onClick={ () => {
							switchView( 'meta', __( 'Meta Data', 'iceberg' ) );
						} }
					>
						{ __( 'Meta Data', 'iceberg' ) }
					</MenuItem>

					<MenuItem
						icon="arrow-right-alt2"
						info={ __(
							'Customise structured data for Twitter',
							'iceberg'
						) }
						onClick={ () => {
							switchView(
								'twitter',
								__( 'Twitter Card', 'iceberg' )
							);
						} }
					>
						{ __( 'Twitter Card', 'iceberg' ) }
					</MenuItem>

					<MenuItem
						icon="arrow-right-alt2"
						info={ __( 'Customise Open Graph data', 'iceberg' ) }
						onClick={ () => {
							switchView(
								'facebook',
								__( 'Facebook Card', 'iceberg' )
							);
						} }
					>
						{ __( 'Facebook Card', 'iceberg' ) }
					</MenuItem>
				</MenuGroup>
			</Fragment>
		);
	}
}

export default compose( [ withSpokenMessages ] )( MetaDataMenu );
