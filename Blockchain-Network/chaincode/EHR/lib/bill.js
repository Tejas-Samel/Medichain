'use strict';

class Bill {

    /**
     *
     * @param billId
     * @param hospitalId
     * @param patientId
     * @param doctorId
     * @param laboratoryId
     * @param pharmacyId
     * @param time
     * @param amount
     * @param record
     * @returns {Bill}
     */
    constructor(billId, hospitalId, patientId, doctorId, laboratoryId, pharmacyId, time, amount, record) {
        this.amount = amount;
        this.record = record;
        this.hospitalId = hospitalId;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.laboratoryId = laboratoryId;
        this.time = time;
        this.pharmacyId = pharmacyId;
        this.type = 'Bill';
        this.billId = billId;
        return this;
    }
}

module.exports = Bill;
