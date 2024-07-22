async function chart(splitByTime) {
    console.log("First Parameter: " + splitByTime)
    const margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

    const data = await d3.csv("../data/cleaned_hm.csv").then(data => preprocess(data, "predicted_category", "reflection_period"))
    // console.log(data)
    // console.log(data.map)
    // const category_freq = preprocess(data);
    // console.log(category_freq)
    // let formattedData = Object.keys(data).map(function(key) {
    //     const keys = key.split('|');
    //     const obj = {count: counts[key]};
    //     attributes
    //     return {
    //         category: key,
    //         count: data[key]
    //     };
    // });
    console.log(data)

    // console.log(formattedData);

    // let svg = d3.select("body").select("#overview").append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform",
    //         "translate(" + margin.left + "," + margin.top + ")");
    
    // const x = d3.scaleBand().range([0, width]).domain(formattedData.map(d => d.category));
    // svg.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(x));

    // const y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(formattedData, d => d.count)])
    // svg.append("g")
    //     .call(d3.axisLeft(y));

    // svg.append("g").selectAll(".bar")
    //     .data(data).enter().append("rect").attr("class", "bar")
    //     .attr("x", d => x(d.category))
    //     .attr("y", d => y(d.count))
    //     .attr("width", x.bandwidth())
    //     .attr("height", d => height - y(d.count));
    console.log("Error?")
    createBarChart(data, "predicted_category", "reflection_period")
    console.log("Error?")

}

function preprocess(data, ...attributes) {
    const counts = {};

    data.forEach(item => {
        const key = attributes.map(attr => item[attr]).join('|');
        if(!counts[key]) {
            counts[key] = 0;
        }
        counts[key]++;
        
    });

    return Object.keys(counts).map(key => {
        const keys = key.split('|');
        const obj = { count: counts[key] };
        attributes.forEach((attr, index) => {
            obj[attr] = keys[index];
        });
        return obj;
    });
    // console.log(counts)
    // var mp = new Map();
    // n = data.length;
    // // Traverse through array elements and
    // // count frequencies
    // for (var i = 0; i < n; i++) {
    //     let k = data[i].predicted_category

    //     if (mp.has(k))
    //         mp.set(k, mp.get(k) + 1)
    //     else
    //         mp.set(k, 1)
    // }

    // return Object.fromEntries(mp)
}


function createBarChart(data, category, subcategory) {
    // Set dimensions
    const margin = {top: 20, right: 30, bottom: 40, left: 100},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    
    console.log("Error?")
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    console.log("Error?")
    // Y axis
    const y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(d => d[category]))
        .padding(0.1);

    const y1 = d3.scaleBand().range([0, y.bandwidth()]).padding(0.05).domain(data.map(d => d[subcategory]))

    svg.append("g")
        .call(d3.axisLeft(y));

    console.log("Error?")
    const categoryGroups = svg.selectAll(".category-group")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", d => "translate(0," + y(d[category]) + ")");

    categoryGroups.selectAll('rect')
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("y", d => y1(d[subcategory]))
        .attr("x", 0)
        .attr("width", d => x(d.count))
        .attr("height", y1.bandwidth())
        .attr("fill", "#69b3a2");
    console.log("Error?")

    // // Bars
    // svg.selectAll("myRect")
    //     .data(data)
    //     .enter()
    //     .append("rect")
    //     .attr("x", x(0))
    //     .attr("y", d => y(d[category]))
    //     .attr("width", d => x(d.count))
    //     .attr("height", y.bandwidth())
    //     .attr("fill", "#69b3a2");
    // console.log("Error?")
}