async function chart(splitByTime, plotWords=false, numWords=40, age=null) {
    const stopWords = new Set([
        'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
        'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself',
        'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
        'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be',
        'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an',
        'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by',
        'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before',
        'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over',
        'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
        'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
        'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can',
        'will', 'just', 'don', 'should', 'now', 'day', 'good', 'great', 'week', 'happy'
    ]);

    console.log("First Parameter: " + splitByTime)
    console.log("Second parameter: " + age)


    const margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;


    const subcategory = splitByTime ? "reflection_period" : "";
    // console.log("Subcategory: ", subcategory)
    const splitByAge = (age !== null && age !== "all") ? "age" : "";

    let data = await d3.csv("../data/test_clean_out.csv");
    if (plotWords == false) {
        data = preprocess(data, age, "predicted_category", subcategory, splitByAge);
    } else {
        let sentence_data = data.map(d => d.cleaned_hm);
        console.log(sentence_data)
        data = countWords(sentence_data).slice(0, numWords);
        // console.log(wordCounts)
    }

    const filtered_data = (age !== null && age !== "all") ? filterByAge(data, age) : data;
    
    // console.log("FILTERED DATA: ", filtered_data);
    const mainCategory = (plotWords) ? "word" : "predicted_category"
    createBarChart(filtered_data, mainCategory, subcategory);
}

function filterByAge(data, ageRange) {
    return data.filter(d => d.age == ageRange)
}

function countWords(sentences) {
    let wordCounts = {};
    sentences.forEach(function(sentence) {
        let words = sentence.split(/\W+/);
        words.forEach(function(word) {
            if (word.length > 0) {
                word = word.toLowerCase();
                if(!stopWords.has(word)) {
                    if (wordCounts[word]) {
                        wordCounts[word]++;
                    } else {
                        wordCounts[word] = 1;
                    }
                }
            }
        });
    });
    
    // Convert object to array
    return Object.keys(wordCounts).map(function(key) {
        return {
            word: key,
            count: wordCounts[key]
        };
    }).sort((a, b) => b.count - a.count); // Sort by count
}

function preprocess(data, ageRange, ...attributes) {
    // return data
    const counts = {};

    data.forEach(item => {
        const key = attributes.map(function(attr) {
            if (attr == "age") {
                const age = item[attr]
                let ageGroup = "all"
                if (age >= 12 && age <= 18) {
                    ageGroup = "12-18";
                } else if (age >= 19 && age <= 25) {
                    ageGroup = "19-25";

                } else if (age >= 26 && age <= 35) {
                    ageGroup = "26-35";

                } else if (age >= 36 && age <= 50) {
                    ageGroup = "36-50";

                } else if (age >= 51 && age <= 90) {
                    ageGroup = "51-90";

                } else {
                    ageGroup = "misc"
                }
                return ageGroup
            }

            return item[attr]
        }).join('|');

        if(!counts[key]) {
            counts[key] = 0;
        }
        counts[key]++;
    });
    
    return Object.keys(counts).map(key => {
        const keys = key.split('|');
        const obj = { count: counts[key] };
        attributes.forEach((attr, index) => {
            // console.log(attr)
            obj[attr] = keys[index];
        });
        return obj;
    });
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
    
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    
    console.log("DATA: ", data.map(d => d[category]).sort())    
    // Y axis
    const y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(d => d[category]).sort())
        .padding(0.1);

    const y1 = d3.scaleBand().range([0, y.bandwidth()]).padding(0.05).domain(data.map(d => d[subcategory]))

    svg.append("g")
        .call(d3.axisLeft(y));

    const subCategories = Array.from(new Set(data.map(d => d.subCategory)));
    const color = d3.scaleOrdinal()
            .domain(data.map(d => d[subcategory]))
            .range(d3.schemeCategory10);
            
    if (subcategory != "") {
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
            .attr("fill", d => color(d[subcategory]));

    } else {

        // Bars
        svg.selectAll("myRect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", x(0))
            .attr("y", d => y(d[category]))
            .attr("width", d => x(d.count))
            .attr("height", y.bandwidth())
            .attr("fill", "#69b3a2");
    }

    console.log("X value of affection: ", data.find(item => item.predicted_category == "affection").count)

    const annotations = [
        {
            note: {
                label: "Test_label",
                title: "Test_test"
            },
            x: x(data.find(item => item.predicted_category == "affection").count),
            y: y("affection") + y.bandwidth() / 2,
            dy: 100,
            dx: -100,
            connector: {end: "dot"}
        }
    ];

    const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .annotations(annotations);

    // Append the annotations to the SVG
    svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);


}