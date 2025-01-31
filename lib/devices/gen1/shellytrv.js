/* jshint -W097 */
/* jshint -W030 */
/* jshint strict:true */
/* jslint node: true */
/* jslint esversion: 6 */
'use strict';

const shellyHelper = require('../../shelly-helper');

/**
 * Shelly HT / SHHT-1 / shellytrv
 * CoAP:
 *  {"blk":[{"I":1,"D":"sensors"}],"sen":[{"I":33,"D":"temperature","T":"T","R":"-40/125","L":1},{"I":44,"D":"humidity","T":"H","R":"0/100","L":1},{"I":77,"D":"battery","T":"B","R":"0/100","L":1}]}
  *
 * CoAP Version >= 1.8
 *  Shelly HT SHHT-1:    {"blk":[{"I":1,"D":"sensor_0"},{"I":2,"D":"device"}],"sen":[{"I":9103,"T":"EVC","D":"cfgChanged","R":"U16","L":2},{"I":3101,"T":"T","D":"extTemp","U":"C","R":["-55/125","999"],"L":1},{"I":3102,"T":"T","D":"extTemp","U":"F","R":["-67/257","999"],"L":1},{"I":3103,"T":"H","D":"humidity","R":["0/100","999"],"L":1},{"I":3115,"T":"S","D":"sensorError","R":"0/1","L":1},{"I":3111,"T":"B","D":"battery","R":["0/100","-1"],"L":2},{"I":9102,"T":"EV","D":"wakeupEvent","R":["battery/button/periodic/poweron/sensor/alarm","unknown"],"L":2}]}
 */
const shellytrv = {
    'bat.Battery': {
        coap: {
            coap_publish: '3412' // CoAP >= FW 1.8
        },
        mqtt: {
			http_publish: '/status',
            http_publish_funct: (value) => { return value && JSON.parse(value) && JSON.parse(value).bat ? JSON.parse(value).bat.value : 0; }
            
        },
        common: {
            'name': 'Battery capacity',
            'type': 'number',
            'role': 'value.battery',
            'read': true,
            'write': false,
            'min': 0,
            'max': 100,
            'unit': '%'
        }
    },
	    'bat.voltage': {
        coap: {
            coap_publish: '3412' // CoAP >= FW 1.8
        },
        mqtt: {
			http_publish: '/status',
            http_publish_funct: (value) => { return value && JSON.parse(value) && JSON.parse(value).bat ? JSON.parse(value).bat.voltage : 0; }
            
        },
        common: {
            'name': 'Battery capacity',
            'type': 'number',
            'role': 'value.battery',
            'read': true,
            'write': false,
            'min': 0,
            'max': 100,
            'unit': 'V'
        }
    },
	'bat.charger': {
        coap: {
            coap_publish: '3102', // CoAP >= FW 1.8
        },
        mqtt: {
            http_publish: '/status',
            http_publish_funct: (value) => { return value && JSON.parse(value) && JSON.parse(value).charger ? JSON.parse(value).charger : false; }
            
        },
        common: {
            'name': 'charger',
            'type': 'boolean',
            'role': 'charger',
            'read': true,
            'write': false,
            'unit': ''
        }
    },	
    'tmp.temp': {
        coap: {
            coap_publish: '3104', // CoAP >= FW 1.8
            
        },
        mqtt: {
            http_publish: '/status',
            http_publish_funct: (value) => { return value && JSON.parse(value) && JSON.parse(value).thermostats[0].tmp ? JSON.parse(value).thermostats[0].tmp.value : 0; }
            
        },
        common: {
            'name': 'Temperature °C',
            'type': 'number',
            'role': 'value.temperature',
            'read': true,
            'write': false,
            'unit': '°C'
        }
    },
	 'tmp.temperature_sensor_Check': {
      coap: {
          coap_publish: '3102', // CoAP >= FW 1.8
      },
      mqtt: {
           http_publish: '/status',
          http_publish_funct: (value) => { return value && JSON.parse(value) && JSON.parse(value).thermostats[0].tmp ? JSON.parse(value).thermostats[0].tmp.is_valid : undefined; }
           
       },
       common: {
           'name': 'is valid',
		   'type': 'boolean',
           'role': 'is_valid',
           'read': true,
           'write': false,
           'unit': ''
       }
    },
	    'tmp.set_temp': {
        coap: {
            coap_publish: '3102', // CoAP >= FW 1.8
        },
        mqtt: {
       
		 
			http_publish: '/settings',
            http_publish_funct: (value) => { return value ? JSON.parse(value).thermostats[0].target_t.value : undefined; },
            http_cmd: '/settings/thermostat/0',
			http_cmd_funct: (value) => { return { target_t: value }; }
			
			
        },
        common: {
            'name': 'set_temp',
            'type': 'number',
            'role': 'soll temp',
            'read': true,
            'write': true,
            'unit': '°C'
        }
    },
		'tmp.valve_position': {
        coap: {
            coap_publish: '3102', // CoAP >= FW 1.8
        },
        mqtt: {
          http_publish: '/status',
          http_publish_funct: (value) => { return value && JSON.parse(value) && JSON.parse(value).thermostats[0] ? JSON.parse(value).thermostats[0].pos : undefined; }
				
        },
        common: {
            'name': 'Valve position',
            'type': 'number',
            'role': 'Valve position',
            'read': true,
            'write': false,
            'unit': '%'
       }
    },
		'schedule.schedule': {
        coap: {
            coap_publish: '3102', // CoAP >= FW 1.8
        },
        mqtt: {
          http_publish: '/status',
          http_publish_funct: (value) => { return value && JSON.parse(value) && JSON.parse(value).thermostats[0] ? JSON.parse(value).thermostats[0].schedule : undefined; },
          http_cmd: '/settings/thermostat/0',
		  http_cmd_funct: (value) => { return { schedule: value }; }				
        },
        common: {
            'name': 'schedule',
            'type': 'boolean',
            'role': 'schedule',
            'read': true,
            'write': true,
            'unit': ''
       }
    },	
		'schedule.profile': {
        coap: {
            coap_publish: '3102', // CoAP >= FW 1.8
        },
        mqtt: {
          http_publish: '/status',
          http_publish_funct: (value) => { return value && JSON.parse(value) && JSON.parse(value).thermostats[0] ? JSON.parse(value).thermostats[0].schedule_profile : undefined; },
          http_cmd: '/settings/thermostat/0',
		  http_cmd_funct: (value) => { return { schedule_profile: value }; }				
        },
        common: {
            'name': 'profile',
            'type': 'number',
            'role': 'schedule',
            'read': true,
            'write': true,
            'unit': '',
			'min': 1,
			'max': 5,
       }
    },		
		'boost.boost_remaining_time': {
        coap: {
            coap_publish: '3102', // CoAP >= FW 1.8
        },
        mqtt: {
          http_publish: '/status',
          http_publish_funct: (value) => { return value && JSON.parse(value) && JSON.parse(value).thermostats[0] ? JSON.parse(value).thermostats[0].boost_minutes : undefined; }
          				
        },
        common: {
            'name': 'boost_remaining_time',
            'type': 'number',
            'role': 'boost_remaining_time',
            'read': true,
            'write': false,
            'unit': 'min',
       }
    },	
		'boost.Set_boost_Duration': {
        coap: {
            coap_publish: '3102', // CoAP >= FW 1.8
        },
        mqtt: {
          http_publish: '/settings/thermostat/0',
          http_publish_funct: (value) => { return value ? JSON.parse(value).boost_minutes : undefined; },
          http_cmd: '/settings/thermostat/0',
		  http_cmd_funct: (value) => { return { boost_minutes: value }; }				
        },
        common: {
            'name': 'Set_boost_Duration',
            'type': 'number',
            'role': 'boost_Duration',
            'read': true,
            'write': true,
            'unit': 'min',
       }
    },	
	
	
};

module.exports = {
    shellytrv: shellytrv
};
