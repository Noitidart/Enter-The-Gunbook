// @flow

import { stripTags } from 'cmn/lib/all'

export const GUNGEON_PEDIA_PARSERS = {
    default: cell_html => getValueFromHtml(cell_html), // cell_html.includes('Infinity.png') ? 'Infinity' : stripTags(`${cell_html}`).trim(),
    Icon: cell_html => cell_html.match(/src="([^"]+)/)[1],
    // Quality: cell_html => {
    //     let match = cell_html.match(/alt="(.) Quality Item/);
    //     if (!match) return null;
    //     else return match[1];
    // },
    Name: (cell_html, cells, defaultParser) => {
        cells.details_url = 'https://enterthegungeon.gamepedia.com' + cell_html.match(/href="([^"]+)/)[1];
        return defaultParser(cell_html)
    }
}


export function gamepediaExtractTable(html) {
    // html is page html
    // gets the main table of the page
    // returns html text of the table, so <table.....</table>
    // const doc = new DOMParser().parseFromString(await res.text(), 'text/html');

    // const table = doc.querySelect('.wikitable');
    // console.l

    const table_stix = html.lastIndexOf('<table', html.indexOf('wikitable'));
    const table_enix = html.indexOf('</table', table_stix);
    const table = html.substr(table_stix, table_enix - table_stix);
    return table + '>';
}

export function getValueFromHtml(cell_html, attr_name) {
    // gets quality and Infinity


    if (cell_html.includes('Infinity.png')) {
        return 'Infinity';
    } else if (cell_html.includes('_Quality_Item.png')) {
        const quality_enix = cell_html.indexOf('_Quality_Item.png');
        const quality_stix = quality_enix - 1;
        const quality = cell_html.substr(quality_stix, 1);
        return quality;
    } else {
        const str = stripTags(cell_html).trim();
        return str.length ? str : null;
    }
}
