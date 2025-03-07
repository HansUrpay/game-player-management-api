// import opencage from 'opencage-api-client';
const opencage = require('opencage-api-client');

export async function getCoordinates(location: string) {
  try {
    const response = await opencage.geocode({
      q: location,
    });

    if (response.status.code === 200 && response.results.length > 0) {
      const place = response.results[0];
      return place.geometry;
    } else {
      console.error('Error en la respuesta:', response.status.message);
      console.error('Total de resultados:', response.total_results);
    }
  } catch (error) {
    console.error('Error en la solicitud:', error.message);
  }
}

export const calculateDistanceHaversine = (
  latOrigin: number,
  lonOrigin: number,
  latDestination: number,
  lonDestination: number,
) => {
  // Radio de la Tierra en kilómetros
  const R = 6371;

  // Calcular diferencias de latitud y longitud
  const differenceLat = (latDestination - latOrigin) * (Math.PI / 180);
  const differenceLon = (lonDestination - lonOrigin) * (Math.PI / 180);

  // Formula de Haversine
  const a =
    Math.sin(differenceLat / 2) * Math.sin(differenceLat / 2) +
    Math.cos(latOrigin * (Math.PI / 180)) *
      Math.cos(latDestination * (Math.PI / 180)) *
      Math.sin(differenceLon / 2) *
      Math.sin(differenceLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distancia en kilómetros
  const distance = R * c;

  return distance;
};
