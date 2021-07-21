      var width = 960,
          height = 500,
          radius = Math.min(width, height) / 2 - 30;
    
    var data = [
      [0, 0.5],
      [6, 0.2],
      [Math.random()*24, Math.random()],
      [Math.random()*24, Math.random()],
      [Math.random()*24, Math.random()],
      [Math.random()*24, Math.random()],
      [Math.random()*24, Math.random()],
      [Math.random()*24, Math.random()],
      [Math.random()*24, Math.random()],
      [Math.random()*24, Math.random()],
      [Math.random()*24, Math.random()],
      [Math.random()*24, Math.random()],
    ]


// grille
    var y = _.map(data, _.last);
    var max =  Math.max.apply(null, y);
    max = Math.ceil(max*10)/10;

    var angle = d3.scale.linear()
        .domain([0, 24])
        .range([0, 2 * Math.PI]);

    var r = d3.scale.linear()
          .domain([0, max])
          .range([0, radius]);

    var svg = d3.select("body").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var gr = svg.append("g")
          .attr("class", "r axis")
          .selectAll("g")
          .data(r.ticks(max*10).slice(1))
          .enter().append("g");

    gr.append("circle")
          .attr("r", r);

    gr.append("text")
        .attr("y", function(d) { return -r(d) - 4; })
        .attr("transform", "rotate(20)")
        .style("text-anchor", "middle")
        .text(function(d) { return d; });

    var ga = svg.append("g")
          .attr("class", "a axis")
          .selectAll("g")
          .data(d3.range(-90, 270, 45))
          .enter().append("g")
          .attr("transform", function(d) {
            return "rotate(" + d + ")";
        });

    ga.append("line")
          .attr("x2", radius);
     
    ga.append("text")
        .attr("x", radius + 6)
        .attr("dy", ".35em")
        .style("text-anchor", function(d) { return d < 270 && d > 90 ? "end" : null; })
        .attr("transform", function(d) {
            return d < 270 && d > 90 ? "rotate(180 " + (radius + 6) + ",0)" : null;
        })
		.text(function(d,i) { 
			
			if(i==0){
				return 'Nord'
			}
			else if(i*3==3)
			{
				return 'NE'
			}
			else if(i*3==6)
			{
				return 'Est'
			}
			else if(i*3==9)
			{
				return 'SE'
			}
			else if(i*3==12)
			{
				return 'Sud'
			}
			else if(i*3==15)
			{
				return 'SO'
			}
			else if(i*3==18)
			{
				return 'Ouest'
			}
			else if(i*3==21)
			{
				return 'NO'
			}
			
		});
		

    var color = d3.scale.category20();

    var line = d3.svg.line.radial()
          .angle(function(d) {
            return angle(d[0]);
          })
          .radius(function(d) {
            return r(d[1]);
          });
		  
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum.csv", function(data) {

  // X scale
  var x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing ?
      .domain( data.map(function(d) { return d.Country; }) ); // The domain of the X axis is the list of states.

  // Y scale
  var y = d3.scaleRadial()
      .range([0, radius])   // Domain will be define later.
      .domain([0, 15000]); // Domain of Y is from 0 to the max seen in the data

  // Add bars
  svg.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
      .attr("fill", "#69b3a2")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(0)
          .outerRadius(function(d) { return y(d['Value']); })
          .startAngle(function(d) { return x(d.Country); })
          .endAngle(function(d) { return x(d.Country) + x.bandwidth(); })
          .padAngle(0.01)
          .padRadius(0))

});

