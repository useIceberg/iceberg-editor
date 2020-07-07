/*global icebergSettings*/

/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import UpdateTitleHeight from '../utils/title-height';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Fragment, Component, render } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	withSpokenMessages,
	DropdownMenu,
	Button,
	DropZone,
	MenuGroup,
	MenuItem,
	BaseControl,
} from '@wordpress/components';

class PostSettings extends Component {
	constructor() {
		super(...arguments);

		this.addPostSettings = this.addPostSettings.bind(this);

		this.state = {
			isEnabled: false,
			isSettingsOpen: false,
		};
	}

	componentDidMount() {
		this.addPostSettings();
	}

	componentDidUpdate() {
		this.addPostSettings();
	}

	addPostSettings() {
		const { isActive, toggleEditorMode, postType } = this.props;

		if (!postType) {
			return null;
		}

		const POPOVER_PROPS = {
			className:
				'components-iceberg-popover components-iceberg-post-settings__content',
			position: 'bottom left',
		};

		const TOGGLE_PROPS = {
			tooltipPosition: 'bottom',
		};

		const MoreMenuDropdown = () => {
			return (
				<Fragment>
					<DropdownMenu
						className="components-iceberg-post-settings__trigger"
						icon="admin-generic"
						label={__('Iceberg options', 'iceberg')}
						popoverProps={POPOVER_PROPS}
						toggleProps={TOGGLE_PROPS}
					>
						{({ onClose }) => (
							<Fragment>
								<h3>{ __('Post Settings', 'iceberg') }</h3>
								<div className="post-settings__featured-image">
									<MediaUploadCheck>
										<MediaUpload
											onSelect={(media) => console.log('selected ' + media.length)}
											allowedTypes={['image']}
											// value={mediaId}
											render={({ open }) => (
												<Fragment>
													<Button onClick={open}>
														{__('Set Featured Image', 'iceberg')}
													</Button>
													<DropZone onFilesDrop={()=>{
														
													}} />
												</Fragment>
											)}
										/>
									</MediaUploadCheck>
								</div>
							</Fragment>
						)}
					</DropdownMenu>
				</Fragment>
			);
		};

		const wrapper = document.querySelector('.edit-post-header__settings');

		if (!wrapper.classList.contains('iceberg-post-settings') && isActive) {
			wrapper.classList.add('iceberg-post-settings');
			wrapper.insertAdjacentHTML(
				'beforeend',
				'<div id="components-iceberg-post-settings"></div>'
			);

			render(
				<MoreMenuDropdown />,
				document.getElementById('components-iceberg-post-settings')
			);
		} else if (
			wrapper.classList.contains('iceberg-post-settings') &&
			!isActive
		) {
			document.getElementById('components-iceberg-post-settings').remove();
			wrapper.classList.remove('iceberg-post-settings');
		}
	}

	render() {
		return false;
	}
}

export default compose([
	withSelect((select) => {
		const { getCurrentPostType } = select('core/editor');
		const { getPostType } = select('core');

		return {
			postType: getPostType(getCurrentPostType()),
		};
	}),
	withDispatch((dispatch) => ({
		toggleEditorMode() {
			dispatch('core/edit-post').toggleFeature('icebergWritingMode');

			setTimeout(function () {
				UpdateTitleHeight();
			}, 100);

			// Reset post meta
			dispatch('core/editor').editPost({
				meta: {
					_iceberg_editor_remember: false,
				},
			});

			dispatch('core/editor').savePost();
		},
	})),
	withSpokenMessages,
])(PostSettings);
