import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/Weather.css"; // Importar archivo CSS para estilos personalizados

const Weather = () => {
  const [datosClima, setDatosClima] = useState(null);
  const [ciudad, setCiudad] = useState("Reconquista");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [tiempo, setTiempo] = useState(new Date());
  const [tiempoAnterior, setTiempoAnterior] = useState(new Date());

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},AR&appid=${API_KEY}&units=metric&lang=es`;

  useEffect(() => {
    const obtenerClima = async () => {
      setCargando(true);
      try {
        const respuesta = await axios.get(API_URL);
        setDatosClima(respuesta.data);
        setError(null);
      } catch (error) {
        setError("Error al obtener los datos");
      } finally {
        setCargando(false);
      }
    };
    obtenerClima();
  }, [ciudad]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempoAnterior(tiempo);
      setTiempo(new Date());
    }, 1000);
    return () => clearInterval(intervalo);
  }, [tiempo]);

  const manejarCambioCiudad = (e) => {
    setCiudad(e.target.value);
  };

  const formatearTiempo = (fecha) => {
    return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="contenedor">
      <div className="fondo"></div>
      <div className="contenido">
        <h1>El tiempo en Argentina</h1>
        <div className="reloj">
          {formatearTiempo(tiempo).split(':').map((t, i) => (
            <div key={i} className="reloj-abatible">
              <div className={`tarjeta-abatible ${t !== formatearTiempo(tiempoAnterior).split(':')[i] ? 'abatimiento' : ''}`}>
                <div className="tarjeta-frontal">{t}</div>
                <div className="tarjeta-trasera">{t}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="grupo-formulario">
          <label htmlFor="ciudad">Ciudad:</label>
          <input
            type="text"
            id="ciudad"
            value={ciudad}
            onChange={manejarCambioCiudad}
            className="control-formulario"
          />
        </div>
        {cargando ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>{error}</p>
        ) : datosClima ? (
          <div>
            <h2>{datosClima.name}</h2>
            <p>Temperatura: {datosClima.main.temp} °C</p>
            <p>Clima: {datosClima.weather[0].description}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Weather;
