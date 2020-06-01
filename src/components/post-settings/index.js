/**
 * Internal dependencies
 */
import PostLink from './components/post-link';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import {
	PostFeaturedImage,
	PostFeaturedImageCheck,
	PostSlugCheck,
	PostSlug,
} from '@wordpress/editor';
import { Fragment, Component, render } from '@wordpress/element';
import {
	withSpokenMessages,
	Button,
	DropdownMenu,
	MenuGroup,
	BaseControl,
	TextControl,
} from '@wordpress/components';

class PostSettings extends Component {
	constructor() {
		super( ...arguments );
		this.addPinnedButton = this.addPinnedButton.bind( this );
	}

	componentDidMount() {
		this.addPinnedButton();
	}

	componentDidUpdate() {
		this.addPinnedButton();
	}

	addPinnedButton() {
		const { isActive } = this.props;

		const POPOVER_PROPS = {
			className:
				'components-iceberg-popover components-iceberg-post-settings__content',
			position: 'bottom left',
		};

		const TOGGLE_PROPS = {
			tooltipPosition: 'bottom',
		};

		const PostSettingsPinnedButton = () => {
			return (
				<Fragment>
					<DropdownMenu
						className="components-iceberg-post-settings__trigger"
						icon="admin-generic"
						label={ __( 'Post settings', 'iceberg' ) }
						popoverProps={ POPOVER_PROPS }
						toggleProps={ TOGGLE_PROPS }
					>
						{ ( { onClose } ) => (
							<Fragment>
								<MenuGroup>
									<BaseControl className="components-iceberg-menu-title">
										{ __( 'Post Settings', 'iceberg' ) }
									</BaseControl>
									<PostFeaturedImageCheck>
										<PostFeaturedImage />
									</PostFeaturedImageCheck>
									<PostLink />
								</MenuGroup>
							</Fragment>
						) }
					</DropdownMenu>
				</Fragment>
			);
		};

		const moreMenuButton = document.querySelector( '.edit-post-more-menu' );
		const postSettingsButton = document.getElementById(
			'components-iceberg-settings-pinned-button'
		);
		if ( isActive && ! postSettingsButton ) {
			moreMenuButton.insertAdjacentHTML(
				'afterend',
				'<div id="components-iceberg-settings-pinned-button"></div>'
			);

			render(
				<PostSettingsPinnedButton />,
				document.getElementById(
					'components-iceberg-settings-pinned-button'
				)
			);
		} else if ( ! isActive && postSettingsButton ) {
			postSettingsButton.remove();
		}
	}

	render() {
		return false;
	}
}

export default compose( [ withSpokenMessages ] )( PostSettings );
