'use strict';

class Appointment {

    /**
     *
     * @param appointmentId
     * @param hospitalId
     * @param patientId
     * @param description
     * @param time
     * @returns {Appointment}
     */
    constructor(appointmentId, hospitalId, patientId, description, time) {
        this.hospitalId = hospitalId;
        this.patientId = patientId;
        this.description = description;
        this.time = time;
        this.type = 'Appointment';
        this.appointmentId = appointmentId;
        if (this.__isContract) {
            delete this.__isContract;
        }
        return this;
    }
}

module.exports = Appointment;
