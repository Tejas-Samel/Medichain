/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const {ChaincodeStub, ClientIdentity} = require('fabric-shim');
const {EhrContract} = require('.');
let Doctor = require('./lib/doctor.js');
let Patient = require('./lib/patient.js');
let Hospital = require('./lib/hospital.js');
let Appointment = require('./lib/appointment.js');
let EHR = require('./lib/ehr.js');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('EhrContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {

        let doctor = {};
        doctor.firstName = 'firstName';
        doctor.lastName = 'lastName';
        doctor.address = 'address';
        doctor.aadhaar = 'aadhaar';
        doctor.medicalRegistrationNo = 'medicalRegistrationNo';
        doctor.DOB = 'DOB';
        doctor.gender = 'gender';
        doctor.userName = 'userName';
        doctor.password = 'password';
        doctor.type = 'Doctor';
        doctor.hospitalId = 'registrationId';
        doctor.patients = ['tejassamel'];
        doctor.appointments = ['appointmentId'];

        let patient1 = {};
        patient1.firstName = 'first1';
        patient1.lastName = 'last1';
        patient1.address = 'address1';
        patient1.aadhaar = '1234';
        patient1.DOB = '20/02/1998';
        patient1.gender = 'Male';
        patient1.bloodGroup = 'AB+';
        patient1.userName = 'tejassamel';
        patient1.password = '12345';
        patient1.appointments = ['appointmentId'];
        patient1.bills = ['billId'];
        patient1.medicineReceipts = [];
        patient1.labRecords = [];
        patient1.ehrs = [];
        patient1.requesters = ['medicalRegistrationNo'];
        patient1.permissionedIds = {};
        patient1.permissionedIds[doctor.medicalRegistrationNo] = ['1', '2'];

        let hospital = {};
        hospital.name = 'name';
        hospital.userName = 'userName';
        hospital.password = 'password';
        hospital.address = 'address';
        hospital.registrationId = 'registrationId';
        hospital.appointments = ['appointmentId'];
        hospital.bills = ['billId'];
        hospital.pharmacies = ['registrationIdPharmacy'];
        hospital.laboratories = ['registrationIdLaboratory'];

        let appointment = {};
        appointment.hospitalId = 'registrationId';
        appointment.patientId = 'tejassamel';
        appointment.description = 'description';
        appointment.time = 'time';
        appointment.appointmentId = 'appointmentId';

        let pharmacy = {};
        pharmacy.hospitalId = hospital.registrationId;
        pharmacy.registrationId = 'registrationIdPharmacy';
        pharmacy.userName = 'userNamePharmacy';
        pharmacy.password = 'passwordPharmacy';

        let laboratory = {};
        laboratory.hospitalId = hospital.registrationId;
        laboratory.registrationId = 'registrationIdLaboratory';
        laboratory.userName = 'userNameLaboratory';
        laboratory.password = 'passwordLaboratory';


        contract = new EhrContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"ehr 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"ehr 1002 value"}'));
        ctx.stub.getState.withArgs('registrationId').resolves(Buffer.from(JSON.stringify(hospital)));
        ctx.stub.getState.withArgs('tejassamel').resolves(Buffer.from(JSON.stringify(patient1)));
        ctx.stub.getState.withArgs('medicalRegistrationNo').resolves(Buffer.from(JSON.stringify(doctor)));
        ctx.stub.getState.withArgs('appointmentId').resolves(Buffer.from(JSON.stringify(appointment)));
        ctx.stub.getState.withArgs('registrationIdLaboratory').resolves(Buffer.from(JSON.stringify(laboratory)));
        ctx.stub.getState.withArgs('registrationIdPharmacy').resolves(Buffer.from(JSON.stringify(pharmacy)));

    });

    describe('#initLedger', async () => {
        it('should update the result in the global state', async () => {
            let result = await contract.initLedger(ctx);

        });
    });

});
