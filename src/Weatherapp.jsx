import React, { useState } from 'react';
import SearchBox from "./SearchBox";
import InfoBox from "./InfoBox";
import clouds from "./assets/images/clouds.png";
import mist from "./assets/images/mist.png";
import "./Weatherapp.css";

export default function Weatherapp() {
    const [weatherInfo, setWeatherInfo] = useState({
      city: "Delhi",
      temp: 24.43,
      tempMin: 25.05,
      tempMax: 25.54,
      humidity: 34,
      feelsLike: 24.54,
      weather: "Clear"
    });

    let updateInfo = (newInfo) => {
      setWeatherInfo(newInfo); // Corrected line
    }

  return (
    <div>
      <img src={clouds} alt="" id='image'/>
      <img src={mist} alt="" id='image2'/>
      <div style={{ textAlign: "center" ,marginLeft: "10px",marginTop:"-240px",padding:0}}>
        <h1 className='heading'>Weather-Application </h1>
        <SearchBox  updateInfo={updateInfo}/>
        <InfoBox info={weatherInfo} />
      </div>
    </div>
  );
}