/**
 * Import a reusable block from a JSON file.
 *
 * @param {File}     file File.
 * @return {Promise} Promise returning the imported reusable block.
 */
async function fetchPosts( type, start, end, callback ) {
	const response = await wp.apiFetch( {
		path: `wp/v2/posts?orderby=date&order=desc&after=${ start }&before=${ end }&iceberg_per_page=1000`,
	} );

	if ( response ) {
		callback(response);
	}
}

export default fetchPosts;
