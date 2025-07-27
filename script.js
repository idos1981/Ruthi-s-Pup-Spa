// Script for handling booking form and payment redirection
//
// This script intercepts the booking form submission, prevents the page from
// reloading, and displays a payment section with a link to Square's hosted
// checkout. Replace the placeholder links with actual Square payment links
// generated in your Square Dashboard.

document.addEventListener('DOMContentLoaded', function () {
    // Set the minimum date on the date input to today so users cannot select past dates
    const dateInput = document.getElementById('date-input');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    const form = document.getElementById('booking-form');
    const paymentSection = document.getElementById('payment-section');
    const squareLink = document.getElementById('square-link');

    // Replace these placeholders with your actual Square payment links.
    // Each key represents a combination of add‑ons selected. For example,
    // 'wash' is just the base wash service, 'wash_teeth' includes the teeth brushing add‑on,
    // 'wash_nail' includes the nail clipping add‑on, and 'wash_both' includes both add‑ons.
    const paymentLinks = {
        wash: 'https://squareup.com/pay/REPLACE_WASH_LINK',
        wash_teeth: 'https://squareup.com/pay/REPLACE_WASH_TEETH_LINK',
        wash_nail: 'https://squareup.com/pay/REPLACE_WASH_NAIL_LINK',
        wash_both: 'https://squareup.com/pay/REPLACE_WASH_BOTH_LINK'
    };

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate required fields
        const nameVal = document.getElementById('name-input').value.trim();
        const emailVal = document.getElementById('email-input').value.trim();
        const phoneVal = document.getElementById('phone-input').value.trim();
        const dateVal = dateInput.value;
        const timeVal = document.getElementById('time-input').value;
        const teethAddon = document.getElementById('addon-teeth').checked;
        const nailAddon = document.getElementById('addon-nail').checked;

        if (!nameVal) {
            alert('Please enter your name.');
            return;
        }
        if (!emailVal) {
            alert('Please enter your email address.');
            return;
        }
        if (!phoneVal) {
            alert('Please enter your phone number.');
            return;
        }
        if (!dateVal) {
            alert('Please select a date.');
            return;
        }
        if (!timeVal) {
            alert('Please select a time.');
            return;
        }

        // Determine which payment link to use based on selected add‑ons
        let linkKey = 'wash';
        if (teethAddon && nailAddon) {
            linkKey = 'wash_both';
        } else if (teethAddon) {
            linkKey = 'wash_teeth';
        } else if (nailAddon) {
            linkKey = 'wash_nail';
        }

        // Show the payment section
        paymentSection.classList.remove('hidden');

        // Update the payment link
        squareLink.href = paymentLinks[linkKey] || 'https://squareup.com';

        // Build a mailto link so the client can send booking details via email
        const notifyLink = document.getElementById('notify-link');
        if (notifyLink) {
            let addonsText = 'None';
            if (teethAddon && nailAddon) {
                addonsText = 'Teeth brushing, Nail clipping';
            } else if (teethAddon) {
                addonsText = 'Teeth brushing';
            } else if (nailAddon) {
                addonsText = 'Nail clipping';
            }
            const subject = encodeURIComponent('New Booking Request');
            const body = encodeURIComponent(
                `Name: ${nameVal}\n` +
                `Phone: ${phoneVal}\n` +
                `Email: ${emailVal}\n` +
                `Date: ${dateVal}\n` +
                `Time: ${timeVal}\n` +
                `Add-ons: ${addonsText}`
            );
            notifyLink.href = `mailto:info@ruthispupspa.com?subject=${subject}&body=${body}`;
        }

        // Optionally scroll to the payment section
        paymentSection.scrollIntoView({ behavior: 'smooth' });
    });
});
