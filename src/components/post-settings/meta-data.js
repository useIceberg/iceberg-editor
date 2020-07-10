/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { Fragment, Component } from '@wordpress/element';
import { count as wordCount } from '@wordpress/wordcount';
import { safeDecodeURIComponent } from '@wordpress/url';
import {
	withSpokenMessages,
	MenuGroup,
	MenuItem,
	TextControl,
	TextareaControl,
} from '@wordpress/components';

class MetaData extends Component {
	constructor( { metaData } ) {
		super( ...arguments );

		this.updateSeoMetaData = this.updateSeoMetaData.bind( this );
		this.getDescription = this.getDescription.bind( this );

		this.state = {
			seoMetaData: metaData ? JSON.parse( metaData ) : {},
		};
	}

	updateSeoMetaData( category, key, value ) {
		const getMetaData = this.state.seoMetaData;

		if ( typeof getMetaData[ category ] === 'undefined' ) {
			getMetaData[ category ] = {};
		}

		getMetaData[ category ][ key ] = value;

		this.setState( {
			seoMetaData: getMetaData,
		} );

		this.props.updateMetaData( getMetaData );
	}

	getDescription( suggested, category, key ) {
		const getValue = get( this.state.seoMetaData, [ category, key ], '' );

		const count = wordCount( getValue, 'characters_including_spaces' );

		return {
			__html: sprintf(
				// translators: 1: Suggested count, 2: Value characters count
				__(
					'Recommended: <strong>%1$s</strong> characters. You’ve used <strong><span>%2$s</span></strong>',
					'iceberg'
				),
				suggested,
				count
			),
		};
	}

	render() {
		const { screen, postSlug, permalinkParts } = this.props;
		const { prefix, suffix } = permalinkParts;
		const { seoMetaData } = this.state;
		return (
			<Fragment>
				{ screen === 'meta' && (
					<Fragment>
						<TextControl
							label={ __( 'Meta Title', 'iceberg' ) }
							value={ get(
								seoMetaData,
								[ 'meta', 'title' ],
								''
							) }
							onChange={ ( title ) => {
								this.updateSeoMetaData(
									'meta',
									'title',
									title
								);
							} }
						/>
						<p
							className="components-base-control__help"
							dangerouslySetInnerHTML={ this.getDescription(
								70,
								'meta',
								'title'
							) }
						/>

						<TextareaControl
							label={ __( 'Meta Description', 'iceberg' ) }
							value={ get(
								seoMetaData,
								[ 'meta', 'description' ],
								''
							) }
							onChange={ ( description ) => {
								this.updateSeoMetaData(
									'meta',
									'description',
									description
								);
							} }
						/>
						<p
							className="components-base-control__help"
							dangerouslySetInnerHTML={ this.getDescription(
								156,
								'meta',
								'description'
							) }
						/>

						<TextControl
							label={ __( 'Canonical URL', 'iceberg' ) }
							value={ get( seoMetaData, [ 'meta', 'url' ], '' ) }
							onChange={ ( url ) => {
								this.updateSeoMetaData( 'meta', 'url', url );
							} }
						/>

						<label className="components-base-control__label">
							{ __( 'Search Engine Result Preview', 'iceberg' ) }
						</label>

						<div className="component-iceberg-seo-preview">
							<div className="iceberg-seo-preview-title">
								{ get( seoMetaData, [ 'meta', 'title' ], '' ) }
							</div>
							<div className="iceberg-seo-preview-link">
								{ prefix ? prefix : null }
								{ postSlug }
								{ suffix ? suffix : null }
							</div>
							<div className="iceberg-seo-preview-desc">
								{ get( seoMetaData, [ 'meta', 'description' ], '' ) }
							</div>
						</div>
					</Fragment>
				) }
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const {
			getCurrentPost,
			getCurrentPostType,
			getEditedPostAttribute,
			getEditedPostSlug,
			getPermalinkParts,
		} = select( 'core/editor' );

		const { getPostType } = select( 'core' );
		const { id, link } = getCurrentPost();

		return {
			metaData: getEditedPostAttribute( 'meta' )._iceberg_seo_metadata,
			postID: id,
			postLink: link,
			postSlug: safeDecodeURIComponent( getEditedPostSlug() ),
			permalinkParts: getPermalinkParts(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { editPost } = dispatch( 'core/editor' );

		return {
			updateMetaData( value ) {
				editPost( {
					meta: {
						_iceberg_seo_metadata: JSON.stringify( value ),
					},
				} );
			},
		};
	} ),
	withSpokenMessages,
] )( MetaData );
