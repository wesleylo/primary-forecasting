var count1 = 0;
var isAnimated = {delay: 1500};
var dataset = '/primary-forecasting/default.json';

$(document).ready(function() {
	
	createMap();
});


function createMap() {
	///primary-forecasting/scenario.json
	///primary-forecasting/scenario.json
	///primary-forecasting/getjson.php
	
	if (count1 > 0) {
		dataset = '/primary-forecasting/getjson.php';
		isAnimated = false;
	}
	$.getJSON(dataset, function(data) {
        	//make codes uppercase to match the map data
        	var dataArray = [];
		$.each(data, function () {
			this.code = this.code.toUpperCase();
			dataArray.push({
            			sname: this.sname,
                		code: this.code,
				value: this.value
            		});
        	});
		
        	// Instanciate the map
        	
        	var options = {
        		title:{
    				text:''
			},
			tooltip: {
       		        formatter: function(data) {
                		var s = '<h2>' + this.point.sname + '</h2><br>';
                		if (this.point.value < 0) { //negative when Clinton wins to change colors
                			s += '<b>Clinton <p class="tooltip-percent">' + this.point.hc_votes + '%</p></b><br>Sanders <p class="tooltip-percent">' + this.point.bs_votes + '%</p>';
                		} else if (this.point.value > 0) {
                			s += 'Clinton <p class="tooltip-percent">' + this.point.hc_votes + '%</p><br><b>Sanders <p class="tooltip-percent">' + this.point.bs_votes + '%</p></b>';
                		} else {
                			s += 'Clinton <p class="tooltip-percent">' + this.point.hc_votes + '%</p><br>Sanders <p class="tooltip-percent">' + this.point.bs_votes + '%</p>';
                		} return s;
        		},
			shared: true
                	},
                
            		chart : {
                		borderColor: '#FFFFFF',
                		marginTop: 60
            		},

            		legend: {
                		layout: 'horizontal',
                		borderWidth: 0,
                		backgroundColor: 'rgba(255,255,255,0.85)',
                		floating: true,
                		verticalAlign: 'top',
                		align: 'center',
                		y: 5
            		},

            		mapNavigation: {
	          	      enabled: false
            		},

	            	colorAxis: {
	               		dataClasses: [{
	                    		from: -100,
	                    		to: -1,
	                    		color: '#b4acd2',
	                    		name: 'Clinton'
	                	}, {
	                    		from: 1,
	                    		to: 100,
	                    		color: '#abd7fa',
	                    		name: 'Sanders'
	                	}, {
	                    		from: 0,
	                    		to: 0,
	                    		color: '#ebebeb',
	                    		name: 'Undecided'
	                	}]
	            	},
	
	            	series : [{
	            		borderColor: 'white',
	                	animation: isAnimated,
	                	data : data,
		                mapData: Highcharts.maps['countries/us/us-all'],
	                	joinBy: ['postal-code', 'code'],
	                	dataLabels: {
	                    		enabled: true,
	                    		color: '#FFFFFF',
	                    		format: '{point.code}'
	                	},
	            	}]
   		}; 
   		
   		$('#map').highcharts('Map', options);
	});
	count1++;
}