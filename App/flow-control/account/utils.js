// @flow

import { stripTags } from 'cmn/lib/all'

tableToJSON.defaultParser = cell_html => stripTags(`${cell_html}`).trim();
export function tableToJSON(table, parsers={}) {
    // parsers are "cell parsers" passed (cell_html, cells, defaultParser) - the return is what the cell value gets set to in object
    // can have key in parsers as "default" to override default parser
    // html is text html of a table <table ..... </table
    // must have first tr with th's

    const trs = table.match(/<tr\W[\s\S]*?<\/tr/gi);

    const cols = []; // object keys
    const rows = []; // array of cells with keys of cols [{...cols}]
    for (const tr of trs) {
        if (!cols.length) {
            // first loop
            const ths = tr.match(/<th\W[\s\S]*?<\/th/gi);

            for (const th of ths) {
                cols.push(stripTags(`${th}>`).trim());
            }
        } else {
            const tds = tr.match(/<td\W[\s\S]*?<\/td/gi);


            const cells = {};
            const col_ix = 0;
            for (const td of tds) {
                const col = cols[col_ix];
                const cell_html = `${td}>`;
                const parser = parsers[col] || parsers.default || tableToJSON.defaultParser
                cells[col] = parser(cell_html, cells, parsers.default || tableToJSON.defaultParser);
                col_ix++;
            }
            rows.push(cells);
        }
    }



    return rows;
}
