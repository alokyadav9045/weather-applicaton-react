import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import "./InfoBox.css";

// Import local video
import vid2 from './assets/images/vid2.mp4';

export default function InfoBox({ info }) {
  return (
    <div className="InfoBox">
      <h1>Weather: {info.weather}</h1><br/>
      <div className="card">
        <Card sx={{ Width: 900, backgroundColor: 'skyblue' }} className="cardarea">
          <CardMedia
            component="video"
            sx={{ height: 230, width: 420, margin:-1,marginTop:1 }}
            src={vid2}
            title="weather video"
            autoPlay
            loop
            muted
          />
          <CardContent className="cardcontent">
            <Typography gutterBottom variant="h5" component="div">
              <h3>{info.city} {info.humidity > 80 ? <ThunderstormIcon /> : info.temp > 15 ? <WbSunnyIcon /> : info.temp < 10 ? <AcUnitIcon /> : <WbSunnyIcon />}</h3> 
            </Typography>
            <Typography component="span">
              <div>Temperature = {info.temp}&deg;C</div>
              <div>Humidity = {info.humidity}</div>
              <p>Min Temp = {info.tempMin}&deg;C</p>
              <p>Max Temp = {info.tempMax}&deg;C</p>
              <p>The weather can be described as {info.weather} and Feels Like = {info.feelsLike}&deg;C</p>
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}