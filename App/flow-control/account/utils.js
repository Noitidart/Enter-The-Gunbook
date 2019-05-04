// @flow

import cheerio from 'cheerio-without-node-native'

/**
 * Find the level this node sits at in the tree.
 *
 * @param {*} cheerioNode
 * @param {*} maxDepth
 *
 * @returns {number} the depth of the node - if greater than maxDepth it returns -1
 */
function getNodeDepth(cheerioNode, maxDepth=Infinity) {

    let depth = 0;
    let node = cheerioNode;
    while (node.parent) {
        depth++;
        node = node.parent;

        if (depth > maxDepth) return -1;
    }

    return depth;
}
export function tableToJSON(tableHtml, parsers={}) {
    // parsers are "cell parsers" passed (cell_html, cells, defaultParser) - the return is what the cell value gets set to in object
    // if parser returns undefined, then the pre-parsed value is used

    // can have key in parsers as "default" to override default parser
    // html is text html of a table <table ..... </table
    // must have first tr with th's

    const $ = cheerio.load(tableHtml);

    const trs = $('tr');

    let colNames; // object keys
    const rowValues = []; // array of cells with keys of cols [{...cols}]

    const rowSpanByColIndex = {};

    trs.each((ix, tr) => {
        if (getNodeDepth(tr, 2) === -1) return;

        const $tr = $(tr);
        if (ix === 0) {
            colNames = $tr.find('th').map((_, th) => $(th).text().trim()).toArray();
            colNames.forEach((_, i) => {
                rowSpanByColIndex[i] = 0;
            });
        } else {
            const tds = $tr.find('> td');
            const cellValueByColName = {};
            const isRowSpanned = Object.values(rowSpanByColIndex).some(rowSpan => rowSpan > 0);
            let tdIndex = 0;
            colNames.forEach((colName, colIndex) => {
                if (rowSpanByColIndex[colIndex] === 0) {
                    const td = tds.get(tdIndex);
                    if (!td) return;
                    const $td = $(td);
                    tdIndex++;
                    // attr is undefined if it doesnt have it
                    // rowSpanAttr is 1 based, as is in html
                    const rowSpanAttr = $td.attr('rowspan');
                    // i 0 base it into rowSpan variable
                    const rowSpan = rowSpanAttr === undefined ? 0 : rowSpanAttr - 1;
                    rowSpanByColIndex[colIndex] += rowSpan;

                    const text = $td.text().trim();
                    const html = $td.html();

                    const parser = parsers[colName] || parsers.default;
                    const cellValue = parser ? parser(html, text, cellValueByColName) : text;

                    if (isRowSpanned) {
                        rowValues[rowValues.length - 1][colName] += '\n\n' + cellValue;
                    } else {
                        cellValueByColName[colName] = cellValue;
                    }
                } else {
                    rowSpanByColIndex[colIndex]--;
                }
            });

            if (!isRowSpanned) {
                rowValues.push(cellValueByColName);
            }
        }
    });

    return rowValues;
}

/**
 * https://stackoverflow.com/a/9716488/1828637
 * @param {any} n
 */
export function isNumeric(n) {
    return !Array.isArray(n) && !isNaN(parseFloat(n)) && isFinite(n);
}
