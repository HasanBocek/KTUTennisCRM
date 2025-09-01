import {persisted} from 'svelte-persisted-store';
import {type Writable} from 'svelte/store';
import {toggleDocumentAttribute} from "$lib/helpers/layout";

type LayoutType = {
    theme: 'light' | 'dark',
    leftSideBarSize: 'collapsed' | 'default'
}

const defaultConfig: LayoutType = {
    theme: 'light',
    leftSideBarSize: 'collapsed'
}

export const layout: Writable<LayoutType> = persisted('svelte_layout', defaultConfig);

let currentTheme: 'light' | 'dark';
let currentLeftSideBarSize: 'collapsed' | 'default';

layout.subscribe((current) => {
    currentTheme = current.theme
    currentLeftSideBarSize = current.leftSideBarSize
});

const updateLayout = (key: keyof LayoutType, value: LayoutType[keyof LayoutType], attribute: string, tag?: keyof HTMLElementTagNameMap) => {
    layout.update(current => ({
        ...current,
        [key]: value
    }));
    toggleDocumentAttribute(attribute, value, tag);
};

export const setTheme = (nTheme: LayoutType['theme']) => updateLayout('theme', nTheme, 'data-bs-theme');
export const setLeftSideBarSize = (nSize: LayoutType['leftSideBarSize']) => updateLayout('leftSideBarSize', nSize, 'data-sidebar-size', "body");

export const initLayout = () => {
    setTheme(currentTheme);
    setLeftSideBarSize(currentLeftSideBarSize);
};

export const resetLayout = () => {
    setTheme(defaultConfig.theme);
    setLeftSideBarSize(defaultConfig.leftSideBarSize);
};