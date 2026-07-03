// Toggle Sidebar (Mobile)
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (sidebar.classList.contains('-translate-x-full')) {
    // Open
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  } else {
    // Close
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Close sidebar when clicking overlay
document.getElementById('sidebar-overlay')?.addEventListener('click', toggleSidebar);

// Handle window resize
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) { // lg breakpoint
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar) sidebar.classList.remove('-translate-x-full');
    if (overlay) overlay.classList.add('hidden');
    document.body.style.overflow = '';
  } else {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
       sidebar.classList.add('-translate-x-full');
    }
  }
});

// Auto-dismiss flash messages after 5 seconds
document.addEventListener('DOMContentLoaded', () => {
  const flashes = document.querySelectorAll('.flash-message');
  flashes.forEach(flash => {
    setTimeout(() => {
      flash.style.opacity = '0';
      flash.style.transform = 'translateY(-10px)';
      flash.style.transition = 'all 0.3s ease';
      setTimeout(() => flash.remove(), 300);
    }, 5000);
  });
});

// Generic confirm delete function
function confirmDelete(event, itemName) {
  if (!confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
    event.preventDefault();
    return false;
  }
  return true;
}
