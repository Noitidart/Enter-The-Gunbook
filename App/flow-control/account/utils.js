// @flow

import { stripTags } from '../../utils/string'

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

function extractByTag(tagName, partialHtml, startPosition) {
    const tagStartIndex = partialHtml.indexOf(`<${tagName}`, startPosition);
    if (tagStartIndex === -1) throw new Error('Opening tag not found');
    let tagEndIndex = tagStartIndex + 1; // as tableEndIndex needs index of "TAG_NAME" not "<TAG_NAME"
    let openTagCnt = 1;
    while(openTagCnt) {
        tagEndIndex = partialHtml.indexOf(tagName, tagEndIndex + 1);
        if (tagEndIndex === -1) throw new Error('Closing tag not found');
        const prevChar = partialHtml[tagEndIndex-1];
        if (prevChar === '<') openTagCnt++;
        else if (prevChar === '/') openTagCnt--;
    }

    const tagContentStartIndex = partialHtml.indexOf('>', tagStartIndex) + 1;
    const tagContentEndIndex = tagEndIndex - 2;
    const content = partialHtml.substring(tagContentStartIndex, tagContentEndIndex);
    return content;
}

function extractAllByTag(tagName, partialHtml) {
    const contents = [];

    while (true) {
        let content, startPosition;

        if (contents.length) {
            const contentLast = contents[contents.length - 1];
            startPosition = partialHtml.indexOf(contentLast) + contentLast.length;
        }

        try {
            content = extractByTag(tagName, partialHtml, startPosition);
        } catch(ex) {
            if (ex.message.endsWith('tag not found')) break;
            else throw ex;
        }

        contents.push(content);
    }

    return contents;
}
