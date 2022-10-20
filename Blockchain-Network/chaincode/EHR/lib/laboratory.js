'use strict';

class Laboratory {

    /**
     *
     * @param userName
     * @param password
     * @param hospitalId
     * @param registrationId
     * @param phone
     * @returns {Laboratory}
     */
    constructor(userName, password, hospitalId, registrationId, phone) {

        if (this.validateRegistrationId(registrationId)) {
            this.userName = userName;
            this.password = password;
            this.hospitalId = hospitalId;
            this.registrationId = registrationId;
            this.phone = phone;
            this.type = 'Laboratory';
            if (this.__isContract) {
                delete this.__isContract;
            }
            return this;
        } else {
            throw new Error(`this registrationid ${registrationId} is not valid`);
        }
    }

    validateRegistrationId(registrationId) {
        return !!registrationId;
    }
}

module.exports = Laboratory;
