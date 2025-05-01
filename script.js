
// Import the functions you need from the SDKs you need
 // Import Realtime Database functions
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDb41N58NOrfd-PylxLhi_a69D3pHj__Lk",
    authDomain: "swimacrosscolumbiasignup.firebaseapp.com",
    projectId: "swimacrosscolumbiasignup",
    storageBucket: "swimacrosscolumbiasignup.firebasestorage.app",
    messagingSenderId: "297921398886",
    appId: "1:297921398886:web:c6ee6890e9ccd8aa8005a7",
    measurementId: "G-79RLE5T6J6"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

// Get all tab links and content sections
const tabLinks = document.querySelectorAll('nav ul li a');
const tabContents = document.querySelectorAll('.tab-content');

// Add click event listeners to the tab links
tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior

        // Remove the 'active' class from all tabs and content sections
        tabLinks.forEach(link => link.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add the 'active' class to the clicked tab and corresponding content section
        const targetTab = link.getAttribute('data-tab');
        link.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Set the first tab as active by default
tabLinks[0].click();

// Add this code after the existing tab handling code
document.querySelectorAll('.tab-switcher').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = link.dataset.targetTab;
        
        // Remove active classes
        tabLinks.forEach(link => link.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Find and activate the target tab
        const targetLink = document.querySelector(`[data-tab="${targetTab}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        }
    });
});
// const randomEscortCheckbox = document.getElementById('random-escort');
// const accompanyingNameInput = document.getElementById('accompanying-name');

// function updateEscortFields() {
//     if (randomEscortCheckbox.checked) {
//         accompanyingNameInput.value = '';
//         accompanyingNameInput.disabled = true;
//     } else {
//         accompanyingNameInput.disabled = false;
//     }
// }

// // Initial check on page load
// updateEscortFields();

// // Add event listener for checkbox changes
// randomEscortCheckbox.addEventListener('change', updateEscortFields);
// const form = document.getElementById('signup-form');
// const formStatus = document.getElementById('form-status');

// form.addEventListener('submit', async (e) => {
//     e.preventDefault();
  
//     // Get form data
//     const firstName = document.getElementById('first-name').value;
//     const lastName = document.getElementById('last-name').value;
//     const email = document.getElementById('email').value;
//     const phone = document.getElementById('phone').value;
//     const registrationType = document.querySelector('input[name="registrationType"]:checked').value;
//     const randomEscort = document.getElementById('random-escort').checked;
//     const accompanyingName = document.getElementById('accompanying-name').value;
  
//     // Save data to Firestore
//     // Push data to Realtime Database
//     db.ref('signups').push({
//         registrationType: registrationType,
//         firstName: firstName,
//         lastName: lastName,
//         email: email,
//         phone: phone,
//         randomEscort: randomEscort,
//         accompanyingName: accompanyingName,
//         timestamp: new Date().toISOString()
//     })
//     .then(() => {
//         formStatus.textContent = 'Thank you for signing up!';
//         form.reset();
//     })
//     .catch((error) => {
//         console.error('Error saving data:', error);
//         formStatus.textContent = 'Oops! Something went wrong. Please try again.';
//     });
// });
// Registration Logic - New implementation
let activeForm = null;

// Handle registration type selection
document.querySelectorAll('.reg-option').forEach(button => {
  button.addEventListener('click', (e) => {
    const formType = e.target.dataset.type;
    const form = document.getElementById(`${formType}-form`);
    
    // Toggle active state
    if (activeForm === formType) {
      // Clicking active button again closes form
      e.target.classList.remove('active');
      form.classList.remove('active');
      activeForm = null;
    } else {
      // Remove all active states
      document.querySelectorAll('.reg-option, .reg-form').forEach(el => {
        el.classList.remove('active');
      });
      
      // Set new active state
      e.target.classList.add('active');
      form.classList.add('active');
      activeForm = formType;
    }
  });
});

// Swimmer Random Escort Handler
document.querySelectorAll('#swimmer-random-escort').forEach(select => {
    select.addEventListener('change', (e) => {
      const detailsSection = e.target.closest('.random-escort-section').querySelector('.escort-details');
      const nameInput = detailsSection.querySelector('input');
      
      detailsSection.classList.toggle('active', e.target.value === 'no');
      nameInput.required = e.target.value === 'no';
      
      if (e.target.value === 'yes') {
        nameInput.value = '';
      }
    });
  });
  
  // Escort Random Swimmer Handler
  document.querySelectorAll('#escort-random-swimmer').forEach(select => {
    select.addEventListener('change', (e) => {
      const detailsSection = e.target.closest('.random-swimmer-section').querySelector('.swimmer-details');
      const nameInput = detailsSection.querySelector('input');
      
      detailsSection.classList.toggle('active', e.target.value === 'no');
      nameInput.required = e.target.value === 'no';
      
      if (e.target.value === 'yes') {
        nameInput.value = '';
      }
    });
  });
  
document.querySelectorAll('.reg-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formStatus = document.getElementById('form-status');
    
    try {
      const formData = new FormData(form);
      const data = {
        type: form.id.replace('-form', ''),
        timestamp: new Date().toISOString()
      };

      // First collect ALL form fields
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }

      // Then handle special cases
      if (data.type === 'swimmer') {
        // Ensure escort_name is removed if not needed
        if (data.random_escort === 'yes') {
          delete data.escort_name;
        }
      }
      else if (data.type === 'escort') {
        // Ensure escorting_for is removed if not needed
        if (data.escort_random === 'yes') {
          delete data.escorting_for;
        }
      }

      await db.ref('registrations').push(data);
      
      // Reset UI
      form.reset();
      form.classList.remove('active');
      document.querySelector('.reg-option.active')?.classList.remove('active');
      activeForm = null;
      
      formStatus.textContent = 'Registration submitted successfully!';
      formStatus.style.color = 'green';
      setTimeout(() => formStatus.textContent = '', 3000);
    } catch (error) {
      console.error('Error saving registration:', error);
      formStatus.textContent = 'Error submitting form. Please try again.';
      formStatus.style.color = 'red';
    }
  });
});

function generateGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    const totalImages = 89; // CHANGE THIS to your actual number of images
    
    // Generate image elements
    for (let i = 1; i <= totalImages; i++) {
        const imgNumber = i.toString().padStart(2, '0');
        const img = document.createElement('img');
        img.className = 'gallery-img';
        img.src = `assets/img_${imgNumber}.jpg`; // Ensure extension matches (.JPG/.jpg)
        img.alt = `2024 Event Photo ${i}`;
        galleryContainer.appendChild(img);
    }
}

document.querySelector('[data-tab="records"]').addEventListener('click', generateGallery);

// Modal Elements
const waiverModal = document.getElementById('waiverModal');
const successModal = document.getElementById('successModal');
const closeButtons = document.querySelectorAll('.close-modal');
const cancelWaiver = document.getElementById('cancel-waiver');
const confirmWaiver = document.getElementById('confirm-waiver');
const closeSuccess = document.querySelector('.close-success');

// Form Elements
const swimmerForm = document.getElementById('swimmer-form');
const waiverAgree = document.getElementById('waiver-agree');
const waiverInitials = document.getElementById('waiver-initials');

// Form submission handler for swimmer registration
if (swimmerForm) {
  swimmerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show waiver modal
    waiverModal.style.display = 'block';
    
    // Reset waiver inputs
    if (waiverAgree) waiverAgree.checked = false;
    if (waiverInitials) waiverInitials.value = '';
  });
}

// Close modals when clicking the X button
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    waiverModal.style.display = 'none';
    successModal.style.display = 'none';
  });
});

// Cancel waiver button
if (cancelWaiver) {
  cancelWaiver.addEventListener('click', () => {
    waiverModal.style.display = 'none';
  });
}

// Confirm waiver button (submits the form)
if (confirmWaiver) {
  confirmWaiver.addEventListener('click', async () => {
    // Validate agreement checkbox and initials
    if (!waiverAgree.checked) {
      alert('You must agree to the terms of the waiver to proceed.');
      return;
    }
    
    if (!waiverInitials.value.trim()) {
      alert('Please enter your initials to confirm agreement.');
      return;
    }
    
    // Close waiver modal
    waiverModal.style.display = 'none';
    
    // Get form data from the swimmer registration form
    const formData = new FormData(swimmerForm);
    const data = {
      type: 'swimmer',
      timestamp: new Date().toISOString(),
      waiver_agreed: true,
      waiver_initials: waiverInitials.value.trim().toUpperCase()
    };
    
    // Add form fields to data object
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    // Ensure escort_name is removed if not needed
    if (data.random_escort === 'yes') {
      delete data.escort_name;
    }
    
    try {
      // Submit data to Firebase
      await db.ref('registrations').push(data);
      
      // Reset form
      swimmerForm.reset();
      
      // Show success modal
      successModal.style.display = 'block';
      
      // Hide the form
      document.querySelector('.reg-option.active')?.classList.remove('active');
      swimmerForm.classList.remove('active');
      activeForm = null;
      
    } catch (error) {
      console.error('Error saving registration:', error);
      const formStatus = document.getElementById('form-status');
      formStatus.textContent = 'Error submitting form. Please try again.';
      formStatus.style.color = 'red';
    }
  });
}

// Close success modal when clicking OK
if (closeSuccess) {
  closeSuccess.addEventListener('click', () => {
    successModal.style.display = 'none';
  });
}

// Close modals when clicking outside of them
window.addEventListener('click', (e) => {
  if (e.target === waiverModal) {
    waiverModal.style.display = 'none';
  }
  if (e.target === successModal) {
    successModal.style.display = 'none';
  }
});

document.querySelectorAll('.contact-links .tab-switcher').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetTab = link.getAttribute('data-tab');
    
    // Remove active classes
    tabLinks.forEach(link => link.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Find and activate the target tab
    const targetLink = document.querySelector(`[data-tab="${targetTab}"]`);
    if (targetLink) {
      targetLink.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    }
  });
});