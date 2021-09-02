const Frequency = require('./frequency');

class Channel {

    constructor(channel, txrx) {
        this.spectraId = channel['$'].EQP_ID_SRC_SPECTRA;
        this.name = channel.EQP_EQUIP_NAME;
        this.type = channel.EQP_EQUIP_TYPE;
        this.id = channel.EQP_EQUIP_IDENT;
        this.modulation = channel.EQ_MODULATION;
        this.anadig = channel.EQ_ANALOG_OR_DIGITAL;
        this.bandwidth = channel.EQ_RF_BWIDTH;
        this.emi = channel.EQE_EMI;
        this.txPower = channel.ETX_POW;
        this.txPowerType = channel.ETX_POW_TYPE;
        this.antennaHeight = channel.EAC_AN_H;
        this.antennaPolarization = channel.EAC_AN_POL;
        this.antennaName = channel.EAN_NAME;

        let freq = new Frequency(channel.FREQUENCY);

        if(txrx === "tx") {
            this.transmitter = freq;
        } else if(txrx === "rx") {
            this.receiver = freq;
        }

    }

}

module.exports = Channel;