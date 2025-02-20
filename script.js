
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

const form = document.getElementById('signup-form');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    // Get form data
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
  
    // Save data to Firestore
    // Push data to Realtime Database
    db.ref('signups').push({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        timestamp: new Date().toISOString()
    })
    .then(() => {
        formStatus.textContent = 'Thank you for signing up!';
        form.reset();
    })
    .catch((error) => {
        console.error('Error saving data:', error);
        formStatus.textContent = 'Oops! Something went wrong. Please try again.';
    });
});