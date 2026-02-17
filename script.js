
const form = document.getElementById('employeeForm');
const nameInput = form.name;
const srfidInput = form.srfid;
const nxidInput = form.nxid;
const rankSelect = form.rank;
const mobileInput = form.mobile;
const whatsappInput = form.whatsapp;
const emailInput = form.email;
const dobInput = form.dob;
const sameWhatsAppCheckbox = form.sameWhatsApp;

// Uppercase transformation for inputs
nameInput.addEventListener('input', () => {
  nameInput.value = nameInput.value.toUpperCase();
});
nxidInput.addEventListener('input', () => {
  nxidInput.value = nxidInput.value.toUpperCase();
});

// WhatsApp autofill logic
function updateWhatsApp() {
  if (sameWhatsAppCheckbox.checked) {
    whatsappInput.value = mobileInput.value;
    whatsappInput.readOnly = true;
  } else {
    whatsappInput.readOnly = false;
  }
}
mobileInput.addEventListener('input', () => {
  if (sameWhatsAppCheckbox.checked) {
    whatsappInput.value = mobileInput.value;
  }
});
sameWhatsAppCheckbox.addEventListener('change', () => {
  if (sameWhatsAppCheckbox.checked) {
    whatsappInput.value = mobileInput.value;
    whatsappInput.readOnly = true;
  } else {
    whatsappInput.readOnly = false;
    whatsappInput.value = '';
    whatsappInput.focus();
  }
});
updateWhatsApp();

const scriptURL = 'https://script.google.com/macros/s/AKfycbx8k8v5ulQpeFSkJpwWOem5gIci-opmvgNKd9KoAZKqSgjDzVUonmiFAza0UPftq-c/exec'; // Replace with your URL

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();

  let hasErrors = false;

  // Name validation
  const nameVal = nameInput.value.trim();
  if (!nameVal) {
    setError(nameInput, 'Name is required.');
    hasErrors = true;
  } else if (!/^[A-Z\s]+$/.test(nameVal)) {
    setError(nameInput, 'Name must contain only uppercase letters and spaces.');
    hasErrors = true;
  }

  // SRF ID validation
  const srfidVal = srfidInput.value.trim();
  if (!srfidVal) {
    setError(srfidInput, 'SRF ID is required.');
    hasErrors = true;
  } else if (!/^\d+$/.test(srfidVal)) {
    setError(srfidInput, 'SRF ID must contain only numbers.');
    hasErrors = true;
  }

  // NX ID validation
  const nxidVal = nxidInput.value.trim();
  if (!nxidVal) {
    setError(nxidInput, 'NX ID is required.');
    hasErrors = true;
  } else if (!/^SRF\d{4}$/.test(nxidVal)) {
    setError(nxidInput, 'NX ID must start with "SRF" followed by exactly 4 digits.');
    hasErrors = true;
  }

  // Rank validation
  if (!rankSelect.value) {
    setError(rankSelect, 'Please select your rank.');
    hasErrors = true;
  }

  // Mobile validation
  const mobileVal = mobileInput.value.trim();
  if (!mobileVal) {
    setError(mobileInput, 'Mobile Number is required.');
    hasErrors = true;
  } else if (!/^\d{10}$/.test(mobileVal)) {
    setError(mobileInput, 'Mobile Number must be exactly 10 digits.');
    hasErrors = true;
  }

  // WhatsApp validation
  const whatsappVal = whatsappInput.value.trim();
  if (!whatsappVal) {
    setError(whatsappInput, 'WhatsApp Number is required.');
    hasErrors = true;
  } else if (!/^\d{10}$/.test(whatsappVal)) {
    setError(whatsappInput, 'WhatsApp Number must be exactly 10 digits.');
    hasErrors = true;
  }

  // Date of Birth validation - minimum 21 years old
  const dobVal = dobInput.value.trim();
  if (!dobVal) {
    setError(dobInput, 'Date of Birth is required.');
    hasErrors = true;
  } else {
    const dobDate = new Date(dobVal);
    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    if (dobDate > minAgeDate) {
      setError(dobInput, 'You must be at least 18 years old.');
      hasErrors = true;
    }
  }

  // Email validation
  const emailVal = emailInput.value.trim();
  if (!emailVal) {
    setError(emailInput, 'Email ID is required.');
    hasErrors = true;
  }

  if (!hasErrors) {
    // Format WhatsApp number before submit
    whatsappInput.value = 'wa.me/+91' + whatsappInput.value.trim();
    submitToGoogleSheet(form);
  }
});

function setError(element, message) {
  const formGroup = element.parentElement;
  const errorSpan = formGroup.querySelector('.error');
  errorSpan.textContent = message;
  element.setAttribute('aria-invalid', 'true');
  element.focus();
}

function clearErrors() {
  const errors = form.querySelectorAll('.error');
  errors.forEach(error => (error.textContent = ''));
  const inputs = form.querySelectorAll('input, select');
  inputs.forEach(input => input.removeAttribute('aria-invalid'));
}

function submitToGoogleSheet(form) {
  const formData = new FormData(form);
  fetch(scriptURL, {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(result => {
      if (result.result === 'success') {
        alert('Your registration has been saved!');
        form.reset();
        updateWhatsApp();
        clearErrors();
      } else {
        alert('Failed to save to Google Sheet.');
      }
    })
    .catch(error => {
      alert('Error occurred while saving to Google Sheet!');
      console.error(error);
    });
}
