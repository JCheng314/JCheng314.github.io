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