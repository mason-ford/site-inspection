const Channel = require('./channel');
const Frequency = require('./frequency');

class Station {

    constructor(station) {
        this.name = station.TCS_NAME;
        this.type = station.TCSC_S_CAT;
        const lat = (Number(station.SID_LAT_DEG) + (Number(station.SID_LAT_MIN)/60) + (Number(station.SID_LAT_SEC)/3600)).toFixed(6);
        const long = -(Number(station.SID_LONG_DEG) + (Number(station.SID_LONG_MIN)/60) + (Number(station.SID_LONG_SEC)/3600)).toFixed(6);
        this.location= {
            lat: lat,
            long: long
        }
        this.channel = [];

        if(station.TRANSMITTER) {
            if(station.TRANSMITTER.length > 0) {
                for(let i=0; i < station.TRANSMITTER.length; i++) {
                    this.channel.push(new Channel(station.TRANSMITTER[i], 'tx'));
                }
            } else {
                this.channel.push(new Channel(station.TRANSMITTER, 'tx'));
            }
        };

        if(station.RECEIVER) {
            if(station.RECEIVER.length > 0) {
                for(let i=0; i < station.RECEIVER.length; i++) {
                    // check if channel alread exists from transmit
                    var found = false;
                    for(let j=0; j < this.channel.length; j++) {
                        if(station.RECEIVER[i]['$'].EQP_ID_SRC_SPECTRA === this.channel[j].spectraId) {
                            this.channel[j].receiver = new Frequency(station.RECEIVER[i].FREQUENCY);
                            var found = true;
                        }
                        if(found) break;
                    }
                    if(!found) this.channel.push(new Channel(station.RECEIVER[i], 'rx'));
                }
            } else {
                // check if channel alread exists from transmit
                var found = false;
                for(let j=0; j < this.channel.length; j++) {
                    if(station.RECEIVER['$'].EQP_ID_SRC_SPECTRA === this.channel[j].spectraId) {
                        this.channel[j].receiver = new Frequency(station.RECEIVER.FREQUENCY);
                        var found = true;
                    }
                    if(found) break;
                }
                if(!found) this.channel.push(new Channel(station.RECEIVER, 'rx'));
            }
        }

    }

}

module.exports = Station;