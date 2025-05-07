
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

// Replace the swimmer form submission code in your script.js file with this code

// Modified form submission handler for swimmer registration
if (swimmerForm) {
  swimmerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show waiver modal - don't submit data yet
    waiverModal.style.display = 'block';
    
    // Reset waiver inputs
    if (waiverAgree) waiverAgree.checked = false;
    if (waiverInitials) waiverInitials.value = '';
  });
}

// Modified confirm waiver button (submits the form with all data at once)
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
    
    // Create a single data object with all information
    const data = {
      type: 'swimmer',
      timestamp: new Date().toISOString(),
      
      // Add waiver information
      waiver_agreed: true,
      waiver_initials: waiverInitials.value.trim().toUpperCase()
    };
    
    // Add swimmer form fields to data object
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    // Handle special case for escort name
    if (data.random_escort === 'yes') {
      delete data.escort_name;
    }
    
    // Show loading indicator in form status
    const formStatus = document.getElementById('form-status');
    if (formStatus) {
      formStatus.textContent = 'Submitting registration...';
      formStatus.style.color = '#0056b3';
    }
    
    try {
      // This is the only submission - all data sent at once
      await db.ref('registrations').push(data);
      
      // Reset form
      swimmerForm.reset();
      
      // Show success modal
      successModal.style.display = 'block';
      
      // Hide the form
      document.querySelector('.reg-option.active')?.classList.remove('active');
      swimmerForm.classList.remove('active');
      activeForm = null;
      
      // Clear form status
      if (formStatus) {
        formStatus.textContent = '';
      }
    } catch (error) {
      console.error('Error saving registration:', error);
      
      if (formStatus) {
        formStatus.textContent = 'Error submitting form. Please try again.';
        formStatus.style.color = 'red';
      }
    }
  });
}

// Add these to your existing script.js file

// Fix 1: Mobile Menu Toggle
// Add this HTML first to your index.html right after the <nav> opening tag:
// <div class="mobile-menu-toggle">Menu ☰</div>

// Then add this JavaScript:
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('nav ul');

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-visible');
    mobileMenuToggle.classList.toggle('active');
  });
}

// Fix 2: Improve form select interactions on mobile
document.querySelectorAll('select').forEach(select => {
  select.addEventListener('change', (e) => {
    // Add a class to indicate the select has been interacted with
    e.target.classList.add('selected');
  });
});

// Fix 3: Improve gallery image loading for mobile
// Load gallery images lazily when the tab becomes visible
function lazyLoadGallery() {
  const galleryContainer = document.getElementById('gallery-container');
  if (!galleryContainer || galleryContainer.dataset.loaded === 'true') return;
  
  // Mark as loaded to prevent duplicate loading
  galleryContainer.dataset.loaded = 'true';
  
  const totalImages = 89; // Your actual number of images
  const batchSize = 10; // Load images in batches for better performance
  let currentBatch = 0;
  
  function loadNextBatch() {
    const startIdx = currentBatch * batchSize + 1;
    const endIdx = Math.min((currentBatch + 1) * batchSize, totalImages);
    
    for (let i = startIdx; i <= endIdx; i++) {
      const imgNumber = i.toString().padStart(2, '0');
      const img = document.createElement('img');
      img.className = 'gallery-img';
      img.loading = 'lazy'; // Native lazy loading
      img.src = `assets/img_${imgNumber}.jpg`;
      img.alt = `2024 Event Photo ${i}`;
      galleryContainer.appendChild(img);
    }
    
    currentBatch++;
    if (currentBatch * batchSize < totalImages) {
      // Load next batch soon
      setTimeout(loadNextBatch, 200);
    }
  }
  
  // Start loading
  loadNextBatch();
}

// Replace existing gallery generation with lazy loading
document.querySelector('[data-tab="records"]').addEventListener('click', lazyLoadGallery);

// Fix 4: Better mobile form validation feedback
document.querySelectorAll('.reg-form').forEach(form => {
  const inputs = form.querySelectorAll('input, select');
  
  inputs.forEach(input => {
    // Add visual feedback as the user types/interacts
    input.addEventListener('input', () => {
      if (input.checkValidity()) {
        input.classList.remove('invalid');
        input.classList.add('valid');
      } else {
        input.classList.remove('valid');
        // Only mark as invalid if the user has interacted and left
        if (input.dataset.touched === 'true') {
          input.classList.add('invalid');
        }
      }
    });
    
    // Mark fields as touched when the user finishes interacting
    input.addEventListener('blur', () => {
      input.dataset.touched = 'true';
      if (!input.checkValidity()) {
        input.classList.add('invalid');
      }
    });
  });
});

// Fix 5: Mobile-friendly modal handling
// Close modals when tapping outside on mobile
const modals = document.querySelectorAll('.modal');

modals.forEach(modal => {
  // Add touchstart listener specifically for mobile
  modal.addEventListener('touchstart', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

// Fix 6: Optimize page transitions on mobile
// Add smooth transitions between tabs
document.querySelectorAll('[data-tab]').forEach(tabLink => {
  tabLink.addEventListener('click', () => {
    // Add scroll to top for better mobile experience
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});