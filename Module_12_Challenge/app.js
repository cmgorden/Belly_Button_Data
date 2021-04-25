
d3.json("samples.json").then(function (data) {
  console.log(data);
  firstPerson = data.metadata[0];
  Object.entries(firstPerson).forEach(([key, value]) => { console.log(key + ': ' + value); });
});

function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    //Use first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);

  })
};

init();
// d3.selectAll("body").on("change", updatePage);

// function updatePage() {
//     var dropdownMenu = d3.selectAll("#selDataset").node();
//     var dropdownMenuID = dropdownMenu.id;
//     var selectedOption = dropdownMenu.value;

//     console.log(dropdownMenuID);
//     console.log(selectedOption);
// };


d3.selectAll("body").on("change", updatePage);

function updatePage() {
  var dropdownMenu = d3.select("#selDataset");
  var dropdownMenuID = dropdownMenu.id;
  var selectedOption = dropdownMenu.value;

};

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
  console.log("option changed newSample", newSample);
};

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
};

// Create the buildCharts function
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log("chart area", data)



    // 3. Create a variable that holds the samples array. 
    var metadata = data.metadata.filter(id => sample == id.id);
    console.log("metadata", metadata);

    // Belly button washing frequency variable
    // var washingFrequency = metadata[0]["wfreq"]; 
    // console.log("washing frequency", washingFrequency);

    //var sampleArray = data.samples;
    var samples = data.samples;

    // var washingFrequency = metadata[0]["wfreq"]; 
    // console.log("washing frequency", washingFrequency);

    // 4. Create a variable that filters the samples for the object with the desired sample number.

    var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);

    console.log("filtered sample", filteredSamples);

    //  5. Create a variable that holds the first sample in the array.

    let firstSample = samples[0];
    console.log("first sample", firstSample)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    var bacteriaIDs = filteredSamples[0]["otu_ids"];
    console.log("bacteria IDs", bacteriaIDs);

    //var bacteriaLabels = data.otu_labels;
    var bacteriaLabels = filteredSamples[0]["otu_labels"];
    console.log("bacteria labels", bacteriaLabels);

    var bacteriaValues = filteredSamples[0]["sample_values"];
    console.log("bacteria values", bacteriaValues);


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    // var sortedValues = bacteriaValues.sort((a, b) => b-a);
    // console.log("sorted values", sortedValues);             
    var top10Values = bacteriaValues.slice(0, 10).reverse();
    console.log("top 10 values", top10Values);

    // var yticks = top10Values;

    // var topIDs = bacteriaIDs.sort((a, b) => b-a);
    var top10IDs = bacteriaIDs.slice(0, 10).map(id => `"ID "${id}`).reverse();



    // var yticks = top10IDs;


    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: top10Values,
      y: top10IDs,
      type: "bar",
      orientation: 'h',
      text: bacteriaLabels,
      marker: {
        color: 'rgb(139,0,139)'

      }
      

    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
      yaxis: { title: "Bacteria ID" },
      yticks: 10,
      color: 'rgb(148,0,211)'

    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Create the trace for the bubble chart
    var bubbleData = [{
      x: bacteriaIDs,
      y: bacteriaValues,
      mode: "markers",
      text: bacteriaLabels,
      marker: {
        size: bacteriaValues,
        color: bacteriaValues,
        colorscale: [[0, 'rgb(218,112,214)'], [1, 'rgb(75,0,130)']],
        opacity: []
      }
    }];

    // Create the layout for the bubble chart

    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      showlegend: true,
      height: 600,
      weidght: 600
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Guage chart
    var washingFrequency = metadata[0]["wfreq"];
    //var washingFrequency = metadata.map((id) => {id});

    console.log("washing frequency", washingFrequency);

    var gaugeData = [{
      domain: { x: [0, 10], y: [0, 1] },
      value: washingFrequency,
      title: { text: "Belly Button Washing Frequency <br> Scrubs per Week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 7] },
        bar: { 'color': "gray" },
        steps: [
          { range: [0, 1], color: "#2006df" },
          { range: [1, 2], color: "#400dbf" },
          { range: [2, 3], color: "#60139f" },
          { range: [3, 4], color: "#7f1a80" },
          { range: [4, 5], color: "#9f2060" },
          { range: [5, 6], color: "#bf2640" },
          { range: [6, 7], color: "#df2d20" }
        ]
      }

    }];
    console.log("gauge data", gaugeData);


    var gauageLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

    Plotly.newPlot("gauge", gaugeData, gauageLayout)


  });
}


