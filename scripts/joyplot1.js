function reload(d) {

  if (d.checked) {

            /*start of spectateur */


      $("#joyplot").html("");



      var margin = {top: 50, right: 10, bottom: 60, left: 200},
        width = 900 - margin.left - margin.right,
        height = 760 - margin.top - margin.bottom;

    // Percent two area charts can overlap
    var overlap = 0.3;

    var formatTime = d3.timeFormat("%d-%b-%Y");

    var svg = d3.select('#joyplot').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = function (d) {
            return d.time;
        },
        xScale = d3.scaleTime().range([0, width]),
        xValue = function (d) {
            return xScale(x(d));
        },
        xAxis = d3.axisBottom(xScale).tickFormat(formatTime);

    var y = function (d) {
            return d.value;
        },
        yScale = d3.scaleLinear(),
        yValue = function (d) {
            return yScale(y(d));
        };

    var game = function (d) {
            return d.key;
        },
        gameScale = d3.scaleBand().range([0, height]),
        gameValue = function (d) {
            return gameScale(game(d));
        },
        gameAxis = d3.axisLeft(gameScale);

    var area = d3.area()
        .x(xValue)
        .y1(yValue);

    var line = area.lineY1()
        .curve(d3.curveBasis);


    function draw_joy(dataFlat) {

        var data = d3.nest()
            .key(function (d) {
                return d.game;
            })
            .entries(dataFlat);

        // Sort activities by peak game time

        function peakTime(d) {
            var i = d3.scan(d.values, function (a, b) {
                return y(b) - y(a);
            });
            return d.values[i].time;
        };
        data.sort(function (a, b) {
            return peakTime(a) - peakTime(b);
        });
        console.log(data);
        xScale.domain(d3.extent(dataFlat, x));

        gameScale.domain(data.map(function (d) {
            return d.key;
        }));

        var areaChartHeight = (1 + overlap) * (height / gameScale.domain().length);

        yScale
            .domain(d3.extent(dataFlat, y))
            .range([areaChartHeight, 0]);

        area.y0(yScale(0));

        svg.append('g').attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            .selectAll("text")

        svg.append('g').attr('class', 'axis axis--game')
            .call(gameAxis);

        var ggame = svg.append('g').attr('class', 'games')
            .selectAll('.game').data(data)
            .enter().append('g')
            .attr('class', function (d) {
                return 'game game--' + d.key;
            })
            .attr('transform', function (d) {
                var ty = gameValue(d) - gameScale.bandwidth() + 5;
                return 'translate(0,' + ty + ')';
            });

        ggame.append('path').attr('class', 'area')
            .datum(function (d) {
                return d.values;
            })
            .attr('d', area);

        ggame.append('path').attr('class', 'line')
            .datum(function (d) {
                return d.values;
            })
            .attr('d', line);
    }

    var parse_time_csv = d3.timeParse("%Y/%m/%d %H");
    var format = d3.timeFormat("%Y-%m-%d");
    var parse = d3.timeParse("%Y-%m-%d");



        function row(d, f) {
                return {
                    game: f,
                    time: parse(d.key),
                    value: +d.value['nb_streamer_avg']
                };

}


    var dataFlat = [];

    var files = [
        "Battlefield", "Call of Duty", "League of Legends", "Minecraft",
        "Star Wars", "StarCraft II", "The Elder Scrolls", "World of Warcraft"

    ];
    var nloaded = 0;

    files.forEach(function (f) {
        d3.text("games-time-series/" + f + ".txt", function (data) {
            var d = d3.csvParseRows(data);

            nested_data = d3.nest()
                .key(function (d) {
                    return format(parse_time_csv(d[0]));
                })
                .rollup(function (leaves) {
                    return {
                        'nb_spec_avg': d3.mean(leaves, function (d) {
                            return d[1];
                        }),
                        'nb_streamer_avg': d3.mean(leaves, function (d) {
                            return d[2];
                        })
                    }
                }).entries(d);

            nested_data.forEach(function (d) {
                dataFlat.push(row(d, f));
            });
            nloaded += 1;
        });
    });

    setTimeout(is_loaded, 1000);

    function is_loaded() {
        if (nloaded == files.length) {
            console.log(dataFlat);
            // Draw the joy chart
            draw_joy(dataFlat);
        } else {
            setTimeout(is_loaded, 1000);
        }
    }
  }


    /*start of streamer */



  else {
      $("#joyplot").html("");

var margin = {top: 30, right: 10, bottom: 60, left: 200},
        width = 900 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    // Percent two area charts can overlap
    var overlap = 0.2;

    var formatTime = d3.timeFormat("%d-%b-%Y");

    var svg = d3.select('#joyplot').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = function (d) {
            return d.time;
        },
        xScale = d3.scaleTime().range([0, width]),
        xValue = function (d) {
            return xScale(x(d));
        },
        xAxis = d3.axisBottom(xScale).tickFormat(formatTime);

    var y = function (d) {
            return d.value;
        },
        yScale = d3.scaleLinear(),
        yValue = function (d) {
            return yScale(y(d));
        };

    var game = function (d) {
            return d.key;
        },
        gameScale = d3.scaleBand().range([0, height]),
        gameValue = function (d) {
            return gameScale(game(d));
        },
        gameAxis = d3.axisLeft(gameScale);

    var area = d3.area()
        .x(xValue)
        .y1(yValue);

    var line = area.lineY1()
        .curve(d3.curveBasis);


    function draw_joy(dataFlat) {

        var data = d3.nest()
            .key(function (d) {
                return d.game;
            })
            .entries(dataFlat);

        // Sort activities by peak game time

        function peakTime(d) {
            var i = d3.scan(d.values, function (a, b) {
                return y(b) - y(a);
            });
            return d.values[i].time;
        };
        data.sort(function (a, b) {
            return peakTime(a) - peakTime(b);
        });
        console.log(data);
        xScale.domain(d3.extent(dataFlat, x));

        gameScale.domain(data.map(function (d) {
            return d.key;
        }));

        var areaChartHeight = (1 + overlap) * (height / gameScale.domain().length);

        yScale
            .domain(d3.extent(dataFlat, y))
            .range([areaChartHeight, 0]);

        area.y0(yScale(0));

        svg.append('g').attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            .selectAll("text")

        svg.append('g').attr('class', 'axis axis--game')
            .call(gameAxis);

        var ggame = svg.append('g').attr('class', 'games')
            .selectAll('.game').data(data)
            .enter().append('g')
            .attr('class', function (d) {
                return 'game game--' + d.key;
            })
            .attr('transform', function (d) {
                var ty = gameValue(d) - gameScale.bandwidth() + 5;
                return 'translate(0,' + ty + ')';
            });

        ggame.append('path').attr('class', 'area')
            .datum(function (d) {
                return d.values;
            })
            .attr('d', area);

        ggame.append('path').attr('class', 'line')
            .datum(function (d) {
                return d.values;
            })
            .attr('d', line);
    }

    var parse_time_csv = d3.timeParse("%Y/%m/%d %H");
    var format = d3.timeFormat("%Y-%m-%d");
    var parse = d3.timeParse("%Y-%m-%d");



        function row(d, f) {
                return {
                    game: f,
                    time: parse(d.key),
                    value: +d.value['nb_spec_avg']
                };
            }



    var dataFlat = [];

    var files = [
        "Battlefield", "Call of Duty", "League of Legends", "Minecraft",
        "Star Wars", "StarCraft II", "The Elder Scrolls", "World of Warcraft"

    ];
    var nloaded = 0;

    files.forEach(function (f) {
        d3.text("games-time-series/" + f + ".txt", function (data) {
            var d = d3.csvParseRows(data);

            nested_data = d3.nest()
                .key(function (d) {
                    return format(parse_time_csv(d[0]));
                })
                .rollup(function (leaves) {
                    return {
                        'nb_spec_avg': d3.mean(leaves, function (d) {
                            return d[1];
                        }),
                        'nb_streamer_avg': d3.mean(leaves, function (d) {
                            return d[2];
                        })
                    }
                }).entries(d);

            nested_data.forEach(function (d) {
                dataFlat.push(row(d, f));
            });
            nloaded += 1;
        });
    });

    setTimeout(is_loaded, 1000);

    function is_loaded() {
        if (nloaded == files.length) {
            console.log(dataFlat);
            // Draw the joy chart
            draw_joy(dataFlat);
        } else {
            setTimeout(is_loaded, 1000);
        }
    }
      /* End of streamer*/

  }
}









