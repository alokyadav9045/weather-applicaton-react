import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./SearchBoxx.css";
import InfoBox from './InfoBox';

export default function SearchBox({updateInfo}){
    let [city ,setCity] =useState("");
    let [error ,setError] =useState(false);
    const API_URL ="https://api.openweathermap.org/data/2.5/weather";
    const API_KEY ="82ce7bfb5756e5a14b5257148417045b";

    let getWheatherInfo = async() =>{
        try {
            let response= await fetch (`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        let jsonResponse =await response.json();
        console.log(jsonResponse);
        let result = {
            city: jsonResponse.name,
            temp: jsonResponse.main.temp,
            tempMin:jsonResponse.main.temp_min,
            tempMax:jsonResponse.main.temp_max,
            humidity: jsonResponse.main.humidity,
            feelsLike: jsonResponse.main.feels_like,
            weather: jsonResponse.weather[0].description,
        };
        console.log(result);
        return result;
        }
        catch(error){
            throw error;
        }

    };

    let handleChange =(evt) => {
        setCity(evt.target.value);
    };

    let handleSubmit = async (evt) => {
        try{
            evt.preventDefault();
        console.log(city); // Corrected line
        setCity("");
        let newInfo= await getWheatherInfo();
        updateInfo(newInfo);
        }
        catch(error){
            setError(true);
        }
    };

    return (
        <div className="SearchBox">
            <form onSubmit={handleSubmit}>
            <TextField id="city" label="City-name" variant="outlined" required value={city} onChange={handleChange}/>
            <br />
            <br />
            <Button variant="contained" type='submit'>Search</Button>
            {error && <div>City not found</div>}
            </form>
       </div>
    );
}