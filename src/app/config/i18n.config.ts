export type Lang = 'es' | 'en';

export const TRANSLATIONS = {
  es: {
    header: {
      title: 'Lanzarote',
      subtitle: 'Surf Forecast',
      dashboard: 'Estación Dashboard v1.2',
    },
    nav: {
      targetStation: 'Estación de Destino',
      timezone: 'Zona Horaria Canarias',
      realtime: 'Tiempo Real',
    },
    metrics: {
      peakPrediction: 'Pico Máximo 24h',
      peakDesc: 'Altura máxima prevista para hoy',
      meters: 'metros',
      sessionQuality: 'Calidad de Sesión',
      stationStatus: 'Estado Estación',
      syncActive: 'Sincronización Activa',
      telemetryDesc: 'Recibiendo telemetría satelital de nodos Open-Meteo.',
      windTitle: 'Viento Actual',
      windDesc: 'Velocidad del viento en superficie (10m).',
      dangerTitle: 'Energía Marina',
    },
    danger: {
      low: 'Suave',
      moderate: 'Moderada',
      high: 'Fuerte',
      extreme: 'Muy Alta',
    },
    chart: {
      title: 'Dinámica de Olas',
      subtitle: 'Serie Temporal / Pronóstico 72H',
      footerInfo: 'Los marcadores representan intervalos horarios. Las fechas se actualizan a las 00:00 (Hora Canarias).',
      waveHeight: 'Altura de Ola (m)',
    },
    footer: {
      copyright: 'Lanzarote Surf Forecast / © 2026',
    },
    error: {
      title: 'Upps! Error de Conexión',
      message: 'No hemos podido recibir los datos de los satélites. Por favor, comprueba tu conexión.',
      retry: 'Reintentar ahora',
    },
    status: {
      analyzing: 'Analizando',
      syncing: 'Sincronizando con red de boyas...',
      epic: 'Épico / Potente',
      epicDesc: 'Condiciones Pro. Solo para expertos.',
      optimal: 'Swell Formado',
      optimalDesc: 'Buenas series. Condiciones ideales para casi todos.',
      playful: 'Pequeño / Divertido',
      playfulDesc: 'Ideal para longboard o iniciación.',
      flat: 'Plato / Sin energía',
      flatDesc: 'Mar en calma. Toca buscar otro spot.',
    }
  },
  en: {
    header: {
      title: 'Lanzarote',
      subtitle: 'Surf Forecast',
      dashboard: 'Station Dashboard v1.2',
    },
    nav: {
      targetStation: 'Target Station',
      timezone: 'Canary Timezone',
      realtime: 'Realtime Update',
    },
    metrics: {
      peakPrediction: '24H Max Swell',
      peakDesc: 'Highest wave height forecast for today',
      meters: 'meters',
      sessionQuality: 'Session Quality',
      stationStatus: 'Station Status',
      syncActive: 'Sync Active',
      telemetryDesc: 'Receiving satellite telemetry from Open-Meteo nodes.',
      windTitle: 'Current Wind',
      windDesc: 'Surface wind velocity at 10m altitude.',
      dangerTitle: 'Marine Energy',
    },
    danger: {
      low: 'Gentle',
      moderate: 'Moderate',
      high: 'Strong',
      extreme: 'Powerful',
    },
    chart: {
      title: 'Wave Dynamics',
      subtitle: 'Swell Time-Series / 72H Forecast Window',
      footerInfo: 'Graph markers represent hourly intervals. Dates are automatically updated at 00:00 Canary Islands Time (WET/WEST).',
      waveHeight: 'Wave Height (m)',
    },
    footer: {
      copyright: 'Lanzarote Surf Forecast / © 2026',
    },
    error: {
      title: 'Connection Lost',
      message: 'We were unable to reach the satellite network. Please check your internet connection.',
      retry: 'Retry connection',
    },
    status: {
      analyzing: 'Analyzing',
      syncing: 'Syncing with buoy network...',
      epic: 'Epic / Heavy',
      epicDesc: 'Pro conditions. Expert skills required.',
      optimal: 'Optimal Swell',
      optimalDesc: 'Consistent energy. Perfect for most sessions.',
      playful: 'Small / Playful',
      playfulDesc: 'Fun size for longboarding or beginners.',
      flat: 'Flat / Low Energy',
      flatDesc: 'Very low power. Check other coastlines.',
    }
  }
};
