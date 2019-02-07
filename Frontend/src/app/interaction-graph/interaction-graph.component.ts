import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-interaction-graph',
  templateUrl: './interaction-graph.component.html',
  styleUrls: ['./interaction-graph.component.css'],
})
export class InteractionGraphComponent implements OnInit {

  constructor() { }
  @Input() linksSend: any[];
  model = false;
  ngOnInit() {
	  this.traceGraph();
  }
  Modele() {
    if (!this.model) {
      this.model = true;
    } else {
      this.model = false;

    }
  }

  traceGraph() {
    let links = this.linksSend;
    console.log(this.linksSend);
    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function (link) {
        link.source = nodes[link.source] || (nodes[link.source] = {
            name: link.source,
        });
        link.target = nodes[link.target] || (nodes[link.target] = {
            name: link.target,
        });
    });

    var w = 1000,
    h = 600,
	  markerWidth = 5,
    markerHeight = 5,
    cRadius = 15, // play with the cRadius value
    refX = cRadius + 12,
    refY = -Math.sqrt(cRadius),
    drSub = cRadius + refY;

var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([w, h])
        .linkDistance(60)
		.linkStrength(0.5)
		.friction(0.9)
        .charge(-400)
		.chargeDistance(400)
		.gravity(0.1)
        .on("tick", tick)
        .start();

var svg = d3.select("#graph").append("svg:svg")
        .attr("width", w)
        .attr("height", h)
		.on("click", function() { d3.selectAll("circle").attr("opacity", fade(0.9));
										d3.selectAll("path").attr("opacity", fade(0.9));
										d3.selectAll("marker").attr("opacity", 0.9);
										d3.selectAll("rect").style("stroke-width", "1px" )});


var pointe = svg.append("svg:defs").selectAll("marker")
        .data(["unknown"])
        .enter().append("svg:marker")
		.style("fill", "#34495e")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", refX)
        .attr("refY", refY)
        .attr("markerWidth", markerWidth)
        .attr("markerHeight", markerHeight)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");


var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
        .enter().append("svg:path")
		.style("fill", "none").style("stroke", "#34495e").style("stroke-width", "1.5px").style("opacity", "0.9")
        //.attr("class", function (d) {
        //return "link " + d.type;
    //})
        .attr("marker-end", function (d) {
        return "url(#" + d.type + ")";
    });


    var circle = svg.append("svg:g").selectAll("circle")
        .data(force.nodes())
        .enter().append("svg:circle")
		.style("fill", "#dfe6e9").style("stroke", "#34495e").style("stroke-width", "1px").style("opacity", 0.95)
        .attr("r", cRadius)
		.on('dblclick.fade', fade(0.1))
		.on('dblclick', function () { d3.selectAll("marker").attr("opacity", 0.1);
									d3.selectAll("rect").style("stroke-width", "1px");})
		//.on('dblclick.fade', fade(0.9))
		//.on('dblclick', function () { d3.selectAll("marker").attr("opacity", 1);})
        .call(force.drag);


	var legende = svg.append("svg:g")
	legende.selectAll("rect")
		.data(force.nodes())
		.enter().append("svg:rect")
		.style("fill", "#dfe6e9").style("stroke","#34495e").style("stroke-width", "1px").style("opacity", "0.95")
		.attr("x", function(d,i) { if (force.nodes().length<20) {
			return 5
		} else {
			if (i<force.nodes().length/2) {
				return 5
			} else {
				return 40
			}
		}})
		.attr("y", function(d,i) { if (force.nodes().length<20) {
			return 1+h/force.nodes().length*i
		} else {
			if (i<force.nodes().length/2) {
				return 1+(2*(h-(2*h/force.nodes().length))/force.nodes().length)*i;
			} else {
				return 1+(2*(h-(2*h/force.nodes().length))/force.nodes().length)*(i-force.nodes().length/2)
		}}})
		.attr("width", 30)
		.attr("height", function (d, i) { if (force.nodes().length<20) { return h/force.nodes().length-3 } else { return (2*h/force.nodes().length)-3 }})
		.attr("rx", 5)
		.attr("ry", 5)
		.on('dblclick.fade', fade(0.1))
		.on('dblclick', function () { d3.selectAll("marker").attr("opacity", 0.1);
									d3.selectAll("rect").style("stroke-width", "1px" );
									d3.select(this).style("stroke-width", "2px" );});

	legende.selectAll("text").data(force.nodes())
	.enter().append("svg:text")
	.attr("x", function(d,i) { if (force.nodes().length<20) {
	return 9
	} else {
		if (i<force.nodes().length/2) {
			return 9
		} else {
			return 44
		}
	}})
	.attr("y", function(d,i) { if (force.nodes().length<20) {
	return 7+h/(2*force.nodes().length)+h/force.nodes().length*i
	} else {
		if (i<force.nodes().length/2) {
			return (2*(h-(2*h/force.nodes().length))/force.nodes().length)*i+((2*h/force.nodes().length))/2;
		} else {
			return (2*(h-(2*h/force.nodes().length))/force.nodes().length)*(i-force.nodes().length/2)+((2*h/force.nodes().length))/2
		}
	}})
	.text(function (d) { return d.name; })
	//.style("font", "Courier")
	.style("font-size", function () { if (force.nodes().length < 100) { return 10 } else { return 1.5*h/force.nodes().length }});

    var text = svg.append("svg:g").selectAll("g")
        .data(force.nodes())
        .enter().append("svg:g");

    text.append("svg:text")
	//.style("font", "Courier").style("font-size", "10px").style("pointer-events", none).style("opacity",0.9)
        .attr("x", "-.6em")
        .attr("y", ".3em")
        .style("font-size", "10px")
        .text(function (d) {
        return d.name;
    });

  const linkedByIndex = {};
  links.forEach(d => {
    linkedByIndex[`${d.source},${d.target}`] = 1;
  });

  function isConnected(a, b) {
    return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
  }

  function fade(opacity) {
    return d => {
      circle.style('stroke-opacity', function (o) {
        const thisOpacity = isConnected(d, o) ? 1 : opacity;
        this.setAttribute('fill-opacity', thisOpacity);
        return thisOpacity;
      });
      path.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
	  if (opacity == 0.1) {
		path.style('stroke', o => (o.source === d ? 1 : "#e74c3c"));
		path.style('stroke', o => (o.target === d ? 1 : "#2ecc71"));
	  } else {
	    path.style('stroke', "#34495e");
	  }
    };
  }

    // Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
        path.attr("d", function (d) {
            var dx = (Math.max(cRadius*2, Math.min(w-cRadius*2, d.target.x)) - Math.max(cRadius*2, Math.min(w-cRadius*2, d.source.x))),
                dy = (Math.max(cRadius*2, Math.min(h-cRadius*2, d.target.y)) - Math.max(cRadius*2, Math.min(h-cRadius*2, d.source.y))),
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + Math.max(cRadius*2, Math.min(w-cRadius*2, d.source.x)) + "," + Math.max(cRadius*2, Math.min(h-cRadius*2, d.source.y)) + "A" + (dr - drSub) + "," + (dr - drSub) + " 0 0,1 " + Math.max(cRadius*2, Math.min(w-cRadius*2, d.target.x)) + "," + Math.max(cRadius*2, Math.min(h-cRadius*2, d.target.y));
        });

        circle.attr("transform", function (d) {
            return "translate(" + Math.max(cRadius*2 ,Math.min(w-cRadius*2, d.x)) + "," + Math.max(cRadius*2, Math.min(h-cRadius*2, d.y)) + ")";
        });

        text.attr("transform", function (d) {
            return "translate(" + Math.max(cRadius*2 ,Math.min(w-cRadius*2, d.x)) + "," + Math.max(cRadius*2, Math.min(h-cRadius*2, d.y)) + ")";
        });
    }

  }

}
