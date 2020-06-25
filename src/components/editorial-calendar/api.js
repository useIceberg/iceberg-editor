/**
 * Import a reusable block from a JSON file.
 *
 * @param type
 * @param start
 * @param end
 * @param callback
 * @param {File} file File.
 * @return {Promise} Promise returning the imported reusable block.
 */
async function fetchPosts( type, postStatuses, start, end, callback ) {
	const settingsNonce = icebergSettings.icebergSettingsNonce;
	const currentUserID = icebergSettings.currentUserID;
	const response = await wp.apiFetch( {
		path: `iceberg/v1/posts?post_type=${ type }&post_statuses=${ postStatuses }&orderby=date&order=desc&after=${ start }&before=${ end }&user=${ currentUserID }&numberposts=1000`,
		headers: {
			'X-WP-Nonce': settingsNonce,
		},
	} );

	if ( response ) {
		callback( response );
	}
}

export default fetchPosts;
