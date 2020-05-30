/**
 * External dependencies
 */
import classnames from 'classnames';
import { range } from 'lodash';

/**
 * Internal dependencies
 */
// import HeadingLevelIcon from './heading-level-icon';
// import icons from '../icons';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { getRectangleFromRange } from '@wordpress/dom';
import { Component, Fragment, useMemo } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose, withInstanceId, ifCondition } from '@wordpress/compose';
import { switchToBlockType } from '@wordpress/blocks';
import { BlockToolbar } from '@wordpress/block-editor';
import {
	withSpokenMessages,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Popover,
} from '@wordpress/components';

class ContextualToolbar extends Component {
	constructor() {
		super( ...arguments );
		this.onSelectionChange = this.onSelectionChange.bind( this );

		this.state = {
			anchorRef: null,
			isVisible: false,
		};
	}

	componentDidMount() {
		document.addEventListener( 'selectionchange', this.onSelectionChange );
	}

	onSelectionChange(){
		const selection = window.getSelection();
		const range =
			selection.rangeCount > 0 ? selection.getRangeAt( 0 ) : null;
		if ( ! range ) {
			return;
		}

		if ( selection.isCollapsed ) {
			return;
		}

		this.setState( { anchorRef: range, isVisible: true } );

		return false;
	}

	render() {
		const { isActive, clientId, attributes, onTransform } = this.props;
		const { anchorRef, isVisible } = this.state;

		if ( ! isActive ) {
			return false;
		}

		if ( anchorRef && isVisible ) {
			console.log( anchorRef );
			return (
				<Fragment>
					<Popover
						anchorRef={ anchorRef }
						onClose={ () => {
							this.setState( {
								isVisible: false,
							} );
						} }
					>
						asdf
						{ /* <BlockToolbar hideDragHandle /> */ }
					</Popover>
				</Fragment>
			);
		}

		return false;
	}
}

export default compose( [
	withInstanceId,
	withSelect( ( select ) => ( {
		isActive: select( 'core/edit-post' ).isFeatureActive(
			'icebergWritingMode'
		),
		isEnabled: select( 'iceberg-settings' ).isEditorPanelEnabled(
			'headingIndicators'
		),
	} ) ),
	withDispatch( ( dispatch ) => ( {
		updateBlockAttributes: dispatch( 'core/block-editor' )
			.updateBlockAttributes,
		onTransform( clientId, blocks, name ) {
			dispatch( 'core/block-editor' ).replaceBlocks(
				clientId,
				switchToBlockType( blocks, name )
			);
		},
	} ) ),
	// ifCondition( ( props ) => {
	// 	return props.isEnabled;
	// } ),
	withSpokenMessages,
] )( ContextualToolbar );
