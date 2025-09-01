<script lang="ts">
    import {
        Badge,
        Dropdown,
        DropdownMenu,
        DropdownToggle,
    } from "@sveltestrap/sveltestrap";
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { layout, setLeftSideBarSize, setTheme } from "$lib/stores/layout";
    import { toggleDocumentAttribute } from "$lib/helpers/layout";
    import Breadcrumb from "$lib/components/Breadcrumb.svelte";
    import { meStore } from "$lib/stores/userStore";
    import type { MeType } from "$lib/types/types";

    let user: MeType;
    const unsubscribe = meStore.subscribe((u) => user = u);
    onDestroy(() => unsubscribe());

    let currentTheme: "light" | "dark";
    let currentLeftSideBarSize: "collapsed" | "default";

    $: {
        const { theme, leftSideBarSize } = $layout;
        currentTheme = theme;
        currentLeftSideBarSize = leftSideBarSize;
    }

    const toggleTheme = () => {
        if (currentTheme === "light") {
            return setTheme("dark");
        }
        return setTheme("light");
    };

    const toggleLeftSideBar = () => {
        if (currentLeftSideBarSize === "default") {
            return setLeftSideBarSize("collapsed");
        }
        if (currentLeftSideBarSize === "collapsed") {
            return setLeftSideBarSize("default");
        }
        toggleDocumentAttribute("class", "sidebar-enable");
    };

    $: specifiedWelcomeText = (() => {
        if (!user?.firstName) return "";
        
        const hour = new Date().getHours();
        if (4 < hour && hour < 12) {
            return "Günaydın " + user.firstName;
        } else if (12 < hour && hour < 18) {
            return "İyi Günler " + user.firstName;
        } else if (18 < hour && hour < 24) {
            return "İyi Akşamlar " + user.firstName;
        } else {
            return "İyi Geceler " + user.firstName;
        }
    })();
    // Scroll handling kaldırıldı - topbar artık static
</script>

<div class="topbar d-print-none">
    <div class="container-xxl">
        <nav
            class="topbar-custom d-flex justify-content-between"
            id="topbar-custom"
        >
            <ul
                class="topbar-item list-unstyled d-inline-flex align-items-center mb-0"
                class:mobile-ms-auto={currentLeftSideBarSize === 'default'}
            >
                <li>
                    <button
                        class="nav-link mobile-menu-btn nav-icon"
                        id="togglemenu"
                        on:click={toggleLeftSideBar}
                    >
                        <i class="iconoir-menu-scale"></i>
                    </button>
                </li>
                <li class="mx-3 welcome-text"
                    class:hide-mobile-content={currentLeftSideBarSize === 'default'}
                >
                    <h3 class="mb-0 fw-bold text-truncate pt-2">
                        {specifiedWelcomeText}
                    </h3>
                    <h6
                        class="mb-0 fw-normal text-muted text-truncate fs-14 mt-1"
                    >
                        <Breadcrumb />
                    </h6>
                </li>
            </ul>
            <ul
                class="topbar-item list-unstyled d-inline-flex align-items-center mb-0"
                class:hide-mobile-content={currentLeftSideBarSize === 'default'}
            >
                <li class="topbar-item">
                    <button
                        class="nav-link nav-icon"
                        id="light-dark-mode"
                        on:click={toggleTheme}
                    >
                        <i class="icofont-sun dark-mode"></i>
                        <i class="icofont-moon light-mode"></i>
                    </button>
                </li>

                <Dropdown is="li" class="topbar-item">
                    <DropdownToggle color="" class="p-0">
                        <a
                            class="nav-link dropdown-toggle arrow-none nav-icon"
                            data-bs-toggle="dropdown"
                            href={"#"}
                            role="button"
                            aria-haspopup="false"
                            aria-expanded="false"
                        >
                            <i class="icofont-settings"></i>
                            <span class="alert-badge"></span>
                        </a>
                    </DropdownToggle>
                    <DropdownMenu class="dropdown-menu-end py-0">
                        <div
                            class="d-flex align-items-center dropdown-item py-2 bg-secondary-subtle"
                        >
                            <div
                                class="flex-grow-1 ms-2 text-truncate align-self-center"
                            >
                                <h6 class="my-0 fw-medium text-dark fs-13">
                                    {user.firstName} {user.lastName}
                                </h6>
                                <small class="text-muted mb-0"
                                    >Demo Kullanıcı</small
                                >
                            </div>
                        </div>
                        <div class="dropdown-divider mt-0"></div>
                        <small class="text-muted px-2 pb-1 d-block"
                            >Hesabım</small
                        >
                        <a class="dropdown-item" href="/dashboard/profile">
                            <i class="las la-user fs-18 me-1 align-text-bottom"
                            ></i>
                            Profil
                        </a>
                        <small class="text-muted px-2 py-1 d-block"
                            >Yardım</small
                        >
                        <a class="dropdown-item" href="/dashboard/help">
                            <i
                                class="las la-question-circle fs-18 me-1 align-text-bottom"
                            ></i>
                            Yardım Merkezi
                        </a>
                        <div class="dropdown-divider mb-0"></div>
                        <a class="dropdown-item text-danger my-1 py-1 " href="/auth/login">
                            <i
                                class="las la-power-off fs-18 me-1 align-text-bottom"
                            ></i>
                            Çıkış Yap
                        </a>
                    </DropdownMenu>
                </Dropdown>
            </ul>
        </nav>
    </div>
</div>
