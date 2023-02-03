import {getFromLocalStorage, setToLocalStorage} from "../../utils/storage";
import {useEffect, useState} from "react";

export const useTheme = () => {
    const themes = getFromLocalStorage('themes');
    const [theme, setTheme] = useState(themes.data.light);
    const [themeLoaded, setThemeLoaded] = useState(false);

    const setMode = mode => {
        setToLocalStorage('theme', mode);
        setTheme(mode);
    }

    useEffect(() => {
        const localTheme = getFromLocalStorage('theme');
        localTheme ? setTheme(localTheme) : setTheme(themes.data.light);
        setThemeLoaded(true);
    }, [])

    return {theme, themeLoaded, setMode}
}