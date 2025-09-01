<script lang="ts">
    import { onMount } from 'svelte';

    const favicon = '/images/favicon.ico';

    import 'simplebar/dist/simplebar.css';
    import 'simple-datatables/dist/style.css'
    import 'flatpickr/dist/flatpickr.min.css'
    import 'magic.css/dist/magic.min.css'
    import 'nouislider/dist/nouislider.min.css'
    import 'starability/starability-css/starability-all.css'
    import 'sweetalert2/dist/sweetalert2.min.css'
    import 'animate.css/animate.min.css'
    import 'mobius1-selectr/dist/selectr.min.css'
    import 'huebee/dist/huebee.min.css'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import 'uppy/dist/uppy.min.css'
    import 'leaflet/dist/leaflet.css'
    import 'tobii/dist/css/tobii.min.css'
    import '$lib/assets/scss/bootstrap.scss'
    import '$lib/assets/scss/app.scss'
    import '$lib/assets/scss/icons.scss'

    import {initLayout} from "$lib/stores/layout";

    onMount(() => {
        initLayout()
        
        // PWA Service Worker Registration
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registered successfully:', registration.scope);
                })
                .catch((error) => {
                    console.log('Service Worker registration failed:', error);
                });
        }
        
        // Dynamic PWA Theme Colors
        updatePWAThemeColors();
        
        // Listen for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-bs-theme') {
                    updatePWAThemeColors();
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-bs-theme']
        });
        
        return () => observer.disconnect();
    })
    
    function updatePWAThemeColors() {
        const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        const themeColorMeta = document.getElementById('theme-color-meta');
        const backgroundColorMeta = document.getElementById('background-color-meta');
        
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', isDark ? '#202221' : '#ffffff');
        }
        
        if (backgroundColorMeta) {
            backgroundColorMeta.setAttribute('content', isDark ? '#202221' : '#ffffff');
        }
        
        // Update Apple status bar style based on theme
        const appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (appleStatusBarMeta) {
            appleStatusBarMeta.setAttribute('content', isDark ? 'black-translucent' : 'default');
        }
    }
</script>

<slot/>