export function compareIntThenLex(a, b) {
  // sort ascending by integer, and then lexically
  // ['1', '10', '2'] ->
  // ['1', '2', '10']

  let inta = parseInt(a, 10);
  let intb = parseInt(b, 10);
  let isaint = !isNaN(inta);
  let isbint = !isNaN(intb);
  if (isaint && isbint) {
    return inta - intb; // sort asc
  } else if (isaint && !isbint) {
    return -1; // sort a to lower index then b
  } else if (!isaint && isbint) {
    return 1; // sort b to lower index then a
  } else {
    // neither are int's
    return a.localeCompare(b);
  }
}

export function escapeRegex(text) {
    let specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
    let sRE = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
	  return text.replace(sRE, '\\$1');
	// if (!arguments.callee.sRE) {
	// 	var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
	// 	arguments.callee.sRE = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
	// }
	// return text.replace(arguments.callee.sRE, '\\$1');
}

export async function wait(ms) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms));
}

export function base64_encode (stringToEncode) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/base64_encode/
  // original by: Tyler Akins (http://rumkin.com)
  // improved by: Bayron Guevara
  // improved by: Thunder.m
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Rafał Kukawski (http://blog.kukawski.pl)
  // bugfixed by: Pellentesque Malesuada
  //   example 1: base64_encode('Kevin van Zonneveld')
  //   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
  //   example 2: base64_encode('a')
  //   returns 2: 'YQ=='
  //   example 3: base64_encode('✓ à la mode')
  //   returns 3: '4pyTIMOgIGxhIG1vZGU='

  if (typeof window !== 'undefined') {
    if (typeof window.btoa !== 'undefined') {
      return window.btoa(decodeURIComponent(encodeURIComponent(stringToEncode)))
    }
  } else {
    return new Buffer(stringToEncode).toString('base64')
  }

  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  var o1
  var o2
  var o3
  var h1
  var h2
  var h3
  var h4
  var bits
  var i = 0
  var ac = 0
  var enc = ''
  var tmpArr = []

  if (!stringToEncode) {
    return stringToEncode
  }

  stringToEncode = decodeURIComponent(encodeURIComponent(stringToEncode))

  do {
    // pack three octets into four hexets
    o1 = stringToEncode.charCodeAt(i++)
    o2 = stringToEncode.charCodeAt(i++)
    o3 = stringToEncode.charCodeAt(i++)

    bits = o1 << 16 | o2 << 8 | o3

    h1 = bits >> 18 & 0x3f
    h2 = bits >> 12 & 0x3f
    h3 = bits >> 6 & 0x3f
    h4 = bits & 0x3f

    // use hexets to index into b64, and append result to encoded string
    tmpArr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4)
  } while (i < stringToEncode.length)

  enc = tmpArr.join('')

  var r = stringToEncode.length % 3

  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3)
}

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
            // console.log('ths.length:', ths.length, 'ths:', ths);
            for (const th of ths) {
                cols.push(stripTags(`${th}>`).trim());
            }
        } else {
            const tds = tr.match(/<td\W[\s\S]*?<\/td/gi);
            // console.log('tds:', tds);
            // console.log('tds.length:', tds.length, 'cols.length:', cols.length);
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
    console.log('cols:', cols);
    console.log('rows:', rows);

    return rows;
}

// https://stackoverflow.com/a/1499916/1828637
export function stripTags(html) {
    // html is text
    return html.replace(/(<([^>]+)>)/ig, '');
}

// https://stackoverflow.com/a/36566052/1828637
export function wordSimilarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

// http://stackoverflow.com/q/196972/1828637
// consider not proper casing small words - http://php.net/manual/en/function.ucwords.php#84920 - ['of','a','the','and','an','or','nor','but','is','if','then', 'else','when', 'at','from','by','on','off','for','in','out', 'over','to','into','with'];
export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}