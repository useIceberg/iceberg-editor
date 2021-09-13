/**
 * External dependencies
 */
import { map, merge, assign, get } from 'lodash';

/**
 * Internal dependencies
 */
import defaults from '../theme-editor/default';
import EditorThemes from '../theme-editor/editor-themes';
import ThemeEditor from '../theme-editor';
import icons from '../icons';
import { assignVariables } from './variables';
import difference from './utils/difference';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { addQueryArgs } from '@wordpress/url';
import { withSelect, withDispatch } from '@wordpress/data';
import { Fragment, Component, render } from '@wordpress/element';
import {
	Button,
	Dropdown,
	Tooltip,
	MenuGroup,
	MenuItem,
	withSpokenMessages,
} from '@wordpress/components';

class ThemeSwitcher extends Component {
	constructor() {
		super( ...arguments );
		this.updateState = this.updateState.bind( this );
		this.addControl = this.addControl.bind( this );
		this.onSelect = this.onSelect.bind( this );
		this.onEditTheme = this.onEditTheme.bind( this );
		this.onExitEditTheme = this.onExitEditTheme.bind( this );
		this.loadConfig = this.loadConfig.bind( this );

		this.state = {
			isOpen: false,
			theme: '',
			themeSettings: {},
			isEditorThemeLoaded: false,
			isEditingTheme: false,
			isEditingTypography: false,
		};
	}

	componentDidMount() {
		this.setState( { themeSettings: this.props.themeSettings } );
		this.addControl();
	}

	componentDidUpdate() {
		const { themeSettings } = this.props;

		// Wait for settings to load
		if ( typeof themeSettings.theme === 'undefined' ) {
			return false;
		}

		if ( Object.keys( this.state.themeSettings ).length < 1 ) {
			this.setState( { themeSettings } );
		}

		if (
			! this.state.isEditorThemeLoaded &&
			Object.keys( this.state.themeSettings ).length > 1
		) {
			this.setState( { isEditorThemeLoaded: true } );
		}

		this.addControl();

		const icebergButton = document.querySelector(
			'.components-iceberg-theme-switcher__trigger'
		);

		if ( icebergButton && this.props.isEnabled ) {
			icebergButton.style.visibility = '';
		}

		// Update switcher color
		if ( icebergButton && this.state.themeSettings.theme === 'custom' ) {
			icebergButton.querySelector(
				'.components-iceberg-theme-switcher__palette'
			).style.backgroundImage = `linear-gradient(130deg,${
				typeof EditorThemes[ this.state.theme ] !== 'undefined'
					? EditorThemes[ this.state.theme ].colors.background
					: this.state.themeSettings.colors.background
			} 48.75%, ${
				typeof EditorThemes[ this.state.theme ] !== 'undefined'
					? EditorThemes[ this.state.theme ].colors.accent
					: this.state.themeSettings.colors.accent
			} 50%)`;
		}
	}

	updateState( key, value ) {
		this.setState( { [ key ]: value } );
	}

	addControl() {
		const { isActive, updateThemeSettings, postType } = this.props;
		let { themeSettings } = this.state;

		// Wait for settings to load
		if ( typeof themeSettings.theme === 'undefined' ) {
			return false;
		}

		// Wait for post type information
		if ( typeof postType === 'undefined' ) {
			return false;
		}

		if ( typeof themeSettings.colors === 'undefined' ) {
			themeSettings = assign(
				{ colors: { background: '#444', accent: '#111' } },
				themeSettings
			);
		}

		if ( ! this.state.theme ) {
			this.setState( { theme: themeSettings.theme } );
		}

		const onRequestClose = ( event ) => {
			const closeButton = document.querySelector(
				'.components-iceberg-theme-switcher__trigger'
			);
			const editorWrapper = document.querySelector(
				'.block-editor-writing-flow'
			);

			if (
				closeButton &&
				event &&
				! event.relatedTarget.classList.contains(
					'components-iceberg-theme-switcher__trigger'
				)
			) {
				closeButton.click();
			} else if ( typeof event === 'undefined' ) {
				closeButton.click();
			}

			document.body.classList.remove( 'is-editing-theme' );
			editorWrapper.classList.remove( 'is-editing-theme' );

			// Hide when Theme Switcher is disabled
			if ( ! this.props.isEnabled ) {
				const icebergButton = document.querySelector(
					'.components-iceberg-theme-switcher__trigger'
				);
				if ( icebergButton ) {
					icebergButton.style.visibility = 'hidden';
				}
			}

			this.setState( { isEditingTypography: false } );
			updateThemeSettings( this.state.themeSettings );
		};

		const ButtonControls = () => {
			return (
				<Fragment>
					<Tooltip
						text={ __(
							'Back to all ' +
								get(
									postType,
									[ 'labels', 'name' ],
									'Posts'
								).toLowerCase(),
							'iceberg'
						) }
					>
						<Button
							className="components-iceberg-back-to"
							onClick={ () => {
								window.location.href = addQueryArgs(
									'edit.php',
									{
										post_type: postType.slug,
									}
								);
							} }
						>
							{ icons.caretDown }
						</Button>
					</Tooltip>
					<Dropdown
						className="components-iceberg-theme-switcher__dropdown"
						label={ __( 'Change heading level', 'iceberg' ) }
						contentClassName="components-iceberg-popover components-iceberg-theme-switcher__content"
						popoverProps={ {
							role: 'menu',
							onFocusOutside: ( event ) => {
								onRequestClose( event );
							},
							onClose: ( event ) => {
								onRequestClose( event );
							},
						} }
						position="bottom left"
						renderToggle={ ( { isOpen, onToggle } ) => (
							<Button
								onClick={ () => {
									const editorWrapper = document.querySelector(
										'.block-editor-writing-flow'
									);

									if ( ! isOpen ) {
										document.body.classList.add(
											'is-editing-theme'
										);

										editorWrapper.classList.add(
											'is-editing-theme'
										);
									} else {
										document.body.classList.remove(
											'is-editing-theme'
										);

										editorWrapper.classList.remove(
											'is-editing-theme'
										);
									}

									onToggle();

									this.onExitEditTheme( onToggle );
								} }
								className="components-iceberg-theme-switcher__trigger"
							>
								<span
									className="components-iceberg-theme-switcher__palette"
									style={ {
										backgroundImage: `linear-gradient(130deg,${
											typeof EditorThemes[
												this.state.theme
											] !== 'undefined'
												? EditorThemes[
														this.state.theme
												  ].colors.background
												: this.state.themeSettings
														.colors.background
										} 48.75%, ${
											typeof EditorThemes[
												this.state.theme
											] !== 'undefined'
												? EditorThemes[
														this.state.theme
												  ].colors.accent
												: this.state.themeSettings
														.colors.accent
										} 50%)`,
									} }
								></span>
								{ icons.caretDown }
							</Button>
						) }
						renderContent={ ( { onToggle } ) => (
							<Fragment>
								{ ! this.state.isEditingTheme &&
								! this.state.isEditingTypography ? (
									<Fragment>
										<MenuGroup>
											{ map(
												EditorThemes,
												( theme, key ) => {
													console.log( theme );
													if ( 'custom' !== key ) {
														const themeClassName = `components-iceberg-theme-switcher__palette__${ theme.name
															.split( ' ' )
															.join( '-' )
															.toLowerCase() }`;
														return (
															<MenuItem
																className={
																	themeClassName
																}
																key={ key }
																onClick={ () => {
																	this.onSelect(
																		key,
																		onToggle
																	);

																	// Move checkmark selection
																	render(
																		<span />,
																		document.querySelector(
																			`.components-iceberg-theme-switcher__palette__${ this.state.theme } .components-iceberg-theme-switcher__palette_checkmark`
																		)
																	);

																	render(
																		icons.checkMark,
																		document.querySelector(
																			`.${ themeClassName } .components-iceberg-theme-switcher__palette_checkmark`
																		)
																	);
																} }
															>
																<Fragment>
																	<span
																		className="components-iceberg-theme-switcher__palette"
																		style={ {
																			backgroundImage: `linear-gradient(130deg,${ theme.colors.background } 48.75%, ${ theme.colors.accent } 50%)`,
																		} }
																	></span>
																	{
																		theme.name
																	}
																	<span className="components-iceberg-theme-switcher__palette_checkmark">
																		{ this
																			.state
																			.theme ===
																		key
																			? icons.checkMark
																			: null }
																	</span>
																</Fragment>
															</MenuItem>
														);
													}
												}
											) }
											<MenuItem
												className="components-iceberg-theme-switcher__palette__custom"
												key="custom"
												onClick={ () => {
													this.onEditTheme(
														onToggle,
														'isEditingTheme'
													);

													this.onSelect(
														'custom',
														onToggle
													);
												} }
											>
												<Fragment>
													<span
														className="components-iceberg-theme-switcher__palette"
														style={ {
															backgroundImage: `linear-gradient(130deg,${ this.state.themeSettings.colors.background } 48.75%, ${ this.state.themeSettings.colors.accent } 50%)`,
														} }
													></span>
													{ __(
														'Custom',
														'iceberg'
													) }
													<span className="components-iceberg-theme-switcher__palette_checkmark">
														{ this.state.theme ===
															'custom' ||
														typeof EditorThemes[
															this.state.theme
														] === 'undefined'
															? icons.checkMark
															: icons.color }
													</span>
												</Fragment>
											</MenuItem>
										</MenuGroup>
										<MenuGroup>
											<MenuItem
												className="components-iceberg-theme-switcher__typography"
												onClick={ () => {
													this.onEditTheme(
														onToggle,
														'isEditingTypography'
													);
												} }
											>
												{ __(
													'Edit typography',
													'iceberg'
												) }
												{ icons.typography }
											</MenuItem>
										</MenuGroup>
									</Fragment>
								) : (
									<ThemeEditor
										onToggle={ onToggle }
										loadConfig={ this.loadConfig }
										isEditingTheme={
											this.state.isEditingTheme
										}
										isEditingTypography={
											this.state.isEditingTypography
										}
										updateState={ this.updateState }
										themeSettings={
											this.state.themeSettings
										}
										onClose={ () => {
											this.setState( {
												isEditingTheme: false,
												isEditingTypography: false,
											} );
											this.onExitEditTheme( onToggle );
										} }
									/>
								) }
							</Fragment>
						) }
					/>
				</Fragment>
			);
		};

		const wrapper = document.querySelector( '.edit-post-header__toolbar' );

		if (
			! wrapper.classList.contains( 'iceberg-additional-controls' ) &&
			isActive
		) {
			wrapper.classList.add( 'iceberg-additional-controls' );
			wrapper.insertAdjacentHTML(
				'afterbegin',
				'<div id="components-iceberg-theme-switcher"></div>'
			);

			render(
				<ButtonControls />,
				document.getElementById( 'components-iceberg-theme-switcher' )
			);
		} else if (
			wrapper.classList.contains( 'iceberg-additional-controls' ) &&
			! isActive
		) {
			document
				.getElementById( 'components-iceberg-theme-switcher' )
				.remove();
			wrapper.classList.remove( 'iceberg-additional-controls' );
		}
	}

	onEditTheme( onToggle, type ) {
		const wrapper = document.querySelector(
			'.components-iceberg-theme-switcher__content'
		);
		const editorWrapper = document.querySelector(
			'.block-editor-writing-flow'
		);

		this.setState( { [ type ]: true } );
		onToggle();

		setTimeout( function() {
			wrapper.classList.add( 'is-editing-theme' );
			editorWrapper.classList.add( 'is-editing-theme' );

			document
				.querySelector( '.components-iceberg-theme-switcher__trigger' )
				.click();
		}, 25 );

		// focus manually to fix closing outside bug
		document
			.querySelector(
				'.components-iceberg-theme-switcher__content .components-popover__content'
			)
			.focus();

		// Save theme settings
		this.props.updateThemeSettings( this.state.themeSettings );
	}

	onExitEditTheme() {
		this.setState( { isEditingTheme: false } );
	}

	onSelect( theme, onToggle ) {
		const { themeSettings } = this.state;
		this.setState( { theme } );

		let assignedSettings = themeSettings;

		if (
			typeof themeSettings.isDefault !== 'undefined' &&
			themeSettings.isDefault
		) {
			// assignedSettings = EditorThemes[ theme ];
			assignedSettings = merge( {}, assignedSettings, {
				isDefault: true,
				theme,
			} );
		} else {
			const settingsDiff = difference(
				themeSettings,
				typeof EditorThemes[ themeSettings.theme ] !== 'undefined'
					? EditorThemes[ themeSettings.theme ]
					: {}
			);

			// if ( typeof settingsDiff.name === 'undefined' ) {
			assignedSettings = merge(
				{},
				theme === 'custom' ? themeSettings : EditorThemes[ theme ],
				settingsDiff
			);
			delete assignedSettings.isDefault;
			delete assignedSettings.theme;

			assignedSettings = assign(
				{ isDefault: theme === 'custom' ? false : true },
				assignedSettings
			);
			// }
		}

		this.loadConfig( theme, assignedSettings, true );

		// update theme settings
		delete assignedSettings.theme;

		const settings = assign( { theme }, assignedSettings );
		this.setState( { themeSettings: settings } );
	}

	loadConfig( theme = '', updatedSettings = {} ) {
		const { themeSettings } = this.state;

		if ( ! theme ) {
			theme = themeSettings.theme;
		}

		if (
			typeof EditorThemes[ theme ] === 'undefined' &&
			theme !== 'custom'
		) {
			// theme = 'iceberg';
		}

		// Merge values from defaults, settings and theme editor
		let assignedSettings;

		if ( typeof EditorThemes[ theme ] !== 'undefined' ) {
			assignedSettings = EditorThemes[ theme ];
		} else {
			assignedSettings = themeSettings;
		}

		const temporaryMerger = merge( {}, themeSettings, updatedSettings );

		if (
			typeof temporaryMerger.isDefault !== 'undefined' &&
			temporaryMerger.isDefault
		) {
			let mergeTypography = merge(
				assignedSettings.typography,
				themeSettings.typography
			);

			if ( Object.keys( updatedSettings ).length > 1 ) {
				mergeTypography = merge(
					mergeTypography.typography,
					updatedSettings.typography
				);
			}

			delete assignedSettings.typography;

			assignedSettings = merge(
				{ typography: mergeTypography },
				assignedSettings
			);

			// Prevent error from happening
			// if( typeof assignedSettings.typography === 'undefined' ){
			// 	delete assignedSettings.typography;

			// 	assignedSettings = assign(
			// 		{ typography: EditorThemes[ 'iceberg' ].typography },
			// 		assignedSettings
			// 	);
			// }
		} else {
			assignedSettings = merge( {}, assignedSettings, themeSettings );
			assignedSettings = merge( {}, assignedSettings, updatedSettings );
		}

		// merge defaults to add missing values
		assignedSettings = merge( {}, defaults, assignedSettings );

		assignVariables( assignedSettings );
	}

	render() {
		const { themeSettings } = this.props;

		// Wait for settings to load
		if ( typeof themeSettings.theme === 'undefined' ) {
			return false;
		}

		if (
			! this.state.isEditorThemeLoaded &&
			Object.keys( this.state.themeSettings ).length > 1
		) {
			this.loadConfig( themeSettings.theme );
		}

		return false;
	}
}

export default compose( [
	withSelect( ( select ) => {
		const { getThemeSettings } = select( 'iceberg-settings' );
		const { getCurrentPostType } = select( 'core/editor' );
		const { getPostType } = select( 'core' );

		return {
			themeSettings: getThemeSettings(),
			postType: getPostType( getCurrentPostType() ),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setThemeSettings } = dispatch( 'iceberg-settings' );

		return {
			updateThemeSettings( settings ) {
				setThemeSettings( settings );
			},
		};
	} ),
	withSpokenMessages,
] )( ThemeSwitcher );
