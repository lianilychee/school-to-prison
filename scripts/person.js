/*** This displays the US map. ***/

var PERSON = {


	/** draws a blank map of US
	*/
	onLoad: function(id) {
		PERSON.elementId = id;

		console.log('PERSON.onLoad called');

	},

	/** 
	*/
	getData: function(allData) {

	},

	/** on click selection, update map data.
	 */
	update: function(id) {
		console.log(id);
	},

	/** render map, with updated data as necessary.
	*/
	render: function(id) {
		console.log('PERSON.render called')
	}
}