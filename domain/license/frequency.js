class Frequency {

    constructor(frequency) {
        this.frequency = frequency.EFL_FREQ;
        this.channelSpace = frequency.EFL_CHANNEL_SPACE;
        this.bandwidth = frequency.EFL_RF_BWIDTH;
        this.channel = frequency.EFL_CHANNEL;
        this.frequencyPlan = frequency.EFL_FPLAN_EL_NAME;
    }

}

module.exports = Frequency;