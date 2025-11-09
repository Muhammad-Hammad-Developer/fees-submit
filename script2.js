const scriptURL = 'https://script.google.com/macros/s/AKfycby6WA0ject52EbaexQw5w_SGJCVsIjmTehuQzYiEmPmNburyCGPq8BpjhimnzBKS-XZ/exec';
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

    // Save fee data to localStorage
    const feeData = {
      SlipNo: formData.get('SlipNo'),
      Date: formData.get('Date'),
      Name: formData.get('Name'),
      FatherName: formData.get('FatherName'),
      Course: formData.get('Course'),
      AdmissionFee: formData.get('AdmissionFee'),
      MonthlyFee: formData.get('MonthlyFee'),
      CourseFee: formData.get('CourseFee'),
      PhoneNumber: formData.get('PhoneNumber'),
      TotalFee: formData.get('TotalFee'),
      timestamp: Date.now(),
      type: 'school'
    };
    
    // Get existing fees from localStorage
    let fees = JSON.parse(localStorage.getItem('fees') || '[]');
    fees.unshift(feeData);
    
    // Keep only last 100 fees
    if (fees.length > 100) {
      fees = fees.slice(0, 100);
    }
    
    // Save to localStorage
    try {
      localStorage.setItem('fees', JSON.stringify(fees));
      console.log('Fee saved successfully. Total fees:', fees.length);
    } catch(e) {
      console.error('Error saving fee to localStorage:', e);
    }

    // Show success message
    document.getElementById('overlayBox').innerHTML = "✅ Thank you! Your form has been submitted successfully.";

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
 