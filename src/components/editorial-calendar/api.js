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
async function fetchPosts( type, start, end, callback ) {
	const response = await wp.apiFetch( {
		path: `iceberg/v1/posts?post_type=${ type }&orderby=date&order=desc&after=${ start }&before=${ end }&numberposts=1000`,
	} );

	if ( response ) {
		callback( response );
	}
}

export default fetchPosts;
