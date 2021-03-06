var curve_type = d3.curveMonotoneX;
var colors = {
    "League of Legends": {
        "spec": "#f00",
        "stream": "#ff0",
        "ratio": "#fff",
    },
    "Battlefield": {
        "spec": "#f00",
        "stream": "#ff0",
        "ratio": "#fff",
    },
    "Star Wars": {
        "spec": "#f00",
        "stream": "#ff0",
        "ratio": "#fff",
    },
    "The Elder Scrolls": {
        "spec": "#f00",
        "stream": "#ff0",
        "ratio": "#fff",
    },
}
var parse_time_csv = d3.timeParse("%Y/%m/%d %H");
var format = d3.timeFormat("%Y-%m-%d");
var parse = d3.timeParse("%Y-%m-%d");

function draw_chart(dataFlat, dataType) {

    $("#joyplot").html("");
    $("#loading").show();

    var key;
    if (dataType == "spec") {
        key = "nb_spec_avg";
    } else if (dataType == "stream") {
        key = "nb_streamer_avg";
    } else if (dataType == "ratio") {
        key = "ratio";
    }

    var formatTime = d3.timeFormat("%d-%b-%Y");

    var svg = d3.select('#joyplot').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

    var g = svg.append('g')
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
            return d[key];
        },
        yScale = d3.scaleLinear(),
        yValue = function (d) {
            return yScale(y(d));
        };
    yAxis = d3.axisLeft(yScale).ticks(6);

    var area = d3.area()
        .x(xValue)
        .y1(yValue)
        .curve(curve_type);

    var line = area.lineY1()
        .curve(curve_type);

    xScale.domain(d3.extent(dataFlat, x));

    yScale
        .domain([0, d3.max(dataFlat, y)])
        .range([height, 0]);

    area.y0(yScale(0));


    var game = g.append('g')
        .attr('class', 'game');

    game.append('path').attr('class', 'area')
        .datum(function (d) {
            return dataFlat;
        })
        .attr("fill", function (d, i) {
            return colors[current_game][current_type];
        })
        .attr('d', area);

    game.append('path').attr('class', 'line')
        .datum(function (d) {
            return dataFlat;
        })
        .attr('d', line);

    g.append('g').attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + (height) + ')')
        .call(xAxis);

    g.append('g').attr('class', 'axis axis--game')
        .call(yAxis);


    const makeAnnotations = d3.annotation()
    //Gives you access to any data objects in the annotations array
        .accessors({
            x: function (d) {
                return xScale(parse(d.x))
            },
            y: function (d) {
                return yScale(d.y)
            }
        })
        .annotations(annotations[current_game][current_type])
        .textWrap(30);

   g.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)
}

function reload() {
    draw_chart(dataFlat[current_game], current_type)
}

function row(d, f) {
    return {
        time: parse(d.key),
        nb_streamer_avg: +d.value['nb_streamer_avg'],
        nb_spec_avg: +d.value['nb_spec_avg'],
        ratio: +d.value['ratio']
    };
}


var dataFlat = {};

var files = [
    "Battlefield", "League of Legends",
    "Star Wars", "The Elder Scrolls"

];
var nloaded = 0;

$(".game_btn").prop("disabled", true);

files.forEach(function (f) {
    d3.text("games-time-series/" + f + ".txt", function (data) {
        dataFlat[f] = [];
        var d = d3.csvParseRows(data);

        nested_data = d3.nest()
            .key(function (d) {
                return format(parse_time_csv(d[0]));
            })
            .rollup(function (leaves) {
                return {
                    'nb_spec_avg': d3.mean(leaves, function (d) {
                        return d[2];
                    }),
                    'nb_streamer_avg': d3.mean(leaves, function (d) {
                        return d[1];
                    }),
                    'ratio': d3.mean(leaves, function (d) {
                        if (d[1] > 0) {
                            return d[2] / d[1];
                        } else {
                            return 0;
                        }
                    })
                }
            }).entries(d);

        nested_data.forEach(function (d) {
            dataFlat[f].push(row(d, f));
        });
        nloaded += 1;
    });
});

$("#loading").hide();
setTimeout(is_loaded, 1000);

function is_loaded() {
    if (nloaded == files.length) {
        // Draw the joy chart
        $(".game_btn").prop("disabled", false);
        $("#loading").hide();
        reload();
    } else {
        setTimeout(is_loaded, 1000);
    }
}





