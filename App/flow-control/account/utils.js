// @flow

import cheerio from 'cheerio-without-node-native'

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

    trs.each((ix, tr) => {
        const $tr = $(tr);
        if (ix === 0) {
            colNames = $tr.find('th').map((_, th) => $(th).text().trim()).toArray();
        } else {
            const tds = $tr.find('> td');
            const cellValueByColName = {};
            tds.each((ix, td) => {
                const colName = colNames[ix];
                const $td = $(td);
                const text = $td.text().trim();
                const html = $td.html();

                const parser = parsers[colName] || parsers.default;
                const cellValue = parser ? parser(html, text, cellValueByColName) : text;

                cellValueByColName[colName] = cellValue;
            });
            rowValues.push(cellValueByColName);
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
