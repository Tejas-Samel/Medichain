'use strict';

class LabRecord {

    /**
     *
     * @param labRecordId
     * @param hospitalId
     * @param doctorId
     * @param laboratoryId
     * @param patientId
     * @param time
     * @param record
     * @returns {LabRecord}
     */

    constructor(labRecordId, hospitalId, doctorId, laboratoryId, patientId, time, record) {
        this.hospitalId = hospitalId;
        this.doctorId = doctorId;
        this.laboratoryId = laboratoryId;
        this.patientId = patientId;
        this.time = time;
        this.record = record;
        this.type = 'LabRecord';
        this.labRecordId = labRecordId;
        return this;
    }
}

module.exports = LabRecord;
