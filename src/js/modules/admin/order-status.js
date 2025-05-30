 // Page navigation
        const orderListPage = document.getElementById('order-list-page');
        const orderDetailPage = document.getElementById('order-detail-page');
        const backButton = document.getElementById('back-to-orders');
        const orderItems = document.querySelectorAll('.order-item');
        const viewDetailButtons = document.querySelectorAll('.view-details-btn');
        
        // Handle click on order items or view details buttons
        function showOrderDetails() {
            orderListPage.classList.remove('page-visible');
            orderListPage.classList.add('page-hidden');
            orderDetailPage.classList.remove('page-hidden');
            orderDetailPage.classList.add('page-visible');
            
            // Scroll to top
            window.scrollTo(0, 0);
        }
        
        // Add event listeners to all order items and buttons
        orderItems.forEach(item => {
            item.addEventListener('click', showOrderDetails);
        });
        
        viewDetailButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent triggering the parent item click
                showOrderDetails();
            });
        });
        
        // Handle back button click
        backButton.addEventListener('click', function() {
            orderDetailPage.classList.remove('page-visible');
            orderDetailPage.classList.add('page-hidden');
            orderListPage.classList.remove('page-hidden');
            orderListPage.classList.add('page-visible');
            
            // Scroll to top
            window.scrollTo(0, 0);
        });
        
        // Simulate order status progression (for demo purposes)
        const statuses = [
            { class: 'bg-gray-100 text-gray-800', text: 'Pending' },
            { class: 'bg-blue-100 text-blue-800', text: 'Confirmed' },
            { class: 'bg-purple-100 text-purple-800', text: 'Processing' },
            { class: 'bg-orange-100 text-orange-800', text: 'Shipped' },
            { class: 'bg-yellow-100 text-yellow-800', text: 'Out for Delivery' },
            { class: 'bg-green-100 text-green-800', text: 'Delivered' }
        ];
        
        let currentStatus = 0;
        const statusBadge = document.querySelector('.order-card .status-badge');
        const timelineSteps = document.querySelectorAll('.timeline-step');
        
        // Demo: Automatically progress through statuses
        function updateStatus() {
            if (currentStatus < statuses.length - 1) {
                currentStatus++;
                const status = statuses[currentStatus];
                
                // Update badge
                statusBadge.className = `status-badge ${status.class}`;
                statusBadge.textContent = status.text;
                
                // Update timeline
                if (currentStatus > 0) {
                    timelineSteps[currentStatus - 1].classList.remove('active');
                    timelineSteps[currentStatus - 1].classList.add('completed');
                }
                timelineSteps[currentStatus].classList.add('active');
                
                // Add animation for the current step
                timelineSteps[currentStatus].classList.add('animate-pulse');
                
                // Remove animation after 2 seconds
                setTimeout(() => {
                    timelineSteps[currentStatus].classList.remove('animate-pulse');
                }, 2000);
            }
        }
        
        // For demo purposes, update status every 3 seconds
        setInterval(updateStatus, 3000);