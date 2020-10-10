import React, {createContext, useEffect, useState} from 'react'
import {
    enable as enableDarkMode,
    disable as disableDarkMode,
} from 'darkreader';


export const DarkModeContext = createContext();

export function DarkModeProvider({children}) {
    const localDarkMode = JSON.parse(localStorage.getItem('config'));
    const [isDarkMode, setIsDarkMode] = useState(localDarkMode ? localDarkMode.darkMode : false);

    useEffect(() => {
        if(isDarkMode){
            enableDarkMode({
                brightness: 100,
                contrast: 90,
                sepia: 0,
            });
            localStorage.setItem('config', JSON.stringify({darkMode: true}))
        } else {
            disableDarkMode();
            localStorage.setItem('config', JSON.stringify({darkMode: false}))
        }
    }, [isDarkMode])
    return (
        <DarkModeContext.Provider value={[isDarkMode, setIsDarkMode]}>
            {children}
        </DarkModeContext.Provider>
    )
}
