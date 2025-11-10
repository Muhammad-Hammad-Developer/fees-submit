const scriptURL = 'https://script.google.com/macros/s/AKfycbwzjjYF6L2uFlAncEq_3Amc_NlhNwc_8nqYisfjbDzweu8jxxsxBE8ao_4dIG-0eRo0Sw/exec';
const form = document.getElementById('submitForm');
const submitBtn = document.querySelector('#submitForm button[type="submit"]');

// Create overlay box
const overlay = document.createElement('div');
overlay.id = 'overlay';
overlay.innerHTML = `<div id="overlayBox">⏳ Please wait 4 seconds...<br>Your data will be submitted automatically.</div>`;
document.body.appendChild(overlay);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Disable button and show overlay
  submitBtn.disabled = true;
  form.classList.add('blurred');
  overlay.style.display = 'flex';

  // Wait 4 seconds
  await new Promise(resolve => setTimeout(resolve, 4000));

  // Get form data before submission
  const formData = new FormData(form);

  try {
    const response = await fetch(scriptURL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    // Save student data to localStorage
    const studentData = {
      name: formData.get('StudentName'),
      fatherName: formData.get('FatherName'),
      grNumber: formData.get('GRNumber'),
      phone: formData.get('PhoneNumber'),
      class: formData.get('Class'),
      address: formData.get('Address'),
      email: formData.get('Email'),
      addedDate: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    // Get existing students from localStorage
    let students = JSON.parse(localStorage.getItem('students') || '[]');
    students.unshift(studentData);
    
    // Keep only last 50 students
    if (students.length > 50) {
      students = students.slice(0, 50);
    }
    
    // Save to localStorage
    try {
      localStorage.setItem('students', JSON.stringify(students));
      console.log('Student saved successfully. Total students:', students.length);
    } catch(e) {
      console.error('Error saving student to localStorage:', e);
    }

    // Show success message
    document.getElementById('overlayBox').innerHTML = "✅ Thank you! Student has been added successfully.";

    // Wait 1.5 seconds, then reset everything
    await new Promise(resolve => setTimeout(resolve, 1500));
    form.reset();
    overlay.style.display = 'none';
    form.classList.remove('blurred');
    submitBtn.disabled = false;

  } catch (error) {
    console.error('Error!', error.message);
    document.getElementById('overlayBox').innerHTML = "❌ Something went wrong. Please try again.";
    await new Promise(resolve => setTimeout(resolve, 2000));
    overlay.style.display = 'none';
    form.classList.remove('blurred');
    submitBtn.disabled = false;
  }
});
 