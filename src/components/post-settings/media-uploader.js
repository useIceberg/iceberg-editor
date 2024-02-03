/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';
import { Fragment, Component } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	withSpokenMessages,
	Button,
	DropZone,
	ResponsiveWrapper,
} from '@wordpress/components';

class MediaUploader extends Component {
	render() {
		const { screen, onUpdateImage, onDropImage, seoMetaData } = this.props;

		const getImageID = get( seoMetaData, [ screen, 'image' ], '' );

		const getImageSrc = get( seoMetaData, [ screen, 'image_src' ], '' );

		const getImageSize = get( seoMetaData, [ screen, 'image_size' ], '' );

		return (
			<Fragment>
				<div className="post-settings__social-media-image post-settings__featured-image">
					<MediaUploadCheck>
						<MediaUpload
							title={ __(
								'Add ' + screen + ' image',
								'iceberg'
							) }
							onSelect={ ( image ) => {
								onUpdateImage( screen, 'image', image.id );
								onUpdateImage( screen, 'image_src', image.url );
								onUpdateImage( screen, 'image_size', {
									width: image.width,
									height: image.height,
								} );
							} }
							unstableFeaturedImageFlow
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<div className="editor-post-featured-image__container">
									<Button
										className={
											! getImageID
												? 'editor-post-featured-image__toggle'
												: 'editor-post-featured-image__preview'
										}
										onClick={ open }
										aria-label={
											! getImageID
												? null
												: __(
														'Edit or update the image'
												  )
										}
									>
										{ getImageID && (
											<ResponsiveWrapper
												naturalWidth={
													getImageSize.width
												}
												naturalHeight={
													getImageSize.height
												}
												isInline
											>
												<img
													src={ getImageSrc }
													alt=""
												/>
											</ResponsiveWrapper>
										) }

										{ ! getImageID
											? __(
													'Add ' + screen + ' image',
													'iceberg'
											  )
											: null }
									</Button>
									<DropZone onFilesDrop={ onDropImage } />
								</div>
							) }
							value={ getImageID }
						/>
					</MediaUploadCheck>
					{ getImageID && (
						<MediaUploadCheck>
							<Button
								icon="trash"
								onClick={ () => {
									onUpdateImage( screen, 'image', '' );
									onUpdateImage( screen, 'image_src', '' );
									onUpdateImage( screen, 'image_size', {} );
								} }
								isLink
								isDestructive
							/>
						</MediaUploadCheck>
					) }
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withDispatch(
		( dispatch, { noticeOperations, onUpdateImage }, { select } ) => {
			return {
				onDropImage( filesList ) {
					select( 'core/block-editor' )
						.getSettings()
						.mediaUpload( {
							allowedTypes: [ 'image' ],
							filesList,
							onFileChange( [ image ] ) {
								onUpdateImage( screen, 'image', image.id );
								onUpdateImage( screen, 'image_src', image.url );
								onUpdateImage( screen, 'image_size', {
									width: image.width,
									height: image.height,
								} );
							},
							onError( message ) {
								noticeOperations.removeAllNotices();
								noticeOperations.createErrorNotice( message );
							},
						} );
				},
			};
		}
	),
	withSpokenMessages,
] )( MediaUploader );
