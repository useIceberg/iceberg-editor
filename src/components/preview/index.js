/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose, ifCondition } from '@wordpress/compose';
import { displayShortcut, rawShortcut } from '@wordpress/keycodes';
import { Fragment, Component } from '@wordpress/element';
import {
	withSpokenMessages,
	MenuItem,
	Modal,
	KeyboardShortcuts,
} from '@wordpress/components';

class LivePreview extends Component {
	constructor() {
		super( ...arguments );

		this.openPreview = this.openPreview.bind( this );

		this.state = {
			isOpen: false,
		};
	}

	openPreview() {
		const { isDraft, savePost, autosave, isAutosaveable } = this.props;
		const { isOpen } = this.state;
		// Request an autosave. This happens asynchronously and causes the component
		// to update when finished.
		if ( isAutosaveable && ! isOpen ) {
			if ( isDraft ) {
				savePost( { isPreview: true } );
			} else {
				autosave( { isPreview: true } );
			}
		}

		setTimeout( () => {
			this.setState( { isOpen: ! isOpen } );
		}, 100 );
	}

	render() {
		const { previewLink, isMenu } = this.props;
		const { isOpen } = this.state;
		return (
			<Fragment>
				{ ! isMenu && (
					<KeyboardShortcuts
						bindGlobal
						shortcuts={ {
							[ rawShortcut.primaryShift( 'p' ) ]: () => {
								this.openPreview();
							},
						} }
					/>
				) }

				{ isMenu && (
					<MenuItem
						className="components-iceberg-more-menu__preview"
						shortcut={ displayShortcut.primaryShift( 'p' ) }
						onClick={ () => {
							this.openPreview();
						} }
					>
						{ __( 'Preview', 'iceberg' ) }
					</MenuItem>
				) }

				{ isOpen && (
					<Modal
						className="components-iceberg-preview-modal"
						title={ __( 'Preview', 'block-options' ) }
						onRequestClose={ () => {
							this.openPreview();
						} }
						shouldCloseOnClickOutside={ false }
					>
						<iframe
							src={ previewLink }
							title={ __( 'Preview', 'block-options' ) }
							target={ __( 'Preview', 'block-options' ) }
						></iframe>
					</Modal>
				) }
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select, { forcePreviewLink, forceIsAutosaveable } ) => {
		const {
			getEditedPostAttribute,
			isEditedPostSaveable,
			isEditedPostAutosaveable,
			getEditedPostPreviewLink,
		} = select( 'core/editor' );
		const { getPostType } = select( 'core' );

		const previewLink = getEditedPostPreviewLink();
		const postType = getPostType( getEditedPostAttribute( 'type' ) );

		return {
			isViewable: get( postType, [ 'viewable' ], false ),
			isSaveable: isEditedPostSaveable(),
			isAutosaveable: forceIsAutosaveable || isEditedPostAutosaveable(),
			previewLink:
				forcePreviewLink !== undefined ? forcePreviewLink : previewLink,
			isDraft:
				[ 'draft', 'auto-draft' ].indexOf(
					getEditedPostAttribute( 'status' )
				) !== -1,
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		autosave: dispatch( 'core/editor' ).autosave,
		savePost: dispatch( 'core/editor' ).savePost,
	} ) ),
	ifCondition( ( { isViewable } ) => isViewable ),
	withSpokenMessages,
] )( LivePreview );
