// @flow

import type { Name as IconName } from '../../../../../Icon'

export function getIconForStat(name: string): IconName | null {
    switch (name) {
        case 'ammoCapacity': return 'battery_full';
        case 'damage': return 'whatshot';
        case 'fireRate': return 'gps_fixed'; // fiber_smart_record
        case 'force': return 'pan_tool';
        case 'magazineSize': return 'group_work';
        case 'range': return 'settings_ethernet';
        case 'reloadTime': return 'history';
        case 'shotSpeed': return 'slow_motion_video';
        case 'spread': return 'wifi_tethering'; // looks
        case 'notes': return 'receipt';
        case 'effect': return 'blur_on'; // bubble_chart, flare, flash_on
        case 'quote': return 'format_quote';
        default: return null; // return 'help';
    }
}

export function getLabelForStat(name: string): string | null {
    switch (name) {
        case 'ammoCapacity': return 'Ammo Capacity';
        case 'damage': return 'Damage';
        case 'fireRate': return 'Fire Rate';
        case 'force': return 'Force';
        case 'magazineSize': return 'Magazine Size';
        case 'range': return 'Range';
        case 'reloadTime': return 'Reload Time (s)';
        case 'shotSpeed': return 'Shot Speed';
        case 'spread': return 'Spread';
        case 'notes': return 'Notes';
        case 'effect': return 'Effect';
        case 'quote': return 'Quote';
        default: return null; // return '???';
    }
}

export function median(values: number[]) {
    values.sort(function(a,b) {
        return a-b;
    });

  if(values.length ===0) return 0

  var half = Math.floor(values.length / 2);

  if (values.length % 2) return values[half];
  else return (values[half - 1] + values[half]) / 2.0;
}

export function sortedWithoutOutliers(data: number[]) {
    // for all methods
    data.sort(function(a,b){return a-b});
    var l = data.length;

    // // METHOD 1: then take off the bottom 2.5% and top 2.5%
    // var low = Math.round(l * 0.025);
    // var high = l - low;
    // var data2 = data.slice(low,high);
    // return data2;

    // for method 2 and method 3
    var sum=0;     // stores sum of elements
    var sumsq = 0; // stores sum of squares
    for(var i=0;i<data.length;++i) {
        sum+=data[i];
        sumsq+=data[i]*data[i];
    }
    var mean = sum/l;

    // METHOD 2: An alternative would be to only show data within 3 standard deviations of the mean. If you data is normally distributed 99.7% will fall in this range.
    var varience = sumsq / l - mean*mean;
    var sd = Math.sqrt(varience);
    var data3 = []; // uses for data which is 3 standard deviations from the mean
    for(var i=0;i<data.length;++i) {
        if(data[i]> mean - 3 *sd && data[i] < mean + 3 *sd)
            data3.push(data[i]);
    }
    return data3;

    // // METHOD 3: Or similar using some multiple of the Inter-quartile range
    // var median = data[Math.round(l/2)];
    // var LQ = data[Math.round(l/4)];
    // var UQ = data[Math.round(3*l/4)];
    // var IQR = UQ-LQ;
    // var data4 = [];
    // for(var i=0;i<data.length;++i) {
    //     if(data[i]> median - 2 * IQR && data[i] < mean + 2 * IQR)
    //         data4.push(data[i]);
    // }
    // return data4;
}
