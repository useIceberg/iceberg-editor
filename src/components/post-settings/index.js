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
import {
	PostFeaturedImageCheck,
	PostFeaturedImage
} from '@wordpress/editor';
import {
	withSpokenMessages,
	DropdownMenu,
	Modal,
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

	onRequestClose(){
		const { isSettingsOpen } = this.state;
		
		this.setState( {
			isSettingsOpen: ! isSettingsOpen,
		} );

		if ( isSettingsOpen ) {
			this.props.closePostSettings();
		}
	}

	addPostSettings() {
		const { isActive } = this.props;

		const MoreMenuDropdown = () => {
			return (
				<Fragment>
					<Button 
						className="components-iceberg-post-settings__trigger" 
						icon="admin-generic"
						onClick={ ()=>{
							this.onRequestClose();
						} }
					/>
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
		const { isSettingsOpen } = this.state;

		return (
			<Fragment>
				{ isSettingsOpen && (
					<Modal
						className="components-iceberg-modal components-iceberg-post-settings__content"
						overlayClassName="components-iceberg-post-settings__overlay"
						onRequestClose={ ( event ) => {
							if( ! event.relatedTarget ||  ! event.relatedTarget.classList.contains( 'media-modal' ) ){
								this.onRequestClose();
							}
						} }
					>
						<h3>{ __( 'Post Settings', 'iceberg' ) }</h3>
						<div className="post-settings__featured-image">
							<PostFeaturedImageCheck>
								<PostFeaturedImage />
							</PostFeaturedImageCheck>
						</div>
					</Modal>
				) }
			</Fragment>
		);
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
		closePostSettings() {
			dispatch('core/editor').savePost();
		},
	})),
	withSpokenMessages,
])(PostSettings);
