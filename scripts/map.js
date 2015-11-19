/*** This displays the US map. ***/

var MAP = {

	/** draws a blank map of US
	*/
	onLoad: function(id) {
		MAP.elementId = id;

		console.log('MAP.onLoad called');

	},

	/** 
	*/
	getData: function(allData) {

	},

	/** on click selection, update map data.
	 */
	update: function() {

	},

	/** render map, with updated data as necessary.
	*/
	render: function(id) {
		console.log('MAP.render called')
	}
}