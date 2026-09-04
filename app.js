/**
 * Sprint Laundry & Boutique - Sales & Ordering Interaction Script
 */

// Handle Category Selection from grid
function selectCategory(categoryName) {
  const typeSelect = document.getElementById('clothingType');
  if (typeSelect) {
    typeSelect.value = categoryName;
    handleClothingTypeChange();
  }

  // Smoothly scroll to the order form
  const orderSection = document.getElementById('order-section');
  if (orderSection) {
    orderSection.scrollIntoView({ behavior: 'smooth' });
  }

  showToast(`Selected "${categoryName}" - ready to order!`, 'ti-hanger');
}

// Adjust quantity counter
function adjustQuantity(delta) {
  const qtyInput = document.getElementById('clothingQuantity');
  if (qtyInput) {
    let currentVal = parseInt(qtyInput.value, 10) || 1;
    let newVal = Math.max(1, Math.min(100, currentVal + delta));
    qtyInput.value = newVal;
  }
}

// Handle clothing type dropdown change
function handleClothingTypeChange() {
  const typeSelect = document.getElementById('clothingType');
  const customContainer = document.getElementById('customItemContainer');
  
  if (typeSelect && customContainer) {
    if (typeSelect.value === 'Custom / Other Request') {
      customContainer.classList.remove('hidden');
      const detailsInput = document.getElementById('customItemDetails');
      if (detailsInput) detailsInput.focus();
    } else {
      customContainer.classList.add('hidden');
    }
  }
}

// Toggle Delivery Fields & Requirements
function toggleDeliveryFields(isDelivery) {
  const addressSection = document.getElementById('deliveryAddressSection');
  const addressInput = document.getElementById('deliveryAddress');
  const cards = document.querySelectorAll('.fulfillment-card');

  // Update visual card states
  cards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    const indicator = card.querySelector('.radio-indicator');
    if (radio && indicator) {
      if (radio.checked) {
        if (radio.value === 'Delivery') {
          indicator.className = 'radio-indicator w-5 h-5 rounded-full border-2 border-brand-orange bg-brand-orange flex items-center justify-center mt-0.5 shrink-0 transition';
        } else {
          indicator.className = 'radio-indicator w-5 h-5 rounded-full border-2 border-brand-teal bg-brand-teal flex items-center justify-center mt-0.5 shrink-0 transition';
        }
      } else {
        indicator.className = 'radio-indicator w-5 h-5 rounded-full border-2 border-slate-600 bg-transparent flex items-center justify-center mt-0.5 shrink-0 transition';
      }
    }
  });

  if (addressSection && addressInput) {
    if (isDelivery) {
      addressSection.classList.remove('hidden');
      addressInput.setAttribute('required', 'required');
      addressInput.focus();
    } else {
      addressSection.classList.add('hidden');
      addressInput.removeAttribute('required');
      addressInput.value = '';
    }
  }
}

// Handle Form Submission
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('customerName').value.trim();
  const email = document.getElementById('customerEmail').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const clothingType = document.getElementById('clothingType').value;
  const quantity = document.getElementById('clothingQuantity').value;
  const customDetails = document.getElementById('customItemDetails')?.value.trim() || '';
  
  // Selected size
  const selectedSizeRadio = document.querySelector('input[name="clothingSize"]:checked');
  const size = selectedSizeRadio ? selectedSizeRadio.value : 'Standard';

  // Fulfillment
  const fulfillmentRadio = document.querySelector('input[name="fulfillmentMethod"]:checked');
  const fulfillment = fulfillmentRadio ? fulfillmentRadio.value : 'Pickup from store';
  const deliveryAddress = document.getElementById('deliveryAddress')?.value.trim() || '';
  const notes = document.getElementById('orderNotes')?.value.trim() || 'None';

  if (!clothingType) {
    showToast('Please choose a clothing item type', 'ti-alert-circle');
    document.getElementById('clothingType').focus();
    return;
  }

  // Generate unique order reference
  const orderRef = 'SP-' + Math.floor(100000 + Math.random() * 900000);

  // Determine item summary
  let itemDisplay = `${quantity}x ${clothingType} (Size: ${size})`;
  if (customDetails && clothingType === 'Custom / Other Request') {
    itemDisplay += ` - [${customDetails}]`;
  }

  // Populate Modal
  document.getElementById('modalCustomerName').textContent = name;
  document.getElementById('modalOrderRef').textContent = orderRef;
  document.getElementById('modalItemSummary').textContent = itemDisplay;
  document.getElementById('modalFulfillment').textContent = fulfillment;

  const modalAddressRow = document.getElementById('modalAddressRow');
  if (fulfillment === 'Delivery' && deliveryAddress) {
    modalAddressRow.classList.remove('hidden');
    document.getElementById('modalAddress').textContent = deliveryAddress;
  } else {
    modalAddressRow.classList.add('hidden');
  }

  // Build WhatsApp prefilled message
  const whatsappMessage = 
`*NEW SPRINT BOUTIQUE SALE ORDER* 🛍️
━━━━━━━━━━━━━━━━━━
*Order Ref:* ${orderRef}
*Customer Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}
━━━━━━━━━━━━━━━━━━
*Item:* ${clothingType}
*Quantity:* ${quantity}
*Size:* ${size}
${customDetails ? `*Details:* ${customDetails}\n` : ''}*Fulfillment:* ${fulfillment}
${fulfillment === 'Delivery' ? `*Delivery Address:* ${deliveryAddress}\n_(Note: Delivery fee depends on location)_\n` : ''}*Notes:* ${notes}
━━━━━━━━━━━━━━━━━━
Sent from Sprint Boutique Website`;

  const encodedMsg = encodeURIComponent(whatsappMessage);
  // Default WhatsApp link
  const whatsappBtn = document.getElementById('whatsappOrderBtn');
  if (whatsappBtn) {
    whatsappBtn.onclick = () => {
      window.open(`https://api.whatsapp.com/send?text=${encodedMsg}`, '_blank');
    };
  }

  // Open Modal
  openOrderModal();

  // Reset form
  document.getElementById('boutiqueOrderForm').reset();
  toggleDeliveryFields(false);
  handleClothingTypeChange();
}

// Modal open/close
function openOrderModal() {
  const modal = document.getElementById('orderSuccessModal');
  if (modal) {
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
    }, 10);
  }
}

function closeOrderModal() {
  const modal = document.getElementById('orderSuccessModal');
  if (modal) {
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  }
}

// Toast notification helper
let toastTimeout;
function showToast(message, iconClass = 'ti-check') {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');

  if (toast && toastMsg) {
    toastMsg.textContent = message;
    if (toastIcon) {
      toastIcon.className = `ti ${iconClass} text-brand-teal text-lg`;
    }

    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3500);
  }
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeOrderModal();
  }
});
