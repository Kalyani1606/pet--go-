/**
 * Premium Notification System for PETGO
 * Replaces browser alerts with sleek toast notifications.
 */

const showNotification = (message, type = 'info') => {
    // Create container if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-24 right-6 z-[9999] flex flex-col gap-4 pointer-events-none';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `
        transform translate-x-full opacity-0 transition-all duration-500 ease-out
        pointer-events-auto min-w-[320px] max-w-md p-4 rounded-2xl shadow-2xl backdrop-blur-xl
        border flex items-center gap-4 group
    `;

    // Set colors and icons based on type
    const configs = {
        success: {
            bg: 'bg-white/90 dark:bg-emerald-900/90',
            border: 'border-emerald-100 dark:border-emerald-800',
            icon: 'check_circle',
            iconColor: 'text-emerald-500',
            textColor: 'text-gray-800 dark:text-emerald-100'
        },
        error: {
            bg: 'bg-white/90 dark:bg-rose-900/90',
            border: 'border-rose-100 dark:border-rose-800',
            icon: 'error',
            iconColor: 'text-rose-500',
            textColor: 'text-gray-800 dark:text-rose-100'
        },
        info: {
            bg: 'bg-white/90 dark:bg-blue-900/90',
            border: 'border-blue-100 dark:border-blue-800',
            icon: 'info',
            iconColor: 'text-blue-500',
            textColor: 'text-gray-800 dark:text-blue-100'
        }
    };

    const config = configs[type] || configs.info;
    toast.classList.add(...config.bg.split(' '), ...config.border.split(' '));

    toast.innerHTML = `
        <div class="w-10 h-10 rounded-xl ${config.bg.replace('/90', '/20')} flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined ${config.iconColor}">${config.icon}</span>
        </div>
        <div class="flex-1">
            <p class="text-sm font-semibold ${config.textColor}">${message}</p>
        </div>
        <button class="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <span class="material-symbols-outlined text-lg">close</span>
        </button>
    `;

    // Add close functionality
    toast.querySelector('button').onclick = () => dismissToast(toast);

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    });

    // Auto dismiss
    const timeout = setTimeout(() => {
        dismissToast(toast);
    }, 5000);

    function dismissToast(el) {
        el.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            el.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 500);
    }
};

// Global polyfill to catch any accidental alerts (optional but helpful)
// window.alert = (msg) => showNotification(msg, 'info');
