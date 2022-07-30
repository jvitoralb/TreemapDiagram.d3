import * as d3 from "https://cdn.skypack.dev/d3@7";

window.addEventListener('load', () => {

    fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json')
    .then(response => response.json())
    .then(value => buildGraph(value));
});

function buildGraph(products) {
    const svgHeight = 550;
    const svgWidth = 950;
    const padding = 30;

    const svgContainer = d3.select('#svg-container')
    .append('svg')
    .attr('width', svgWidth + (padding * 2))
    .attr('height', svgHeight + padding);

    const tooltip = d3.select('#svg-container')
    .append('div')
    .attr('id', 'tooltip');

    const title = d3.select('#title')
    .append('text')
    .text(products.name);

    const description = d3.select('#description')
    .append('text')
    .text('Biggest Projects by Area and Value');

    const colorsData = [
        ['Product Design', 'rgb(255, 70, 70)'],
        ['Video Games', 'rgb(184, 255, 53)'],
        ['Technology', 'rgb(157, 80, 180)'],
        ['Tabletop Games', 'rgb(255, 155, 61)'],
        ['Hardware', 'rgb(53, 84, 255)'],
        ['Narrative Film', 'rgb(61, 255, 255)'],
        ['3D Printing', 'rgb(193, 58, 255)'],
        ['Gaming Hardware', 'rgb(242, 255, 62)'],
        ['Sound', 'rgb(50, 255, 94)'],
        ['Television', 'rgb(66, 255, 192)'],
        ['Web', 'rgb(47, 172, 255)'],
        ['Games', 'rgb(111, 59, 255)'],
        ['Wearables', 'rgb(182, 50, 127)'],
        ['Sculpture', 'rgb(175, 0, 9)'],
        ['Apparel', 'rgb(184, 150, 0)'],
        ['Food', 'rgb(0, 105, 167)'],
        ['Art', 'rgb(49, 49, 49)'],
        ['Gadgets', 'rgb(204, 204, 204)'],
        ['Drinks', 'rgb(240, 248, 255)']
    ];

    function buildTreeMap() {
        const treeHeight = 550;
        const treeWidth = 750;

        const treemap = d3.treemap()
        .size([treeWidth, treeHeight])
        .paddingInner(2);

        const root = d3.hierarchy(products)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value);

        treemap(root);

        const leaves = root.leaves();

        const tree = svgContainer.selectAll('g')
        .data(leaves)
        .enter()
        .append('g')
        .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`);

        tree.append('rect')
        .attr('width', (d) => d.x1 - d.x0)
        .attr('height', (d) => d.y1 - d.y0)
        .attr('class', 'tile')
        .attr('data-name', (d, i) => leaves[i].data.name)
        .attr('data-category', (d, i) => leaves[i].data.category)
        .attr('data-value', (d, i) => leaves[i].data.value)
        .attr('fill', (d) => {
            let colorPair = colorsData.filter(pair => pair[0] === d.data.category)
            return colorPair[0][1];
        });

        tree.on('mouseover', (e, d) => {
            let dValue = d.data.value.slice(0, d.data.value.length - 5).split('');
            dValue.splice(-1, 0, '.');
            let tipInfo = `${d.data.name}<br>${d.data.category}<br>Value: ${dValue.join('')}`;

            tooltip.attr('data-value', d.data.value)
            .html(tipInfo)
            .style('top', `${e.pageY - 92}px`)
            .style('left', `${e.pageX - 68}px`)
            .style('visibility', 'visible');

        }).on('mouseout', () => tooltip.style('visibility', 'hidden'))
    }
    buildTreeMap();

    function createLegend() {

        const lgndPlaceHolder = svgContainer.append('g')
        .attr('id', 'legend');

        const legend = lgndPlaceHolder.selectAll('#legend')
        .data(colorsData.reverse())
        .enter()
        .append('g')
        .attr('transform', (d, i) => `translate(${750 + padding}, ${(svgHeight / 29.9 - padding * i)})`); // treemap width is 750

        legend.append('rect')
        .attr('class', 'legend-item')
        .attr('y', 550 - padding) // treemap height is 550
        .attr('width', 25)
        .attr('height', 25)
        .attr('fill', (d) => d[1]);

        legend.append('text')
        .text((d) => d[0])
        .attr('x', 30)
        .attr('y', 550 - padding + 18) // treemap height is 550
    }
    createLegend();
}