'use strict';

class MedicineReceipt {

    /**
     *
     * @param medicineReceiptId
     * @param hospitalId
     * @param doctorId
     * @param pharmacyId
     * @param patientId
     * @param time
     * @param record
     * @returns {MedicineReceipt}
     */

    constructor(medicineReceiptId, hospitalId, doctorId, pharmacyId, patientId, time, record) {
        this.hospitalId = hospitalId;
        this.doctorId = doctorId;
        this.pharmacyId = pharmacyId;
        this.patientId = patientId;
        this.time = time;
        this.record = record;
        this.type = 'MedicineReceipt';
        this.medicineReceiptId = medicineReceiptId;
        return this;
    }
}

module.exports = MedicineReceipt;
