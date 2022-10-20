'use strict';

class EHR {

    /**
     *
     * @param ehrId
     * @param patientId
     * @param doctorId
     * @param hospitalId
     * @param record
     * @param time
     * @returns {EHR}
     */
    constructor(ehrId, patientId, doctorId, hospitalId, record, time) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.hospitalId = hospitalId;
        this.record = record;
        this.time = time;
        this.type = 'EHR';
        this.ehrId = ehrId;
        if (this.__isContract) {
            delete this.__isContract;
        }
        return this;
    }
}

module.exports = EHR;
