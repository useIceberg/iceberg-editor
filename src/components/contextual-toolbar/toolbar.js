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
import { Component, Fragment, useMemo, createRef } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose, withInstanceId, ifCondition } from '@wordpress/compose';
import { switchToBlockType } from '@wordpress/blocks';
import { BlockFormatControls } from '@wordpress/block-editor';
import {
	withSpokenMessages,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Popover,
	Toolbar,
	ToolbarGroup,
	Slot,
} from '@wordpress/components';

class ContextualToolbar extends Component {
	constructor() {
		super( ...arguments );
		this.onSelectionChange = this.onSelectionChange.bind( this );
		this.onSelectionStart = this.onSelectionStart.bind( this );
		this.onSelectionEnd = this.onSelectionEnd.bind( this );
		this.containerRef = createRef();

		this.state = {
			anchorRef: null,
			isVisible: false,
			isSelecting: false,
		};
	}

	componentDidMount() {
		document.addEventListener( 'selectionchange', this.onSelectionChange );
		document.addEventListener( 'selectstart', this.onSelectionStart );
		document.addEventListener( 'mouseup', this.onSelectionEnd );
	}

	onSelectionStart() {
		this.setState( { isSelecting: true } );
	}

	onSelectionEnd() {
		const { isSelecting } = this.state;

		if ( isSelecting ){
			setTimeout(
				function() {
					this.setState( { isSelecting: false, isVisible: true } );
				}.bind( this ),
				200
			); 
			
		}
	}

	onSelectionChange(event) {
		const selection = window.getSelection();
		const { isSelecting, isVisible } = this.state;
		const range =
			selection.rangeCount > 0 ? selection.getRangeAt( 0 ) : null;
		if ( ! range ) {
			return;
		}
		
		if ( selection.isCollapsed ) {
			this.setState( { isVisible: false, anchorRef: null } );
			return;
		}

		this.setState( { anchorRef: range } );

		return false;
	}

	render() {
		const { isActive, clientId, attributes, onTransform } = this.props;
		const { anchorRef, isVisible } = this.state;

		if ( ! isActive ) {
			return false;
		}

		if ( anchorRef && isVisible ) {
			// console.log( <BlockToolbar /> );
			return (
				<Fragment>
					<Popover
						ref={ this.containerRef }
						className="component-iceberg-contextual-toolbar"
						position="top center"
						focusOnMount={ false }
						anchorRef={ anchorRef }
						onFocusOutside={ ( event ) => {
							const containerElement = document.querySelector(
								'.component-iceberg-contextual-toolbar'
							);
							if (
								containerElement &&
								! containerElement.contains( event.target )
							) {
								this.setState( {
									isVisible: false,
								} );
							}
						} }
					>
						<Toolbar>
							{ [ 'bold', 'italic', 'link' ].map(
								( format ) => (
									<Slot
										name={ `RichText.ToolbarControls.${ format }` }
										key={ format }
									/>
								)
							) }
						</Toolbar>
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
