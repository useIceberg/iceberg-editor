/*global icebergSettings*/

/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import FlatTermSelector from './flat-term-selector';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose, withInstanceId } from '@wordpress/compose';
import { Fragment, Component, render } from '@wordpress/element';
import { safeDecodeURIComponent, cleanForSlug } from '@wordpress/url';
import {
	PostFeaturedImageCheck,
	PostFeaturedImage,
	PostSlugCheck,
	PostTaxonomiesCheck,
} from '@wordpress/editor';
import {
	withSpokenMessages,
	DropdownMenu,
	Modal,
	Button,
	TextControl,
	ExternalLink,
	MenuItem,
	BaseControl,
} from '@wordpress/components';

class PostSettings extends Component {
	constructor( { postSlug, postTitle, postID } ) {
		super( ...arguments );

		this.addPostSettings = this.addPostSettings.bind( this );
		this.setSlug = this.setSlug.bind( this );

		this.state = {
			isEnabled: false,
			isSettingsOpen: false,
			editedSlug:
				safeDecodeURIComponent( postSlug ) ||
				cleanForSlug( postTitle ) ||
				postID,
		};
	}

	componentDidMount() {
		this.addPostSettings();
	}

	componentDidUpdate() {
		this.addPostSettings();
	}

	onRequestClose() {
		const { isSettingsOpen } = this.state;

		this.setState( {
			isSettingsOpen: ! isSettingsOpen,
		} );

		if ( isSettingsOpen ) {
			this.props.closePostSettings();
		}
	}

	setSlug( event ) {
		const { postSlug, onUpdateSlug } = this.props;
		const { value } = event.target;

		const editedSlug = cleanForSlug( value );

		if ( editedSlug === postSlug ) {
			return;
		}

		onUpdateSlug( editedSlug );
	}

	addPostSettings() {
		const { isActive } = this.props;

		const MoreMenuDropdown = () => {
			return (
				<Fragment>
					<Button
						className="components-iceberg-post-settings__trigger"
						icon="admin-generic"
						onClick={ () => {
							this.onRequestClose();
						} }
					/>
				</Fragment>
			);
		};

		const wrapper = document.querySelector( '.edit-post-header__settings' );

		if (
			! wrapper.classList.contains( 'iceberg-post-settings' ) &&
			isActive
		) {
			wrapper.classList.add( 'iceberg-post-settings' );
			wrapper.insertAdjacentHTML(
				'beforeend',
				'<div id="components-iceberg-post-settings"></div>'
			);

			render(
				<MoreMenuDropdown />,
				document.getElementById( 'components-iceberg-post-settings' )
			);
		} else if (
			wrapper.classList.contains( 'iceberg-post-settings' ) &&
			! isActive
		) {
			document
				.getElementById( 'components-iceberg-post-settings' )
				.remove();
			wrapper.classList.remove( 'iceberg-post-settings' );
		}
	}

	render() {
		const { isSettingsOpen } = this.state;
		const { postType, postLink } = this.props;

		if ( ! postType ) {
			return null;
		}
		return (
			<Fragment>
				{ isSettingsOpen && (
					<Modal
						title={ __( 'Post Settings', 'iceberg' ) }
						className="components-iceberg-modal components-iceberg-post-settings__content"
						overlayClassName="components-iceberg-post-settings__overlay"
						onRequestClose={ ( event ) => {
							if (
								! event.relatedTarget ||
								! event.relatedTarget.classList.contains(
									'media-modal'
								)
							) {
								this.onRequestClose();
							}
						} }
					>
						<div className="post-settings__featured-image">
							<PostFeaturedImageCheck>
								<PostFeaturedImage />
							</PostFeaturedImageCheck>

							<TextControl
								label={
									get(
										postType,
										[ 'label', 'name' ],
										'Post'
									) +
									' ' +
									__( 'Slug', 'iceberg' )
								}
								value={ this.state.editedSlug }
								onChange={ ( event ) =>
									this.setState( {
										editedSlug: event.target.value,
									} )
								}
								onBlur={ this.setSlug }
							/>
							<div className="edit-post-post-link__preview-link-container">
								<ExternalLink
									className="edit-post-post-link__link"
									href={ postLink }
									target="_blank"
								>
									{ postLink }
								</ExternalLink>
							</div>
						</div>
						<PostTaxonomiesCheck>
							<FlatTermSelector slug={ 'post_tag' } />
						</PostTaxonomiesCheck>
					</Modal>
				) }
			</Fragment>
		);
	}
}

export default compose([
	withSelect((select) => {
		const {
			getCurrentPost,
			getCurrentPostType,
			getEditedPostAttribute,
		} = select( 'core/editor' );

		const { getPostType } = select('core');
		const { id, link } = getCurrentPost();

		return {
			postType: getPostType( getCurrentPostType() ),
			postSlug: getEditedPostAttribute( 'slug' ),
			postTitle: getEditedPostAttribute( 'title' ),
			postLink: link,
			postID: id,
		};
	}),
	withDispatch((dispatch) => {
		const { editPost } = dispatch( 'core/editor' );

		return {
			closePostSettings() {
				dispatch( 'core/editor' ).savePost();
			},
			onUpdateSlug( slug ) {
				editPost( { slug } );
			},
		};
	}),
	withSpokenMessages,
])(PostSettings);
