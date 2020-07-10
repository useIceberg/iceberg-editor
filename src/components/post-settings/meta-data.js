/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import MediaUploader from './media-uploader';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { Fragment, Component } from '@wordpress/element';
import { count as wordCount } from '@wordpress/wordcount';
import {
	withSpokenMessages,
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
					'Recommended: <strong>%1$s</strong> characters. You’ve used <strong>%2$s</strong>',
					'iceberg'
				),
				suggested,
				count > suggested
					? '<span class="to-red">' + count + '</span>'
					: '<span>' + count + '</span>'
			),
		};
	}

	render() {
		const {
			screen,
			postSlug,
			permalinkParts,
			postTitle,
			postExcerpt,
		} = this.props;
		const { prefix, suffix } = permalinkParts;
		const { seoMetaData } = this.state;

		const getTitle = get( seoMetaData, [ screen, 'title' ], '' );

		const getDescription = get(
			seoMetaData,
			[ screen, 'description' ],
			''
		);

		const getImageSrc = get( seoMetaData, [ screen, 'image_src' ], '' );

		return (
			<Fragment>
				{ [ 'twitter', 'facebook' ].includes( screen ) && (
					<MediaUploader
						onUpdateImage={ this.updateSeoMetaData }
						screen={ screen }
						seoMetaData={ seoMetaData }
					/>
				) }
				<TextControl
					label={ __( screen + ' Title', 'iceberg' ) }
					placeholder={ postTitle }
					value={ getTitle }
					onChange={ ( title ) => {
						this.updateSeoMetaData( screen, 'title', title );
					} }
				/>

				{ getTitle && screen === 'meta' && (
					<p
						className="components-base-control__help"
						dangerouslySetInnerHTML={ this.getDescription(
							70,
							'meta',
							'title'
						) }
					/>
				) }

				<TextareaControl
					label={ __( screen + ' Description', 'iceberg' ) }
					placeholder={ postExcerpt }
					value={ getDescription }
					onChange={ ( description ) => {
						this.updateSeoMetaData(
							screen,
							'description',
							description
						);
					} }
				/>

				{ getDescription && screen === 'meta' && (
					<p
						className="components-base-control__help"
						dangerouslySetInnerHTML={ this.getDescription(
							156,
							'meta',
							'description'
						) }
					/>
				) }
				{ screen === 'meta' && (
					<Fragment>
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

						<div className="components-iceberg-seo-preview">
							<div className="iceberg-seo-preview-title">
								{ getTitle ? getTitle : postTitle }
							</div>
							<div className="iceberg-seo-preview-link">
								{ prefix ? prefix : null }
								{ postSlug }
								{ suffix ? suffix : null }
							</div>
							<div className="iceberg-seo-preview-desc">
								{ getDescription
									? getDescription
									: postExcerpt }
							</div>
						</div>
					</Fragment>
				) }

				{ [ 'twitter', 'facebook' ].includes( screen ) && (
					<Fragment>
						<label className="components-base-control__label">
							{ __( 'Preview', 'iceberg' ) }
						</label>

						<div
							className={
								'components-iceberg-' + screen + '-preview'
							}
						>
							<div className="iceberg-seo-preview-image">
								{ getImageSrc && (
									<div
										style={ {
											backgroundImage:
												'url(' + getImageSrc + ')',
										} }
									></div>
								) }
							</div>
							<div className="iceberg-seo-preview-content">
								<div className="iceberg-seo-preview-title">
									{ getTitle ? getTitle : postTitle }
								</div>
								<div className="iceberg-seo-preview-desc">
									{ getDescription
										? getDescription
										: postExcerpt }
								</div>
								<div className="iceberg-seo-preview-link">
									{ prefix ? prefix : null }
									{ postSlug }
									{ suffix ? suffix : null }
								</div>
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
		const { getEditedPostAttribute } = select( 'core/editor' );

		return {
			metaData: getEditedPostAttribute( 'meta' )._iceberg_seo_metadata,
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
