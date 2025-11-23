import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MeteoService } from '../services/meteo.service';

interface ForecastDay {
  date: number;
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  weatherId: number;
}

@Component({
  selector: 'app-meteo-detail',
  templateUrl: './meteo-detail.html',
  styleUrls: ['./meteo-detail.css'],
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, RouterModule],
})
export class MeteoDetail implements OnInit {
  meteo: any = null;
  latlon: string = '';
  openWeatherTileUrl: string = '';
  openWeatherDetailUrl: string = '';
  osmTileUrl: string = '';
  forecastDays: ForecastDay[] = [];
  forecastError: string | null = null;
  private readonly openWeatherApiKey = 'c612d238ddeb4295a6ec66592ea2456c';
  private readonly mapZoom = 6;
  private readonly mapLayer = 'clouds_new';
  private readonly forecastPreferredHour = '12:00:00';

  constructor(private route: ActivatedRoute, private meteoService: MeteoService) {}

  ngOnInit() {
    this.getMeteo();
  }

  getMeteo() {
    const name = this.route.snapshot.paramMap.get('name');

    if (name) {
      this.forecastDays = [];
      this.forecastError = null;
      this.meteoService
        .getMeteo(name)
        .then((data) => {
          this.meteo = data;
          this.latlon = `${data.coord.lat},${data.coord.lon}`;
          this.openWeatherDetailUrl = this.buildDetailUrl(data.name);
          const tile = this.computeTileCoords(data.coord.lat, data.coord.lon);
          this.openWeatherTileUrl = this.buildOpenWeatherTileUrl(tile.x, tile.y);
          this.osmTileUrl = this.buildOsmTileUrl(tile.x, tile.y);
          return this.meteoService
            .getForecast(name)
            .then((forecast) => {
              this.forecastDays = this.processForecast(
                forecast?.list ?? [],
                data.dt * 1000
              );
            })
            .catch((err) => {
              this.forecastError =
                typeof err === 'string'
                  ? err
                  : 'Impossible de recuperer les previsions';
            });
        })
        .catch((err) => {
          this.meteo = { cod: 404, message: err };
        });
    }
  }

  private buildDetailUrl(name: string): string {
    return (
      'https://api.openweathermap.org/data/2.5/weather?q=' +
      encodeURIComponent(name) +
      '&units=metric&lang=fr&appid=' +
      this.openWeatherApiKey
    );
  }

  private computeTileCoords(lat: number, lon: number): { x: number; y: number } {
    const latRad = (lat * Math.PI) / 180;
    const n = Math.pow(2, this.mapZoom);
    const x = Math.floor(((lon + 180) / 360) * n);
    const y = Math.floor(
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
    );

    return { x, y };
  }

  private buildOpenWeatherTileUrl(x: number, y: number): string {
    return `https://tile.openweathermap.org/map/${this.mapLayer}/${this.mapZoom}/${x}/${y}.png?appid=${this.openWeatherApiKey}`;
  }

  private buildOsmTileUrl(x: number, y: number): string {
    return `https://tile.openstreetmap.org/${this.mapZoom}/${x}/${y}.png`;
  }

  private processForecast(list: any[], currentDateMs: number): ForecastDay[] {
    if (!Array.isArray(list) || list.length === 0) {
      return [];
    }

    const currentDateStr = new Date(currentDateMs).toISOString().split('T')[0];
    const byDate = new Map<string, any>();

    list.forEach((entry) => {
      const text = entry?.dt_txt;
      if (!text) {
        return;
      }
      const [dateStr, timeStr] = text.split(' ');
      if (dateStr === currentDateStr) {
        return;
      }
      const already = byDate.get(dateStr);
      if (!already || timeStr === this.forecastPreferredHour) {
        byDate.set(dateStr, entry);
      }
    });

    const sortedDates = Array.from(byDate.keys()).sort();
    return sortedDates.slice(0, 5).map((dateKey) => {
      const entry = byDate.get(dateKey);
      return {
        date: entry.dt * 1000,
        temp: entry.main?.temp,
        tempMin: entry.main?.temp_min,
        tempMax: entry.main?.temp_max,
        description: entry.weather?.[0]?.description ?? '',
        weatherId: entry.weather?.[0]?.id ?? 800,
      };
    });
  }
}
