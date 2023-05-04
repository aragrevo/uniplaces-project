import {readDBFile} from 'db';

export const getLeaderboard = async () => {
  try {
    const leaderboard = await readDBFile('leaderboard');
    return leaderboard;
  } catch (e) {
    // enviar el error a un servicio de reporte de errores
    return null;
  }
};

export const getCities = async () => {
  try {
    const cities = await readDBFile('cities');
    return cities;
  } catch (e) {
    // enviar el error a un servicio de reporte de errores
    return [];
  }
};

export const getSupercasa = async () => {
  try {
    const places = await readDBFile('supercasa');
    const sortedContent = places.sort((a, b) => +a.rentValue - +b.rentValue);
    return sortedContent;
  } catch (e) {
    // enviar el error a un servicio de reporte de errores
    return null;
  }
};

export const getAirbnb = async () => {
  try {
    const places = await readDBFile('airbnb');
    const sortedContent = places.sort((a, b) => {
      return +a.rentValue - +b.rentValue;
    });
    return sortedContent;
  } catch (e) {
    // enviar el error a un servicio de reporte de errores
    return null;
  }
};
