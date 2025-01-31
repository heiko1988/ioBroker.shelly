/* jshint -W097 */
/* jshint -W030 */
/* jshint strict:true */
/* jslint node: true */
/* jslint esversion: 6 */
'use strict';

const shellyHelper = require('../../shelly-helper');

/**
 * Shelly Pro 1 / shellypro1
 * 
 * https://shelly-api-docs.shelly.cloud/gen2/Devices/ShellyPro1
 */
const shellypro1 = {
    
};

shellyHelper.addSwitchToGen2Device(shellypro1, 0);

shellyHelper.addInputToGen2Device(shellypro1, 0);
shellyHelper.addInputToGen2Device(shellypro1, 1);

module.exports = {
    shellypro1: shellypro1
};
