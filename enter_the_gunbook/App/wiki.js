// const { DOMParser } = require('react-native-html-parser');
import { tableToJSON, stripTags } from './utils'

const entities = {
    guns: null,
    items: null
}

export function getEntities() {
    // returns reference
    return entities;
}

const gungeon_pedia_parsers = {
    default: cell_html => getValueFromHtml(cell_html), // cell_html.includes('Infinity.png') ? 'Infinity' : stripTags(`${cell_html}`).trim(),
    Icon: cell_html => cell_html.match(/src="([^"]+)/)[1],
    // Quality: cell_html => {
    //     let match = cell_html.match(/alt="(.) Quality Item/);
    //     if (!match) return null;
    //     else return match[1];
    // },
    Name: (cell_html, cells, defaultParser) => {
        cells.details_url = 'http://enterthegungeon.gamepedia.com' + cell_html.match(/href="([^"]+)/)[1];
        return defaultParser(cell_html)
    }
}


function gamepediaExtractTable(html) {
    // html is page html
    // gets the main table of the page
    // returns html text of the table, so <table.....</table>
    // const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    // console.log('doc', doc);
    // const table = doc.querySelect('.wikitable');
    // console.l
    // console.log('table.textContent:', table.textContent);

    const table_stix = html.lastIndexOf('<table', html.indexOf('wikitable'));
    const table_enix = html.indexOf('</table', table_stix);
    const table = html.substr(table_stix, table_enix - table_stix);
    return table + '>';
}

export async function refreshGuns() {
    const url = 'http://enterthegungeon.gamepedia.com/Guns';
    const res = await fetch(url);
    const html = await res.text();
    const table = gamepediaExtractTable(html);
    const guns = tableToJSON(table, gungeon_pedia_parsers);

    entities.guns = guns;
    return entities.guns;
}
export async function refreshItems() {
    const url = 'http://enterthegungeon.gamepedia.com/Items';
    const res = await fetch(url);
    const html = await res.text();
    const table = gamepediaExtractTable(html);
    return entities.items = tableToJSON(table, gungeon_pedia_parsers);
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