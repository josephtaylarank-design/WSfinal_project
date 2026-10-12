/* =====================================================
   WS 301 - Student Registration Form
   Concepts: addEventListener, submit event, event object,
   preventDefault, trim, classList add/remove/toggle,
   data-* + dataset, attribute manipulation
   ===================================================== */

// ---------- 1. Grab elements ----------
const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");

const studentId = document.getElementById("studentId");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const program = document.getElementById("program");
const yearLevel = document.getElementById("yearLevel");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const address = document.getElementById("address");
const agree = document.getElementById("agree");
const genderRadios = document.querySelectorAll('input[name="gender"]');
const genderGroup = document.getElementById("genderGroup");

// ---------- 2. Helper functions ----------

// Show a specific error message under a field and highlight it
function showError(input, message) {
  const errorSpan = document.getElementById(input.id + "-error");
  errorSpan.textContent = message;
  input.classList.add("error");          // classList.add()
}

// Clear the error message and highlight when the field is corrected
function clearError(input) {
  const errorSpan = document.getElementById(input.id + "-error");
  errorSpan.textContent = "";
  input.classList.remove("error");       // classList.remove()
}

// Same idea but for the gender radio group
function showGenderError(message) {
  document.getElementById("gender-error").textContent = message;
  genderGroup.classList.add("error");
}
function clearGenderError() {
  document.getElementById("gender-error").textContent = "";
  genderGroup.classList.remove("error");
}

// ---------- 3. Individual validators ----------
// Each returns true if valid, false if invalid (and shows its own message).
// The field name comes from the data-label attribute using dataset.

function validateStudentId() {
  const value = studentId.value.trim();   // trim()
  const label = studentId.dataset.label;  // dataset
  if (value === "") {
    showError(studentId, `${label} is required.`);
    return false;
  }
  if (!/^\d{4}-\d{5}$/.test(value)) {
    showError(studentId, `${label} must follow the format ${studentId.dataset.format} (e.g. 2024-00123).`);
    return false;
  }
  clearError(studentId);
  return true;
}

function validateFullName() {
  const value = fullName.value.trim();
  const label = fullName.dataset.label;
  const min = Number(fullName.dataset.min);
  if (value === "") {
    showError(fullName, `${label} is required.`);
    return false;
  }
  if (value.length < min) {
    showError(fullName, `${label} must be at least ${min} characters.`);
    return false;
  }
  if (!/^[A-Za-z\s.'-]+$/.test(value)) {
    showError(fullName, `${label} may only contain letters, spaces, and . ' -`);
    return false;
  }
  clearError(fullName);
  return true;
}

function validateEmail() {
  const value = email.value.trim();
  const label = email.dataset.label;
  if (value === "") {
    showError(email, `${label} is required.`);
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    showError(email, "Please enter a valid email address (e.g. name@example.com).");
    return false;
  }
  clearError(email);
  return true;
}

function validatePhone() {
  const value = phone.value.trim();
  const label = phone.dataset.label;
  if (value === "") {
    showError(phone, `${label} is required.`);
    return false;
  }
  // Required format: 11 digits starting with 09
  if (!/^09\d{9}$/.test(value)) {
    showError(phone, `${label} must be ${phone.dataset.format} (e.g. 09123456789).`);
    return false;
  }
  clearError(phone);
  return true;
}

function validateDob() {
  const value = dob.value;
  const label = dob.dataset.label;
  if (value === "") {
    showError(dob, `${label} is required.`);
    return false;
  }
  const birth = new Date(value);
  const today = new Date();
  if (birth > today) {
    showError(dob, `${label} cannot be in the future.`);
    return false;
  }
  // Compute age and compare with the data-min-age attribute
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  const minAge = Number(dob.dataset.minAge);
  if (age < minAge) {
    showError(dob, `You must be at least ${minAge} years old to register.`);
    return false;
  }
  clearError(dob);
  return true;
}

function validateGender() {
  const selected = document.querySelector('input[name="gender"]:checked');
  if (!selected) {
    showGenderError("Please select your gender.");
    return false;
  }
  clearGenderError();
  return true;
}

function validateProgram() {
  if (program.value === "") {
    showError(program, "Please select your program.");
    return false;
  }
  clearError(program);
  return true;
}

function validateYearLevel() {
  if (yearLevel.value === "") {
    showError(yearLevel, "Please select your year level.");
    return false;
  }
  clearError(yearLevel);
  return true;
}

function validatePassword() {
  const value = password.value; // do not trim passwords' inner content, but check emptiness
  const label = password.dataset.label;
  const min = Number(password.dataset.min);
  if (value.trim() === "") {
    showError(password, `${label} is required.`);
    return false;
  }
  if (value.length < min) {
    showError(password, `${label} must be at least ${min} characters.`);
    return false;
  }
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    showError(password, `${label} must contain at least one letter and one number.`);
    return false;
  }
  clearError(password);
  return true;
}

function validateConfirmPassword() {
  const label = confirmPassword.dataset.label;
  if (confirmPassword.value === "") {
    showError(confirmPassword, `${label} is required.`);
    return false;
  }
  if (confirmPassword.value !== password.value) {
    showError(confirmPassword, "Passwords do not match.");
    return false;
  }
  clearError(confirmPassword);
  return true;
}

function validateAddress() {
  const value = address.value.trim();
  const label = address.dataset.label;
  const min = Number(address.dataset.min);
  if (value === "") {
    showError(address, `${label} is required.`);
    return false;
  }
  if (value.length < min) {
    showError(address, `${label} must be at least ${min} characters (include street and city).`);
    return false;
  }
  clearError(address);
  return true;
}

function validateAgree() {
  const errorSpan = document.getElementById("agree-error");
  if (!agree.checked) {
    errorSpan.textContent = "You must agree to the terms and conditions.";
    return false;
  }
  errorSpan.textContent = "";
  return true;
}

// ---------- 4. Submit event ----------
form.addEventListener("submit", function (event) {
  // event.preventDefault() stops the page from reloading/submitting
  event.preventDefault();

  // Run every validator (no short-circuit so ALL errors show at once)
  const results = [
    validateStudentId(),
    validateFullName(),
    validateEmail(),
    validatePhone(),
    validateDob(),
    validateGender(),
    validateProgram(),
    validateYearLevel(),
    validatePassword(),
    validateConfirmPassword(),
    validateAddress(),
    validateAgree()
  ];

  const allValid = results.every(function (r) { return r === true; });

  if (allValid) {
    // Success: show message using the name from the form and keep errors cleared
    const name = fullName.value.trim();
    successMessage.textContent = `Registration successful! Welcome, ${name}.`;
    successMessage.classList.remove("hidden");
    // The message sits below the buttons, so scroll to it so it is always visible
    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    // Failure: make sure no stale success message is visible
    successMessage.classList.add("hidden");
    successMessage.textContent = "";

    // Focus the first invalid field to help the user
    const firstInvalid = form.querySelector(".error");
    if (firstInvalid) {
      const focusable = firstInvalid.querySelector("input") || firstInvalid;
      focusable.focus();
    }
  }
});

// ---------- 5. Live feedback: errors disappear when corrected ----------
// The event object tells us which field triggered the event.
const liveValidators = {
  studentId: validateStudentId,
  fullName: validateFullName,
  email: validateEmail,
  phone: validatePhone,
  dob: validateDob,
  program: validateProgram,
  yearLevel: validateYearLevel,
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
  address: validateAddress
};

form.addEventListener("input", function (event) {
  const id = event.target.id;
  // Only re-validate a field that is currently showing an error
  if (event.target.classList.contains("error") && liveValidators[id]) {
    liveValidators[id]();
  }
  // If the password changes, re-check confirm password if it already has an error
  if (id === "password" && confirmPassword.classList.contains("error")) {
    validateConfirmPassword();
  }
});

genderRadios.forEach(function (radio) {
  radio.addEventListener("change", validateGender);
});
agree.addEventListener("change", validateAgree);

// ---------- 6. Show/Hide Password (classList.toggle + attribute manipulation) ----------
document.querySelectorAll(".toggle-btn").forEach(function (button) {
  button.addEventListener("click", function (event) {
    // data-target tells us which input this button controls (dataset)
    const targetInput = document.getElementById(event.target.dataset.target);

    // classList.toggle() switches the highlighted style on/off
    event.target.classList.toggle("active");

    // Attribute manipulation: change the input's type attribute
    const isHidden = targetInput.getAttribute("type") === "password";
    targetInput.setAttribute("type", isHidden ? "text" : "password");

    // Update the button text, aria-label, and data-state to match
    event.target.textContent = isHidden ? "Hide" : "Show";
    event.target.setAttribute("aria-label", (isHidden ? "Hide " : "Show ") + targetInput.dataset.label.toLowerCase());
    event.target.dataset.state = isHidden ? "visible" : "hidden";
  });
});

// ---------- 7. Reset ----------
form.addEventListener("reset", function () {
  // Clear every error message and error class
  form.querySelectorAll(".error").forEach(function (el) {
    el.classList.remove("error");
  });
  form.querySelectorAll(".error-message").forEach(function (span) {
    span.textContent = "";
  });

  // Remove success message
  successMessage.classList.add("hidden");
  successMessage.textContent = "";

  // Return password fields and toggle buttons to the original hidden state
  document.querySelectorAll(".toggle-btn").forEach(function (button) {
    const input = document.getElementById(button.dataset.target);
    input.setAttribute("type", "password");
    button.classList.remove("active");
    button.textContent = "Show";
    button.dataset.state = "hidden";
    button.setAttribute("aria-label", "Show " + input.dataset.label.toLowerCase());
  });
});