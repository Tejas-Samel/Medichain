export function validateForm(fields) {

    let errors = {};
    if (!fields.gender) {
        errors["gender"] = "*Please enter your gender.";
    }
    if (!fields.hospitalId) {
        errors["hospitalId"] = "*Please enter the hospital.";
    }
    if (!fields.address) {
        errors["address"] = "*Please enter your address.";
    }
    if (!fields.DOB) {
        errors["DOB"] = "*Please enter your date of birth.";
    }
    if (!fields.aadhaar) {
        errors["aadhaar"] = "*Please enter your aadhaar.";
    }
    if (typeof fields.aadhaar !== "undefined") {
        if (!fields.aadhaar.match(/^[0-9]{12}$/)) {
            errors["aadhaar"] = "*Please enter valid aadhaar no.";
        }
    }
    if (!fields.registrationId) {
        errors["registrationId"] = "*Please enter your registrationId.";
    }
    if (typeof fields.registrationId !== "undefined") {
        if (!fields.registrationId.match(/^[0-9]{12}$/)) {
            errors["registrationId"] = "*Please enter valid registrationId no.";
        }
    }
    if (!fields.medicalRegistrationNo) {
        errors["medicalRegistrationNo"] = "*Please enter your medicalRegistrationNo.";
    }
    if (typeof fields.medicalRegistrationNo !== "undefined") {
        if (!fields.medicalRegistrationNo.match(/^[0-9]{12}$/)) {
            errors["medicalRegistrationNo"] = "*Please enter valid medicalRegistrationNo no.";
        }
    }
    if (!fields.userName) {
        errors["userName"] = "*Please enter your username.";
    }

    if (typeof fields.userName !== "undefined") {
        if (!fields.userName.match(/^[a-zA-Z ]*$/)) {
            errors["userName"] = "*Please enter alphabet characters only.";
        }
    }
    if (!fields.specialisation) {
        errors["specialisation"] = "*Please enter your specialisation.";
    }

    if (typeof fields.specialisation !== "undefined") {
        if (!fields.specialisation.match(/^[a-zA-Z ]*$/)) {
            errors["specialisation"] = "*Please enter alphabet characters only.";
        }
    }
    if (!fields.firstName) {
        errors["firstName"] = "*Please enter your firstname.";
    }

    if (typeof fields.firstName !== "undefined") {
        if (!fields.firstName.match(/^[a-zA-Z ]*$/)) {
            errors["firstName"] = "*Please enter alphabet characters only.";
        }
    }
    if (!fields.lastName) {
        errors["lastName"] = "*Please enter your lastname.";
    }

    if (typeof fields.lastName !== "undefined") {
        if (!fields.lastName.match(/^[a-zA-Z ]*$/)) {
            errors["lastName"] = "*Please enter alphabet characters only.";
        }
    }

    if (!fields.phone) {
        errors["phone"] = "*Please enter your mobile no.";
    }

    if (typeof fields.phone !== "undefined") {
        if (!fields.phone.match(/^[0-9]{10}$/)) {
            errors["phone"] = "*Please enter valid mobile no.";
        }
    }

    if (!fields.password) {
        errors["password"] = "*Please enter your password.";
    }
    if (!fields.bloodGroup) {
        errors["bloodGroup"] = "*Please enter your bloodGroup.";
    }

    if (typeof fields.password !== "undefined") {
        if (!fields.password.match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
            errors["password"] = "*Please enter secure and strong password.";
        }
    }
    console.log(errors);

    return errors;
}
