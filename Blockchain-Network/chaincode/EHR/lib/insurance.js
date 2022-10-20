'use strict';

class Insurance {

    /**
     *
     * @param name
     * @param registrationId
     * @param userName
     * @param password
     * @param address
     * @param phone
     * @returns {Insurance}
     */
    constructor(name, registrationId, userName, password, address, phone) {

        if (this.validateRegistrationId(registrationId)) {
            this.name = name;
            this.userName = userName;
            this.password = password;
            this.address = address;
            this.registrationId = registrationId;
            this.phone = phone;
            this.type = 'Insurance';
            if (this.__isContract) {
                delete this.__isContract;
            }
            return this;
        } else {
            throw new Error(`this registrationid ${registrationId} is not valid`);
        }
    }

    /**
     *
     * @param registrationId
     * @returns {boolean}
     */
    validateRegistrationId(registrationId) {
        return !!registrationId;
    }
}

module.exports = Insurance;
