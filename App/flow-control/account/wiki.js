// @flow

import cheerio from 'cheerio-without-node-native'
import { stripTags } from '../../utils/string'

export const GUNGEON_PEDIA_PARSERS = {
    default: getValueFromHtml, // cell_html.includes('Infinity.png') ? 'Infinity' : stripTags(`${cell_html}`).trim(),
    Icon: (cell_html, cell_text) => {
        const [, icon] = cell_html.match(/src="([^"]+)/) || [];
        // if (icon === undefined) console.log('ERRRRRROR: icon is undefined, cell_html:', cell_html, 'cells:', cells);
        return icon;
    },
    // Quality: cell_html => {
    //     let match = cell_html.match(/alt="(.) Quality Item/);
    //     if (!match) return null;
    //     else return match[1];
    // },
    Name: (cell_html, cell_text, cells) => {
        cells.moreUrl = 'https://enterthegungeon.gamepedia.com' + cell_html.match(/href="([^"]+)/)[1];
        return cell_text;
    }
}

/**
 * Gets the main table of the page on Gamepedia.
 * Equivalent of doing `document.querySelector('table.wikitable').outerHTML`.
 *
 * @param {string} html - full page HTML
 */
export function gamepediaExtractTable(html: string): string {
    const $ = cheerio.load(html);
    return $('table.wikitable').html();
}

export function getValueFromHtml(cell_html, cell_text, cells) {
    // gets quality and Infinity


    if (cell_html.includes('Infinity.png')) {
        return 'Infinity';
    } else if (cell_html.includes('_Quality_Item.png')) {
        const quality_enix = cell_html.indexOf('_Quality_Item.png');
        const quality_stix = quality_enix - 1;
        const quality = cell_html.substr(quality_stix, 1);
        return ['A', 'B', 'C', 'D', 'S'].includes(quality) ? quality : null;
    } else {
        return cell_text.length ? cell_text : undefined;
    }
}
