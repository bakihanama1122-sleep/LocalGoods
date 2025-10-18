"use client"

import React,{useState} from "react";
import {ComposableMap,Geographies,Geography} from "reac-simple-maps";
import {motion,AnimatePresence} from "framer-motion";
import { DEFAULT_MAX_VERSION } from "tls";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countryData = [
    {name:"United States of America",users:120,sellers:30},
    {name:"India",users:100,sellers:20},
    {name:"United Kingdom",users:85,sellers:15},
    {name:"Germany",users:70,sellers:10},
    {name:"Canada",users:60,sellers:5}
];

const getColor = (countryName:string) => {
    const country = countryData.find((c)=>c.name === countryName);
    if(!country) return "#1e293b";

}

const GeographicalMap = ()=>{
    return (
        <div>
            dfegrhnfdvc
        </div>
    )
}
export default GeographicalMap;
