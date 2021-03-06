
pmeas_chartmax = 5000 // Max watts

// Seed values used for debugging
global_dollar_amt = 3.42
global_power_usage = 1500

// influxDB access
host = 'localhost'
port = 8086
username = 'root'
password = 'root'
database = 'power'
pmon_influxdb = new InfluxDB(host, port, username, password, database);

function overviewPie() {
	
	d3objHandles = {};
	debug_mode = true;
	  
	var powermeter = nv.models.pieChart()
	  .x(function(d) { return d.label })
	  .y(function(d) { return d.value })
	  .showLabels(false)     //Display pie labels
	  .showLegend(false)
	  .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
	  .labelType("key") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
	  .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
	  .donutRatio(0.76)     //Configure how big you want the donut hole size to be.
	  .color(['#555555', '#FF8000'])
	  .height(500)
	  .width(500)
	  ;

	// powermeter.pie
	// 	.startAngle(function(d) { return d.startAngle/2 - (3*Math.PI)/4; })
	// 	.endAngle(function(d) { return d.endAngle/2 - (Math.PI/4) ;})
	  	
	var updateInterval = 2000; 
	this.initData = [ {'label': 'nonusage', 'value' : pmeas_chartmax} ,
	                {'label' : 'usage', 'value' : 0} , 
	                {'label' : 'dollar_value', 'value' : 0.00} ];

	initializeChart();
	nv.addGraph(powermeter);
	setInterval( function() { update(); }, updateInterval);
    return;

    
    function update() {
    	
		if (debug_mode) {
			global_power_usage = global_power_usage + Math.round((Math.random()*300)-150);
			if (global_power_usage < 0 || global_power_usage > 5000) {
				global_power_usage = 900;
			}
			data = [ {'label': 'nonusage', 'value' : pmeas_chartmax - global_power_usage},
				{'label' : 'usage', 'value' : global_power_usage},
	            {'label' : 'dollar_value', 'value' : global_dollar_amt} ];
		}
		else {
			// call for data here
            // try {
            //     console.log(pmon_influxdb.readPoint('*','power'))
            //     console.log(pmon_influxdb.readPoint('*', 'cost'))
            // } 
            // catch {

            // }
			power_usage = 0
			dollat_amt = 0

			data = [ {'label': 'nonusage', 'value' : pmeas_chartmax - power_usage},
				{'label' : 'usage', 'value' : power_usage},
	            {'label' : 'dollar_value', 'value' : dollar_amt} ];
		}


		// Updates text labels    	
        updateLabels(data);
    	
        d3.select('#power')
        	.datum(data.slice(0,2)) 
        	.transition().duration(2000)
        	.call(powermeter);
    }
    
    function initializeChart() {
        d3.select('#power')
	    	.datum(this.initData.slice(0,2))
	    	.transition().duration(2000)
	    	.call(powermeter);
        
        initLabels();
    }
    
    function initLabels() {
    	// kW top label
        kwtop_label = d3.select('#power')
        .append("text")
        .attr({'x': 252, 'y': 170, 'text-anchor': 'middle', 'fill' : '#FFFFFF'})
        .style('font-size', '36px')
    	.text("watts");
        
        // kW amount
        kwamt_label = d3.select('#power')
        .append('text')
    	.attr({'x': 257, 'y': 280, 'text-anchor': 'middle', 'fill' : '#FFFFFF'})
    	.style('font-size', '102px') 
    	.style('font-weight', 'normal')
    	.text("0");
        
        // dollar amount
        dollaramt_label = d3.select('#power')
        .append('text')
    	.attr({'x': 250, 'y': 360, 'text-anchor': 'middle', 'fill' : '#FF8000'})
    	.style('font-weight', 'normal')
    	.style('font-size', '42px') 
    	.text("$");
        
        // today text
        today_label = d3.select('#power')
        .append('text')
        .attr({'x': 250, 'y': 390, 'text-anchor': 'middle', 'fill' : '#FF8000'})
        .style('font-weight', 'normal')
        .style('font-size', '24px') 
        .text("today");

        // Circle
        // middle_line = d3.select(renderLocation + ' #psu').append('line')
        // .attr({'x1': 180, 'y1': 255, 'x2': 320, 'y2': 255})
        // .style("stroke", "rgb(0,0,0)");
      	
    	this.d3objHandles = {
    			"kwtop" : kwtop_label,
    			"kwamt" : kwamt_label,
    			"dollaramt" : dollaramt_label,
    			}
    }
    
    function updateLabels(data) {
    	kwamt = data[1]['value']
    	dollaramt = data[2]['value']

    	kwtop_handle = this.d3objHandles["kwtop"];
    	kwamt_handle = this.d3objHandles["kwamt"];
    	dollaramt_handle = this.d3objHandles["dollaramt"]
		
    	if (kwamt >= 1000) {
    		kwtop_handle.text("kilowatts");
    		kwamt = (kwamt/1000).toPrecision(3);
    	} else if (kwamt >= 10000) {
    		kwtop_handle.text("kilowatts");
    		kwamt = (kwamt/1000).toPrecision(4);
    	} else {
    		kwtop_handle.text("watts");
    	}
    	
    	kwamt_handle.text(kwamt);
        dollaramt_handle.text('$' + dollaramt);
    }
}


/* init stuff */
overviewPie();



