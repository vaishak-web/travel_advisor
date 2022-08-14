import React, { useState, useEffect } from "react";
import { CssBaseline, Grid } from "@material-ui/core";
import { getPlacesData } from "./api";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";

const App = () => {
  const [places, setPlaces] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [bounds, setBounds] = useState({});
  const [childClicked, setchildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("0");
  const [filetredPlaces, setFiletredPlaces] = useState([]);
  useEffect(() => {
    const filteredPlaces = places?.filter((place) => place.rating > rating);
    setFiletredPlaces(filteredPlaces);
  }, [rating]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
        console.log(latitude, longitude);
      }
    );
  }, []);

  useEffect(() => {
    console.log(coordinates, bounds);
    if (bounds.sw && bounds.ne) {
      // getPlacesData()
      setIsLoading(true);
      getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
        console.log(data);
        setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
        setFiletredPlaces([]);
        setIsLoading(false);
      });
    }
    // getPlacesData(bounds.sw, bounds.ne)
  }, [type, bounds]);

  return (
    <>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={filetredPlaces.length ? filetredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filetredPlaces.length ? filetredPlaces : places}
            setchildClicked={setchildClicked}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
