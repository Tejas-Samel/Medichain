/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const {Contract} = require('fabric-contract-api');
const path = require('path')
const fs = require('fs');

//import the files which contains the constructors and auxiliary function
let Doctor = require('./doctor.js');
let Patient = require('./patient.js');
let Hospital = require('./hospital.js');
let Appointment = require('./appointment.js');
let EHR = require('./ehr.js');
let Insurance = require('./insurance.js');
let Laboratory = require('./laboratory.js');
let Pharmacy = require('./pharmacy.js');
let Researcher = require('./researcher.js');
let Bill = require('./bill.js');
let LabRecord = require('./labRecord.js');
let MedicineReceipt = require('./medicineReceipt.js');

/**
 * @author : Tejas S
 * @Date : 26/06
 */

class EhrContract extends Contract {

    /**
     *
     * @param ctx
     * @returns {Promise<void>}
     */
    async initLedger(ctx) {
        console.log('============= START : Initialize Ledger ===========');

        //create a patient
        let patient1 = {};
        patient1.firstName = 'first1';
        patient1.lastName = 'last1';
        patient1.address = 'address1';
        patient1.aadhaar = '1234';
        patient1.DOB = '01/01/2001';
        patient1.gender = 'Male';
        patient1.bloodGroup = 'B+';
        patient1.userName = 'dummyname';
        patient1.password = '12345';
        patient1.phone = '12345';


        // let response = await this.createPatient(ctx, JSON.stringify(patient1));
        // console.log(response);
        let newPatient = await new Patient(patient1.firstName, patient1.lastName, patient1.address, patient1.aadhaar, patient1.DOB, patient1.gender, patient1.bloodGroup, patient1.userName, patient1.password, patient1.phone);
        await ctx.stub.putState(newPatient.userName, Buffer.from(JSON.stringify(newPatient)));
        console.log(newPatient);

        //create a hospital
        let hospital = {};
        hospital.name = 'name';
        hospital.userName = 'userName';
        hospital.password = 'password';
        hospital.address = 'address';
        hospital.registrationId = 'registrationId';
        hospital.phone = '1234';
        // response = await this.createHospital(ctx, JSON.stringify(hospital));
        // console.log(response);
        let newHospital = await new Hospital(hospital.name, hospital.registrationId, hospital.userName, hospital.password, hospital.address, hospital.phone);
        await ctx.stub.putState(newHospital.registrationId, Buffer.from(JSON.stringify(newHospital)));
        console.log(newHospital);

        //create a doctor
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
        doctor.specialisation = 'gynec';
        doctor.phone = '1234';
        // response = await this.createDoctor(ctx, JSON.stringify(doctor));
        // console.log(response);
        let newDoctor = await new Doctor(doctor.firstName, doctor.lastName, doctor.address, doctor.aadhaar, doctor.medicalRegistrationNo, doctor.DOB, doctor.gender, doctor.userName, doctor.password, doctor.specialisation, doctor.phone);
        await ctx.stub.putState(newDoctor.medicalRegistrationNo, Buffer.from(JSON.stringify(newDoctor)));
        console.log(newDoctor);

        //create an appointment
        let appointment = {};
        appointment.hospitalId = 'registrationId';
        appointment.patientId = 'DUMMY_NAME';
        appointment.description = 'description';
        appointment.time = 'time';
        appointment.appointmentId = 'appointmentId';
        // response = await this.createAppointment(ctx, JSON.stringify(appointment));
        // console.log(response);
        let newAppointment = await new Appointment(appointment.appointmentId, appointment.hospitalId, appointment.patientId, appointment.description, appointment.time);
        await ctx.stub.putState(newAppointment.appointmentId, Buffer.from(JSON.stringify(newAppointment)));
        console.log(newAppointment);

        /*
                //assign appointment
                let hospitalAsBytes = await ctx.stub.getState(hospital.registrationId);
                hospital = await JSON.parse(hospitalAsBytes);
                let assign = {};
                assign.appointmentId = hospital.appointments[0];
                assign.doctorId = 'medicalRegistrationNo';
                assign.hospitalId = 'registrationId';
                response = await this.assignDoctor(ctx, JSON.stringify(assign));
                console.log(response);
         */

        //create an EHR
        let ehr = {};
        ehr.hospitalId = hospital.registrationId;
        ehr.patientId = patient1.userName;
        ehr.doctorId = doctor.medicalRegistrationNo;
        ehr.appointmentId = 'appointmentId';
        ehr.record = 'Everything is fine';
        ehr.time = 'time';
        ehr.ehrId = 'ehrId';

        // response = await this.createEhr(ctx, JSON.stringify(ehr),ehr.record);
        // console.log(response);
        let newEHR = await new EHR(ehr.ehrId, ehr.patientId, ehr.doctorId, ehr.hospitalId, ehr.record, ehr.time);
        await ctx.stub.putState(newEHR.ehrId, Buffer.from(JSON.stringify(newEHR)));
        console.log(newEHR);

        //create a pharmacy
        let pharmacy = {};
        pharmacy.hospitalId = hospital.registrationId;
        pharmacy.registrationId = 'registrationIdPharmacy';
        pharmacy.userName = 'userNamePharmacy';
        pharmacy.password = 'passwordPharmacy';
        pharmacy.phone = 'phone';
        // response = await this.createPharmacy(ctx, JSON.stringify(pharmacy));
        // console.log(response);
        let newPharmacy = await new Pharmacy(pharmacy.userName, pharmacy.password, pharmacy.hospitalId, pharmacy.registrationId, pharmacy.phone);
        await ctx.stub.putState(newPharmacy.registrationId, Buffer.from(JSON.stringify(newPharmacy)));
        console.log(newPharmacy);

        //generate a medicine receipt
        let medicineReceipt = {};
        medicineReceipt.hospitalId = hospital.registrationId;
        medicineReceipt.patientId = patient1.userName;
        medicineReceipt.doctorId = doctor.medicalRegistrationNo;
        medicineReceipt.pharmacyId = 'registrationIdPharmacy';
        medicineReceipt.record = 'Everything is fine';
        medicineReceipt.time = 'time';
        medicineReceipt.medicineReceiptId = 'medicineReceiptId';

        // response = await this.generateMedicineReceipt(ctx, JSON.stringify(medicineReceipt));
        // console.log(response);
        let newMedicineReceipt = await new MedicineReceipt(medicineReceipt.medicineReceiptId, medicineReceipt.hospitalId, medicineReceipt.doctorId, medicineReceipt.pharmacyId, medicineReceipt.patientId, medicineReceipt.time, medicineReceipt.record);
        await ctx.stub.putState(newMedicineReceipt.medicineReceiptId, Buffer.from(JSON.stringify(newMedicineReceipt)));
        console.log(newMedicineReceipt);

        //create a laboratory
        let laboratory = {};
        laboratory.hospitalId = hospital.registrationId;
        laboratory.registrationId = 'registrationIdLaboratory';
        laboratory.userName = 'userNameLaboratory';
        laboratory.password = 'passwordLaboratory';
        laboratory.phone = '1234';
        // response = await this.createLaboratory(ctx, JSON.stringify(laboratory));
        // console.log(response);
        let newLaboratory = await new Laboratory(laboratory.userName, laboratory.password, laboratory.hospitalId, laboratory.registrationId, laboratory.phone);
        await ctx.stub.putState(newLaboratory.registrationId, Buffer.from(JSON.stringify(newLaboratory)));
        console.log(newLaboratory);

        //generate a lab record
        let labRecord = {};
        labRecord.hospitalId = hospital.registrationId;
        labRecord.patientId = patient1.userName;
        labRecord.doctorId = doctor.medicalRegistrationNo;
        labRecord.laboratoryId = 'registrationIdLaboratory';
        labRecord.record = 'Everything is fine';
        labRecord.time = 'time';
        labRecord.labRecordId = 'labRecordId';

        // response = await this.generateLabRecord(ctx, JSON.stringify(labRecord));
        // console.log(response);
        let newLabRecord = await new LabRecord(labRecord.labRecordId, labRecord.hospitalId, labRecord.doctorId, labRecord.laboratoryId, labRecord.patientId, labRecord.time, labRecord.record);
        await ctx.stub.putState(newLabRecord.labRecordId, Buffer.from(JSON.stringify(newLabRecord)));
        console.log(newLabRecord);

        //create a researcher
        let researcher = {};
        researcher.name = 'nameResearcher';
        researcher.userName = 'userNameResearcher';
        researcher.password = 'passwordResearcher';
        researcher.address = 'addressResearcher';
        researcher.registrationId = 'registrationIdResearcher';
        researcher.phone = 'phone';

        // response = await this.createResearcher(ctx, JSON.stringify(researcher));
        // console.log(response);
        let newResearcher = await new Researcher(researcher.name, researcher.registrationId, researcher.userName, researcher.password, researcher.address, researcher.phone);
        await ctx.stub.putState(newResearcher.registrationId, Buffer.from(JSON.stringify(newResearcher)));
        console.log(newResearcher);

        //create a insurer
        let insurer = {};
        insurer.name = 'nameInsurer';
        insurer.userName = 'userNameInsurer';
        insurer.password = 'passwordInsurer';
        insurer.address = 'addressInsurer';
        insurer.registrationId = 'registrationIdInsurer';
        insurer.phone = '1234';
        // response = await this.createInsurance(ctx, JSON.stringify(insurer));
        // console.log(insurer);
        let newInsurer = await new Insurance(insurer.name, insurer.registrationId, insurer.userName, insurer.password, insurer.address, insurer.phone);
        await ctx.stub.putState(newInsurer.registrationId, Buffer.from(JSON.stringify(newInsurer)));
        console.log(newInsurer);

        //generate Bill after the end of all treatment
        let bill = {};
        bill.amount = 'amount';
        bill.record = 'record';
        bill.hospitalId = hospital.registrationId;
        bill.patientId = patient1.userName;
        bill.doctorId = doctor.medicalRegistrationNo;
        bill.laboratoryId = laboratory.registrationId;
        bill.time = 'time';
        bill.pharmacyId = pharmacy.registrationId;
        bill.billId = 'billId';

        // response = await this.generateBill(ctx, JSON.stringify(bill));
        // console.log(response);
        let newBill = await new Bill(bill.billId, bill.hospitalId, bill.patientId, bill.doctorId, bill.laboratoryId, bill.pharmacyId, bill.time, bill.amount, bill.record);
        await ctx.stub.putState(newBill.billId, Buffer.from(JSON.stringify(newBill)));
        console.log(newBill);
        /*

                //request access
                let request = {};
                request.patientId = patient1.userName;
                request.requesterId = doctor.medicalRegistrationNo;
                let response = await this.requestAccess(ctx, JSON.stringify(request));
                console.log(response);

                //grant access
                request.documentIds = [];
                response = await this.grantAccess(ctx, JSON.stringify(request));
                console.log(response);

                //revoke access
                response = await this.revokeAccess(ctx, JSON.stringify(request));
                console.log(response);
        */

        console.log('============= END : Initialize Ledger ===========');
    }

    /**
     *
     * @param ctx
     * @param args - hospital id , appointment id , doctor id , patient id
     * @param record - will be in the form of hash of the the original record either in the form of pdf of any digital copy
     * @returns {Promise<string>}
     */
    async createEhr(ctx, args) {
        args = await JSON.parse(args);
        console.log('********ARGS START*********');
        console.log(args);
        console.log('********ARGS END*********');
        let hospitalExists = await this.assetExists(ctx, args.hospitalId);
        let patientExists = await this.assetExists(ctx, args.patientId);
        let doctorExists = await this.assetExists(ctx, args.doctorId);
        let appointmentExists = await this.assetExists(ctx, args.appointmentId);
        console.log('*********1********');
        if (hospitalExists && doctorExists && patientExists && appointmentExists) {

            //create a new EHR and update it in the world state
            let newEHR = await new EHR(args.ehrId, args.patientId, args.doctorId, args.hospitalId, args.record, args.time);
            await ctx.stub.putState(newEHR.ehrId, Buffer.from(JSON.stringify(newEHR)));
            console.log('********2*******');
            //update the EHR in the list of the ehrs for the patient and remove the appointment from the patient global state
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);
            let appointments = patient.appointments;
            let index = appointments.indexOf(args.appointmentId);
            if (index > -1) {
                appointments.splice(index, 1);
                patient.appointments = appointments;
            }
            let ehrs = patient.ehrs;
            ehrs.push(newEHR.ehrId);
            patient.ehrs = ehrs;
            await ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));

            //update the doctor with tha appointments and make the patient marked Attended
            let doctorAsBytes = await ctx.stub.getState(args.doctorId);
            let doctor = JSON.parse(doctorAsBytes);
            appointments = doctor.appointments;
            index = appointments.indexOf(args.appointmentId);
            if (index > -1) {
                appointments.splice(index, 1);
                patient.appointments = appointments;
            }

            let patientsAttended = doctor.patientsAttended;
            index = patientsAttended.indexOf(args.patientId);

            if (index < 0)
                patientsAttended.push(args.patientId);
            doctor.patientsAttended = patientsAttended;
            await ctx.stub.putState(doctor.medicalRegistrationNo, Buffer.from(JSON.stringify(doctor)));
            console.log('***********3*********');
            //check whether pharmacy or laboratory appointment is necessary if yes suggest one
            let pharmacyExists = await this.assetExists(ctx, args.pharmacyId);
            let laboratoryExists = await this.assetExists(ctx, args.laboratoryId);
            if (pharmacyExists) {
                let pharmacyAsBytes = await ctx.stub.getState(args.pharmacyId);
                let pharmacy = JSON.parse(pharmacyAsBytes);
                pharmacy.appointments.push(args.appointmentId);
                await ctx.stub.putState(pharmacy.registrationId, Buffer.from(JSON.stringify(pharmacy)));
            }
            if (laboratoryExists) {
                let laboratoryAsBytes = await ctx.stub.getState(args.laboratoryId);
                let laboratory = JSON.parse(laboratoryAsBytes);
                laboratory.appointments.push(args.appointmentId);
                await ctx.stub.putState(laboratory.registrationId, Buffer.from(JSON.stringify(laboratory)));
            }
            console.log('*********9************');
            let response = `an EHR is created with id${newEHR.ehrId} and stored in the world state`;
            return response;

        } else {
            throw new Error(`Either the hospital, patient, doctor or the appointment id is wrong`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async generateLabRecord(ctx, args) {
        args = await JSON.parse(args);
        let hospitalExists = await this.assetExists(ctx, args.hospitalId);
        let patientExists = await this.assetExists(ctx, args.patientId);
        let doctorExists = await this.assetExists(ctx, args.doctorId);
        let laboratoryExists = await this.assetExists(ctx, args.laboratoryId);

        if (hospitalExists && patientExists && doctorExists && laboratoryExists) {

            //generate a new lab record with all the details
            let newLabRecord = await new LabRecord(args.labRecordId, args.hospitalId, args.doctorId, args.laboratoryId, args.patientId, args.time, args.record);
            await ctx.stub.putState(newLabRecord.labRecordId, Buffer.from(JSON.stringify(newLabRecord)));

            //update the patient with the lab record
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);
            let labRecords = patient.labRecords;
            labRecords.push(newLabRecord.labRecordId);
            patient.labRecords = labRecords;
            await ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));

            //update the laboratory with the patient attended
            let laboratoryAsBytes = await ctx.stub.getState(args.laboratoryId);
            let laboratory = JSON.parse(laboratoryAsBytes);
            let patientsAttended = laboratory.patientsAttended;
            let index = patientsAttended.indexOf(args.patientId);
            if (index < 0) {
                patientsAttended.push(patient.userName);
            }
            laboratory.patientsAttended = patientsAttended;

            index = laboratory.appointments.indexOf(args.appointmentId);
            if (index > -1) {
                laboratory.appointments.splice(index, 1);
            }

            await ctx.stub.putState(laboratory.registrationId, Buffer.from(JSON.stringify(laboratory)));

            let response = `LabRecord has been generated with id ${newLabRecord.labRecordId} and updated for both the patient`;
            return response;

        }
        throw new Error(`Either the patient or hospital entity is not correct`);
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async generateMedicineReceipt(ctx, args) {
        args = await JSON.parse(args);
        let hospitalExists = await this.assetExists(ctx, args.hospitalId);
        let patientExists = await this.assetExists(ctx, args.patientId);
        let doctorExists = await this.assetExists(ctx, args.doctorId);
        let pharmacyExists = await this.assetExists(ctx, args.pharmacyId);

        if (hospitalExists && patientExists && doctorExists && pharmacyExists) {

            //generate a new Medicine receipt with all the details
            let newMedicineReceipt = await new MedicineReceipt(args.medicineReceiptId, args.hospitalId, args.doctorId, args.pharmacyId, args.patientId, args.time, args.record);
            await ctx.stub.putState(newMedicineReceipt.medicineReceiptId, Buffer.from(JSON.stringify(newMedicineReceipt)));

            //update the patient with the medicine receipt
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);
            let medicineReceipts = patient.medicineReceipts;
            medicineReceipts.push(newMedicineReceipt.medicineReceiptId);
            patient.medicineReceipts = medicineReceipts;
            await ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));

            //update the pharmacy with the patient attended
            let pharmacyAsBytes = await ctx.stub.getState(args.pharmacyId);
            let pharmacy = JSON.parse(pharmacyAsBytes);
            let patientsAttended = pharmacy.patientsAttended;
            let index = patientsAttended.indexOf(args.patientId);
            if (index < 0) {
                patientsAttended.push(patient.userName);
            }
            pharmacy.patientsAttended = patientsAttended;

            index = pharmacy.appointments.indexOf(args.appointmentId);
            if (index > -1) {
                pharmacy.appointments.splice(index, 1);
            }

            await ctx.stub.putState(pharmacy.registrationId, Buffer.from(JSON.stringify(pharmacy)));

            let response = `medicineReceipt has been generated with id ${newMedicineReceipt.medicineReceiptId} and updated for both the patient`;
            return response;

        }
        throw new Error(`Either the patient or hospital entity is not correct`);
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async requestAccess(ctx, args) {
        args = await JSON.parse(args);
        let requesterExists = await this.assetExists(ctx, args.requesterId);
        let patientExists = await this.assetExists(ctx, args.patientId);
        if (requesterExists && patientExists) {

            //get the patient and update the request for that patient
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);
            let requesters = patient.requesters;
            let index = requesters.indexOf(args.requesterId);
            if (index < 0) {
                requesters.push(args.requesterId);
            }
            patient.requesters = requesters;

            await ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));

            let response = `the request to access the documents has been submitted with the patient`;
            return response;
        } else {
            throw new Error(`this requester with id ${args.requesterId} or the patient with id ${args.patientId} doesn't exist`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async grantAccess(ctx, args) {
        args = await JSON.parse(args);
        let patientExists = await this.assetExists(ctx, args.patientId);
        let requesterExists = await this.assetExists(ctx, args.requesterId);
        if (patientExists && requesterExists) {
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);
            let requesters = patient.requesters;
            let index = requesters.indexOf(args.requesterId);
            if (index > -1) {
                //remove the requester from the requester array and put it into the permissioned Ids with the list of all the
                //document ids that particular can access
                requesters.splice(index, 1);
                patient.requesters = requesters;
                let permissionedIds = patient.permissionedIds;
                permissionedIds[args.requesterId] = args.documentIds;
                patient.permissionedIds = permissionedIds;
                await ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));

                //update the patient in the patient array for the requester
                let requesterAsBytes = await ctx.stub.getState(args.requesterId);
                let requester = JSON.parse(requesterAsBytes);
                let patients = requester.patients;
                index = patients.indexOf(args.patientId);
                if (index < 0) {
                    patients.push(args.patientId);
                }
                requester.patients = patients;
                await ctx.stub.putState(args.requesterId, Buffer.from(JSON.stringify(requester)));

                let response = `Access has been provided to the requester with the id ${args.requesterId}`;
                return response;
            } else {
                throw new Error(`No such requester with id ${args.requesterId}`);
            }
        } else {
            throw new Error(`patient with id ${args.patientId} or requester with id ${args.requesterId} doesn't exists`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async grantDirectAccess(ctx, args) {
        args = await JSON.parse(args);
        let patientExists = await this.assetExists(ctx, args.patientId);
        let requesterExists = await this.assetExists(ctx, args.requesterId);
        if (patientExists && requesterExists) {
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);

            //directly set the permissioned id to the requesterID as permission directly granted by the patient in
            //order to get checkUps done or insurance
            let permissionedIds = patient.permissionedIds;
            permissionedIds[args.requesterId] = args.documentIds;
            patient.permissionedIds = permissionedIds;
            await ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));

            //update the patient in the patient array for the requester
            let requesterAsBytes = await ctx.stub.getState(args.requesterId);
            let requester = JSON.parse(requesterAsBytes);
            let patients = requester.patients;
            let index = patients.indexOf(args.patientId);
            if (index < 0) {
                patients.push(args.patientId);
            }
            requester.patients = patients;
            await ctx.stub.putState(args.requesterId, Buffer.from(JSON.stringify(requester)));

            return `Access has been provided to the requester with the id ${args.requesterId}`;
        } else {
            throw new Error(`patient with id ${args.patientId} or requester with id ${args.requesterId} doesn't exists`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async grantDirectAccess(ctx, args) {
        args = await JSON.parse(args);
        let patientExists = await this.assetExists(ctx, args.patientId);
        let requesterExists = await this.assetExists(ctx, args.requesterId);
        if (patientExists && requesterExists) {
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);

            //directly set the permissioned id to the requesterID as permission directly granted by the patient in
            //order to get checkUps done or insurance
            let permissionedIds = patient.permissionedIds;
            permissionedIds[args.requesterId] = args.documentIds;
            patient.permissionedIds = permissionedIds;
            await ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));

            //update the patient in the patient array for the requester
            let requesterAsBytes = await ctx.stub.getState(args.requesterId);
            let requester = JSON.parse(requesterAsBytes);
            let patients = requester.patients;
            let index = patients.indexOf(args.patientId);
            if (index < 0) {
                patients.push(args.patientId);
            }
            requester.patients = patients;
            await ctx.stub.putState(args.requesterId, Buffer.from(JSON.stringify(requester)));

            return `Access has been provided to the requester with the id ${args.requesterId}`;
        } else {
            throw new Error(`patient with id ${args.patientId} or requester with id ${args.requesterId} doesn't exists`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async revokeAccess(ctx, args) {
        args = await JSON.parse(args);
        let patientExists = await this.assetExists(ctx, args.patientId);
        let requesterExists = await this.assetExists(ctx, args.requesterId);
        if (patientExists && requesterExists) {
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);
            let permissionedIds = patient.permissionedIds;

            //check whether that id is present in the permissionedIds or not and if yes remove that entry
            if (args.requesterId in permissionedIds) {
                delete permissionedIds[args.requesterId];
                patient.permissionedIds = permissionedIds;
                await ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));

                //Delete the patient from the patient array for the requester
                let requesterAsBytes = await ctx.stub.getState(args.requesterId);
                let requester = JSON.parse(requesterAsBytes);
                let patients = requester.patients;
                let index = patients.indexOf(args.patientId);
                if (index > -1) {
                    patients.splice(index, 1);
                    requester.patients = patients;
                    await ctx.stub.putState(args.requesterId, Buffer.from(JSON.stringify(requester)));
                }

                let response = `Access has been revoked for the requester with the id ${args.requesterId}`;
                return response;
            } else {
                throw new Error(`No such Permissioned id with id ${args.requesterId}`);
            }
        } else {
            throw new Error(`patient with id ${args.patientId} or requester with id ${args.requesterId} doesn't exists`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<any>}
     */
    async modifyAssetInfo(ctx, args) {
        let assetAsBytes = await ctx.stub.getState(args.assetId);
        let asset = JSON.parse(assetAsBytes);
        if (asset.type === 'Patient') {
            delete asset.password;
            delete asset.appointments;
            delete asset.permissionedIds;
            delete asset.requesters;
            delete asset.ehrs;
            delete asset.bills;
            delete asset.labRecords;
            delete asset.medicineReceipts;
        } else if (asset.type === 'Doctor') {
            delete asset.password;
            delete asset.patients;
            delete asset.appointments;
            delete asset.patientsAttended;
        } else if (asset.type === 'Laboratory') {
            delete asset.password;
            delete asset.patients;
            delete asset.patientsAttended;
        } else if (asset.type === 'Pharmacy') {
            delete asset.password;
            delete asset.patients;
            delete asset.patientsAttended;
        } else if (asset.type === 'Researcher') {
            delete asset.password;
            delete asset.patients;
        } else if (asset.type === 'Insurance') {
            delete asset.password;
            delete asset.patients;
        } else if (asset.type === 'Hospital') {
            delete asset.password;
            delete asset.patients;
        }
        delete asset.aadhaar;
        return asset;
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<any|*[]>}
     */
    async readHospitalAssets(ctx, args) {
        args = await JSON.parse(args);
        let hospitalExists = await this.assetExists(ctx, args.hospitalId);
        if (hospitalExists) {
            let hospitalAsBytes = await ctx.stub.getState(args.hospitalId);
            let hospital = JSON.parse(hospitalAsBytes);

            let assetExits = await this.assetExists(ctx, args.assetId);
            if (assetExits) {
                let index = -1;
                if (args.listType === 'patients') {
                    index = hospital.patients.indexOf(args.assetId);
                    if (index > -1) {
                        return await this.readDocuments(ctx, args.assetId, hospital.registrationId);
                    }
                } else {
                    if (args.listType === 'patientsVisited') {
                        index = hospital.patientsVisited.indexOf(args.assetId);
                    } else if (args.listType === 'doctors') {
                        index = hospital.doctors.indexOf(args.assetId);
                    } else if (args.listType === 'pharmacies') {
                        index = hospital.pharmacies.indexOf(args.assetId);
                    } else if (args.listType === 'laboratories') {
                        index = hospital.laboratories.indexOf(args.assetId);
                    } else if (args.listType === 'bills') {
                        index = hospital.bills.indexOf(args.assetId);
                    } else if (args.listType === 'appointments') {
                        index = hospital.appointments.indexOf(args.assetId);
                    }
                    if (index > -1) {
                        return await this.modifyAssetInfo(ctx, args);
                    } else {
                        throw new Error(`asset not found`);
                    }
                }
            } else {
                throw new Error(`the asset ${args.assetId} is not part of the hospital list`);
            }
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<any|*[]>}
     */
    async readDoctorAssets(ctx, args) {
        args = await JSON.parse(args);
        let doctorExists = await this.assetExists(ctx, args.doctorId);
        if (doctorExists) {
            let doctorAsBytes = await ctx.stub.getState(args.doctorId);
            let doctor = JSON.parse(doctorAsBytes);

            let assetExits = await this.assetExists(ctx, args.assetId);
            if (assetExits) {
                let index = -1;
                if (args.listType === 'patients') {
                    index = doctor.patients.indexOf(args.assetId);
                    if (index > -1) {
                        return await this.readDocuments(ctx, args.assetId, doctor.medicalRegistrationNo);
                    }
                } else {
                    if (args.listType === 'patientsAttended') {
                        index = doctor.patientsAttended.indexOf(args.assetId);
                    } else if (args.listType === 'appointments') {
                        index = doctor.appointments.indexOf(args.assetId);
                    }
                    if (index > -1) {
                        return await this.modifyAssetInfo(ctx, args);
                    } else {
                        throw new Error(`asset not found`);
                    }
                }
            } else {
                throw new Error(`asset with id ${args.assetId} doesn't exist for the doctor`);
            }
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<*[]|any>}
     */
    async readPharmacyAssets(ctx, args) {
        args = await JSON.parse(args);
        let pharmacyExists = await this.assetExists(ctx, args.pharmacyId);
        if (pharmacyExists) {
            let pharmacyAsBytes = await ctx.stub.getState(args.pharmacyId);
            let pharmacy = JSON.parse(pharmacyAsBytes);

            let assetExits = await this.assetExists(ctx, args.assetId);
            if (assetExits) {
                if (args.listType === 'patients') {
                    let index = pharmacy.patients.indexOf(args.assetId);
                    if (index > -1) {
                        return await this.readDocuments(ctx, args.assetId, pharmacy.registrationId);
                    }
                } else {
                    let index = -1;
                    if (args.listType === 'appointments') {
                        index = pharmacy.appointments.indexOf(args.assetId);
                    } else if (args.listType === 'patientsAttended') {
                        index = pharmacy.patientsAttended.indexOf(args.assetId);
                    }
                    if (index > -1) {
                        return await this.modifyAssetInfo(ctx, args);
                    } else {
                        throw new Error(`asset not found`);
                    }
                }
            }


        } else {
            throw new Error(`asset with id ${args.assetId} doesn't exist for the pharmacy`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<any>}
     */
    async readPatientAssets(ctx, args) {
        args = JSON.parse(args);
        let patientExists = await this.assetExists(ctx, args.patientId);
        if (patientExists) {
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);
            let assetExists = await this.assetExists(ctx, args.assetId);
            if (assetExists) {
                let index = -1;
                if (args.listType === 'emergencyContacts') {
                    index = patient.emergencyContacts.indexOf(args.assetId);
                } else if (args.listType === 'ehrs') {
                    index = patient.ehrs.indexOf(args.assetId);
                } else if (args.listType === 'requesters') {
                    index = patient.requesters.indexOf(args.assetId);
                } else if (args.listType === 'bills') {
                    index = patient.bills.indexOf(args.assetId);
                } else if (args.listType === 'labRecords') {
                    index = patient.labRecords.indexOf(args.assetId);
                } else if (args.listType === 'medicineReceipts') {
                    index = patient.medicineReceipts.indexOf(args.assetId);
                } else if (args.listType === 'appointments') {
                    index = patient.appointments.indexOf(args.assetId);
                } else if (args.listType === 'permissionedIds') {
                    let documentIds = patient.permissionedIds[args.assetId] || [];
                    if (documentIds && documentIds.length > 0) {
                        return await this.modifyAssetInfo(ctx, args);
                    }
                }
                if (index > -1) {
                    return await this.modifyAssetInfo(ctx, args);
                } else {
                    throw new Error(`asset not found`);
                }
            }
        } else {
            throw new Error(`patient with ide ${args.patientId} doesn't exist`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<*[]|any>}
     */
    async readLaboratoryAssets(ctx, args) {
        args = await JSON.parse(args);
        let laboratoryExists = await this.assetExists(ctx, args.laboratoryId);
        if (laboratoryExists) {
            let laboratoryAsBytes = await ctx.stub.getState(args.laboratoryId);
            let laboratory = JSON.parse(laboratoryAsBytes);

            let assetExits = await this.assetExists(ctx, args.assetId);
            if (assetExits) {
                if (args.listType === 'patients') {
                    let index = laboratory.patients.indexOf(args.assetId);
                    if (index > -1) {
                        return await this.readDocuments(ctx, args.assetId, laboratory.registrationId);
                    }
                } else {
                    let index = -1;
                    if (args.listType === 'appointments') {
                        index = laboratory.appointments.indexOf(args.assetId);
                    } else if (args.listType === 'patientsAttended') {
                        index = laboratory.patientsAttended.indexOf(args.assetId);
                    }
                    if (index > -1) {
                        return await this.modifyAssetInfo(ctx, args);
                    } else {
                        throw new Error(`asset not found`);
                    }
                }

            } else {
                throw new Error(`asset with id ${args.assetId} doesn't exist for the laboratory`);
            }
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<*[]>}
     */
    async readResearcherAssets(ctx, args) {
        args = await JSON.parse(args);
        let researcherExists = await this.assetExists(ctx, args.researcherId);
        if (researcherExists) {
            let researcherAsBytes = await ctx.stub.getState(args.researcherId);
            let researcher = JSON.parse(researcherAsBytes);
            let assetExists = await this.assetExists(ctx, args.assetId);
            if (assetExists) {
                let index = researcher.patients.indexOf(args.assetId);
                if (index > -1) {
                    return await this.readDocuments(ctx, args.assetId, researcher.registrationId);
                } else {
                    throw new Error(`asset not found`);
                }
            } else {
                throw new Error(`asset ${args.assetId} doesn't exits`);
            }
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<*[]>}
     */
    async readInsurerAssets(ctx, args) {
        args = await JSON.parse(args);
        let insurerExists = await this.assetExists(ctx, args.insurerId);
        if (insurerExists) {
            let insurerAsBytes = await ctx.stub.getState(args.insurerId);
            let insurer = JSON.parse(insurerAsBytes);
            let assetExists = await this.assetExists(ctx, args.assetId);
            if (assetExists) {
                let index = insurer.patients.indexOf(args.assetId);
                if (index > -1) {
                    return await this.readDocuments(ctx, args.assetId, insurer.registrationId);
                } else {
                    throw new Error(`asset not found`);
                }
            } else {
                throw new Error(`asset ${args.assetId} doesn't exits`);
            }
        }
    }

    /**
     *
     * @param ctx
     * @param assetId
     * @param requesterId
     * @returns {Promise<[]>}
     */
    async readDocuments(ctx, assetId, requesterId) {
        let patientAsBytes = await ctx.stub.getState(assetId);
        let patient = JSON.parse(patientAsBytes);
        let documentIds = patient.permissionedIds[requesterId];
        let assets = [];
        //push the patient info first and then the documents along with that
        delete patient.password;
        delete patient.appointments;
        delete patient.permissionedIds;
        delete patient.requesters;
        delete patient.ehrs;
        delete patient.bills;
        delete patient.labRecords;
        delete patient.medicineReceipts;
        delete patient.aadhaar;
        assets.push(patient);
        for (let i = 0; i < documentIds.length; i++) {
            let documentAsBytes = await ctx.stub.getState(documentIds[i]);
            let document = JSON.parse(documentAsBytes);
            assets.push(document);
        }
        return assets;
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<any>}
     */
    async getModifiedAsset(ctx, args) {

        args = JSON.parse(args);
        let assetExists = await this.assetExists(ctx, args.id);
        if (assetExists) {
            let assetAsBytes = await ctx.stub.getState(args.id);
            let asset = JSON.parse(assetAsBytes);
            delete asset.password;
            return asset;
        } else {
            throw new Error(`the asset with id ${args.id} doesn't exist`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<*>}
     */
    async verifyPassword(ctx, args) {
        args = await JSON.parse(args);
        let assetExists = await this.assetExists(ctx, args.id);
        if (assetExists) {
            let assetAsBytes = await ctx.stub.getState(args.id);
            let asset = JSON.parse(assetAsBytes);
            return asset.password === args.password;
        } else {
            throw new Error(`the id ${args.id} doesn't exist`);
        }
    }

    async updateAsset(ctx, args) {
        args = await JSON.parse(args);
        const exists = await this.assetExists(ctx, args.id);
        if (!exists) {
            throw new Error(`The ehr ${args.id} does not exist`);
        }
        await ctx.stub.putState(args.id, Buffer.from(JSON.stringify(args)));
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createHospital(ctx, args) {
        args = await JSON.parse(args);
        let hospitalExists = await this.assetExists(ctx, args.registrationId);

        if (!hospitalExists) {
            // initialise empty lists of id's of doctors, patients and appointments
            let doctors = [];
            let appointments = [];
            let patients = [];
            let bills = [];
            let laboratories = [];
            let pharmacies = [];
            let patientsVisited = [];
            let remainingPatientBills = [];

            //create a new hospital
            let newHospital = await new Hospital(args.name, args.registrationId, args.userName, args.password, args.address, args.phone);

            newHospital.doctors = doctors;
            newHospital.appointments = appointments;
            newHospital.patients = patients;
            newHospital.laboratories = laboratories;
            newHospital.bills = bills;
            newHospital.pharmacies = pharmacies;
            newHospital.patientsVisited = patientsVisited;
            newHospital.remainingPatientBills = remainingPatientBills;

            //put the hospital in the global state
            await ctx.stub.putState(newHospital.registrationId, Buffer.from(JSON.stringify(newHospital)));

            let response = `Hospital with registrationId ${newHospital.registrationId} is updated in the world state`;
            return response;
        } else {
            throw new Error(`hospital with id ${args.hospitalId} already exists`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async generateBill(ctx, args) {
        args = await JSON.parse(args);
        let hospitalExists = await this.assetExists(ctx, args.hospitalId);
        let patientExists = await this.assetExists(ctx, args.patientId);
        let doctorExists = await this.assetExists(ctx, args.doctorId);
        let laboratoryExists = await this.assetExists(ctx, args.laboratoryId);
        let pharmacyExists = await this.assetExists(ctx, args.pharmacyId);

        if (hospitalExists && patientExists && doctorExists) {

            if (!laboratoryExists) {
                args.laboratoryId = '';
            }
            if (!pharmacyExists) {
                args.pharmacyId = '';
            }
            //generate a new bill with all the details
            let newBill = await new Bill(args.billId, args.hospitalId, args.patientId, args.doctorId, args.laboratoryId, args.pharmacyId, args.time, args.amount, args.record);
            await ctx.stub.putState(newBill.billId, Buffer.from(JSON.stringify(newBill)));

            //update the patient with the bill
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);
            let bills = patient.bills;
            bills.push(newBill.billId);
            patient.bills = bills;
            await ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));

            //update the patient with the bill
            let hospitalAsBytes = await ctx.stub.getState(args.hospitalId);
            let hospital = JSON.parse(hospitalAsBytes);
            let index = hospital.remainingPatientBills.indexOf(args.patientId);
            if (index > -1) {
                hospital.remainingPatientBills.splice(index, 1);
            }
            bills = hospital.bills;
            bills.push(newBill.billId);
            hospital.bills = bills;
            await ctx.stub.putState(args.hospitalId, Buffer.from(JSON.stringify(hospital)));

            let response = `Bill has been generated with id ${newBill.billId} and updated for both the patient and hospital`;
            return response;

        } else {
            throw new Error(`Either the patient or hospital entity is not correct`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createInsurance(ctx, args) {
        args = await JSON.parse(args);
        let insurerExists = await this.assetExists(ctx, args.registrationId);
        if (!insurerExists) {
            let patients = [];

            //create a new insurer and update that in the world state
            let newInsurer = await new Insurance(args.name, args.registrationId, args.userName, args.password, args.address, args.phone);
            newInsurer.patients = patients;

            await ctx.stub.putState(newInsurer.registrationId, Buffer.from(JSON.stringify(newInsurer)));

            let response = `a new insurer created with id ${newInsurer.registrationId} `;
            return response;
        } else {
            throw new Error(`Insurer with id ${args.registrationId} already exists`);
        }

    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createLaboratory(ctx, args) {
        args = await JSON.parse(args);
        let hospitalExists = await this.assetExists(ctx, args.hospitalId);
        let laboratoryExists = await this.assetExists(ctx, args.registrationId);
        if (hospitalExists && !laboratoryExists) {
            //create a laboratory and update that in the world state
            let patients = [];
            let patientsAttended = [];
            let appointments = [];
            let newLaboratory = await new Laboratory(args.userName, args.password, args.hospitalId, args.registrationId, args.phone);
            newLaboratory.appointments = appointments;
            newLaboratory.patients = patients;
            newLaboratory.patientsAttended = patientsAttended;
            newLaboratory.laboratoryType = args.laboratoryType;

            await ctx.stub.putState(newLaboratory.registrationId, Buffer.from(JSON.stringify(newLaboratory)));

            //update that laboratory in the hospital world state
            let hospitalAsBytes = await ctx.stub.getState(args.hospitalId);
            let hospital = JSON.parse(hospitalAsBytes);
            let laboratories = hospital.laboratories;
            laboratories.push(newLaboratory.registrationId);
            hospital.laboratories = laboratories;
            await ctx.stub.putState(args.hospitalId, Buffer.from(JSON.stringify(hospital)));

            let response = `the laboratory with id ${newLaboratory.registrationId} has been updated in the world state`;
            return response;
        } else {
            throw new Error(`No such hospital exists or laboratory with id ${args.registrationId} already exists`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createResearcher(ctx, args) {
        args = await JSON.parse(args);
        let researcherExists = await this.assetExists(ctx, args.registrationId);
        if (!researcherExists) {
            let patients = [];

            //create a new Researcher and update that in the world state
            let newResearcher = await new Researcher(args.name, args.registrationId, args.userName, args.password, args.address, args.phone);
            newResearcher.patients = patients;

            await ctx.stub.putState(newResearcher.registrationId, Buffer.from(JSON.stringify(newResearcher)));

            let response = `a new researcher created with id ${newResearcher.userName} `;
            return response;
        } else {
            throw new Error(`Researcher with the Id ${args.registrationId} already exists`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createPharmacy(ctx, args) {
        args = await JSON.parse(args);
        let hospitalExists = await this.assetExists(ctx, args.hospitalId);
        let pharmacyExists = await this.assetExists(ctx, args.registrationId);
        if (hospitalExists && !pharmacyExists) {
            let patients = [];
            let patientsAttended = [];
            let appointments = [];
            let newPharmacy = await new Pharmacy(args.userName, args.password, args.hospitalId, args.registrationId, args.phone);

            newPharmacy.patients = patients;
            newPharmacy.appointments = appointments;
            newPharmacy.patientsAttended = patientsAttended;

            await ctx.stub.putState(newPharmacy.registrationId, Buffer.from(JSON.stringify(newPharmacy)));

            //update that pharmacy in the hospital world state
            let hospitalAsBytes = await ctx.stub.getState(args.hospitalId);
            let hospital = JSON.parse(hospitalAsBytes);
            let pharmacies = hospital.pharmacies;
            pharmacies.push(newPharmacy.registrationId);
            hospital.pharmacies = pharmacies;
            await ctx.stub.putState(args.hospitalId, Buffer.from(JSON.stringify(hospital)));

            let response = `the pharmacy with id ${newPharmacy.registrationId} has been updated in the world state`;
            return response;
        } else {
            throw new Error(`No such hospital exists or the pharmacy with id ${args.registrationId} already exists`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createDoctor(ctx, args) {
        args = await JSON.parse(args);
        let hospitalExists = await this.assetExists(ctx, args.hospitalId);
        let doctorExists = await this.assetExists(ctx, args.medicalRegistrationNo);
        if (hospitalExists && !doctorExists) {
            //initialise empty patient requests and patients
            let patients = [];
            let appointments = [];
            let patientsAttended = [];

            let newDoctor = await new Doctor(args.firstName, args.lastName, args.address, args.aadhaar, args.medicalRegistrationNo, args.DOB, args.gender, args.userName, args.password, args.specialisation, args.phone);

            //assign the doctor a hospital and update the info in the hospital's global state
            newDoctor.currentHospital = args.hospitalId;

            newDoctor.patients = patients;
            newDoctor.appointments = appointments;
            newDoctor.patientsAttended = patientsAttended;

            //update the doctor in the hospital database
            let hospitalAsBytes = await ctx.stub.getState(args.hospitalId);
            let hospital = JSON.parse(hospitalAsBytes);
            let doctors = hospital.doctors;
            doctors.push(newDoctor.medicalRegistrationNo);
            hospital.doctors = doctors;
            await ctx.stub.putState(hospital.registrationId, Buffer.from(JSON.stringify(hospital)));

            //put the doctor in the global state
            await ctx.stub.putState(newDoctor.medicalRegistrationNo, Buffer.from(JSON.stringify(newDoctor)));

            let response = `Doctor with medicalRegistrationNo ${newDoctor.medicalRegistrationNo} is updated in the world state`;
            return response;

        } else {
            throw new Error(`There is no such hospital with id ${args.hospitalId} or a doctor with id ${args.medicalRegistrationNo} already exists`);
        }

    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createPatient(ctx, args) {
        args = await JSON.parse(args);
        let patientExists = await this.assetExists(ctx, args.userName);
        if (!patientExists) {
            let permissionedIds = {};
            let emergencyContacts = [];
            let ehrs = [];
            let requesters = [];
            let bills = [];
            let labRecords = [];
            let medicineReceipts = [];
            let appointments = [];

            let newPatient = await new Patient(args.firstName, args.lastName, args.address, args.aadhaar, args.DOB, args.gender, args.bloodGroup, args.userName, args.password, args.phone);

            newPatient.permissionedIds = permissionedIds;
            newPatient.emergencyContacts = emergencyContacts;
            newPatient.ehrs = ehrs;
            newPatient.requesters = requesters;
            newPatient.bills = bills;
            newPatient.medicineReceipts = medicineReceipts;
            newPatient.labRecords = labRecords;
            newPatient.appointments = appointments;

            await ctx.stub.putState(newPatient.userName, Buffer.from(JSON.stringify(newPatient)));

            let response = `Patient with username ${newPatient.userName} is updated in the world state`;
            return response;
        } else {
            throw new Error(`Patient with username ${args.userName} already exists`);
        }

    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createAppointment(ctx, args) {
        args = await JSON.parse(args);

        //check whether both the hospital and the patient already exists or not
        let hospitalExists = await this.assetExists(ctx, args.hospitalId);
        let patientExists = await this.assetExists(ctx, args.patientId);

        if (hospitalExists && patientExists) {
            let newAppointment = await new Appointment(args.appointmentId, args.hospitalId, args.patientId, args.description, args.time);

            //update the appointment in the world state of the hospital appointments
            let hospitalAsBytes = await ctx.stub.getState(args.hospitalId);
            let hospital = await JSON.parse(hospitalAsBytes);
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = await JSON.parse(patientAsBytes);

            //update the appointment in the hospital global state
            let appointments = hospital.appointments;
            appointments.push(newAppointment.appointmentId);
            hospital.appointments = appointments;
            let index = hospital.patientsVisited.indexOf(args.patientId);
            if (index < 0) {
                hospital.patientsVisited.push(args.patientId);
            }
            await ctx.stub.putState(hospital.registrationId, Buffer.from(JSON.stringify(hospital)));

            //update the appointment in the patient global state
            appointments = patient.appointments;
            appointments.push(newAppointment.appointmentId);
            patient.appointments = appointments;
            await ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));

            await ctx.stub.putState(newAppointment.appointmentId, Buffer.from(JSON.stringify(newAppointment)));

            let response = `Appointment with the appointmentId ${newAppointment.appointmentId} is updated in the global state`;
            return response;

        } else {
            throw new Error(`Either the hospital id ${args.hospitalId} or the patient Id ${args.userName}is not correct`)
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async assignDoctor(ctx, args) {
        args = await JSON.parse(args);

        //check whether both the doctor and the appointment exists
        let doctorExists = await this.assetExists(ctx, args.doctorId);
        let appointmentExists = await this.assetExists(ctx, args.appointmentId);

        if (doctorExists && appointmentExists) {

            let doctorAsBytes = await ctx.stub.getState(args.doctorId);
            let doctor = await JSON.parse(doctorAsBytes);
            let appointmentAsBytes = await ctx.stub.getState(args.appointmentId);
            let appointment = await JSON.parse(appointmentAsBytes);
            let hospitalAsBytes = await ctx.stub.getState(args.hospitalId);
            let hospital = await JSON.parse(hospitalAsBytes);

            //update the patient and the appointment ids in the doctor's global state
            let appointments = doctor.appointments;
            appointments.push(appointment.appointmentId);
            doctor.appointments = appointments;

            await ctx.stub.putState(doctor.medicalRegistrationNo, Buffer.from(JSON.stringify(doctor)));

            //update the appointment with the doctor id and update global state
            appointment.doctorId = doctor.medicalRegistrationNo;
            await ctx.stub.putState(appointment.appointmentId, Buffer.from(JSON.stringify(appointment)));

            appointments = hospital.appointments;

            //remove that appointment from the appointment list of the hospital and update it in the global state of hospital
            let index = appointments.indexOf(appointment.appointmentId);
            if (index > -1) {
                appointments.splice(index, 1);
            }
            hospital.remainingPatientBills.push(appointment.patientId);
            await ctx.stub.putState(hospital.registrationId, Buffer.from(JSON.stringify(hospital)));

            let response = `Appointment with the appointmentId ${appointment.appointmentId} is assigned a doctor with id ${doctor.medicalRegistrationNo}`;
            return response;

        } else {
            throw new Error(`Doctor or appointment with ids ${args.doctorId} or ${args.appointmentId} doesn't exist`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async addEmergencyContact(ctx, args) {
        args = await JSON.parse(args);
        let patientExists = await this.assetExists(ctx, args.patientId);
        let contactExists = await this.assetExists(ctx, args.contactId);
        if (patientExists && contactExists) {
            //the emergency contacts are updated in the patient global state and will be used to show to all the people who are in the emergency contact
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = await JSON.parse(patientAsBytes);
            let emergencyContacts = patient.emergencyContacts;
            emergencyContacts.push(args.contactId);
            patient.emergencyContacts = emergencyContacts;
            await ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));

            let response = `the emergency contact ${args.contactId} is updated for the patient ${patient.userName}`;
            return response;
        } else {
            throw new Error(`either the patient id ${args.patientId} or the contact id ${args.contactId} doesn't exist`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async removeEmergencyContact(ctx, args) {
        args = await JSON.parse(args);
        let patientExists = await this.assetExists(ctx, args.patientId);
        if (patientExists) {
            //the emergency contact is deleted and the patient is updated
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = await JSON.parse(patientAsBytes);
            let emergencyContacts = patient.emergencyContacts;
            let index = emergencyContacts.indexOf(args.contactId);
            if (index > -1) {
                emergencyContacts.splice(index, 1);
                patient.emergencyContacts = emergencyContacts;
                await ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));
            }

            let response = `the emergency contact ${args.contactId} is deleted for the patient ${patient.userName}`;
            return response;
        } else {
            throw new Error(`the patient id ${args.patientId}  doesn't exist`);
        }
    }

    /**
     *
     * @param ctx
     * @param id
     * @returns {Promise<boolean|boolean>}
     */
    async assetExists(ctx, id) {
        const buffer = await ctx.stub.getState(id);
        return (!!buffer && buffer.length > 0);
    }

    /**
     *
     * @param ctx
     * @param queryString
     * @returns {Promise<string>}
     */
    async queryWithQueryString(ctx, queryString) {

        console.log('query String');
        console.log(JSON.stringify(queryString));

        let resultsIterator = await ctx.stub.getQueryResult(queryString);

        let allResults = [];

        // eslint-disable-next-line no-constant-condition
        while (true) {
            let res = await resultsIterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};

                console.log(res.value.value.toString('utf8'));

                jsonRes.Key = res.value.key;

                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }

                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await resultsIterator.close();
                console.info(allResults);
                console.log(JSON.stringify(allResults));
                return JSON.stringify(allResults);
            }
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async deleteAsset(ctx, args) {
        args = await JSON.parse(args);
        let assetExists = await this.assetExists(ctx, args.assetId);
        if (assetExists) {
            await ctx.stub.deleteState(args.assetId);
            return `asset with id ${args.assetId} has been deleted`;
        } else {
            throw new Error(`No such asset with id ${args.assetId}`);
        }
    }

    async readMyAsset(ctx, args) {
        args = JSON.parse(args);
        let assetExists = await this.assetExists(ctx, args.id);
        if (assetExists) {
            let response = await ctx.stub.getState(args.id);
            response = JSON.parse(response);
            return response;
        } else {
            throw new Error(`No such asset with id ${args.id}`);
        }
    }

    async checkDocumentAccess(ctx, args) {
        args = JSON.parse(args);
        let patientExists = await this.assetExists(ctx, args.patientId);
        let requesterExists = await this.assetExists(ctx, args.requesterId);
        if (patientExists && requesterExists) {
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);
            let documentIds = patient.permissionedIds[args.requesterId];
            if (documentIds && documentIds.length) {
                let index = documentIds.indexOf(args.documentId);
                return index > -1;
            }
            return false;
        }
        return "no such patient or requester exists";
    }
}

module.exports = EhrContract;
