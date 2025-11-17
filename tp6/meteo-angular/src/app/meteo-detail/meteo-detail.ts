import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeteoService } from '../services/meteo.service';

@Component({
  selector: 'app-meteo-detail',
  templateUrl: './meteo-detail.html',
  styleUrls: ['./meteo-detail.css'],
  standalone: true,
  imports: [CommonModule, DatePipe],
})
export class MeteoDetail implements OnInit {
  meteo: any = null;
  latlon: string = '';
  openWeatherTileUrl: string = '';
  openWeatherDetailUrl: string = '';
  osmTileUrl: string = '';
  private readonly openWeatherApiKey = 'c612d238ddeb4295a6ec66592ea2456c';
  private readonly mapZoom = 6;
  private readonly mapLayer = 'clouds_new';

  constructor(private route: ActivatedRoute, private meteoService: MeteoService) {}

  ngOnInit() {
    this.getMeteo();
  }

  getMeteo() {
    const name = this.route.snapshot.paramMap.get('name');

    if (name) {
      this.meteoService
        .getMeteo(name)
        .then((data) => {
          this.meteo = data;
          this.latlon = `${data.coord.lat},${data.coord.lon}`;
          this.openWeatherDetailUrl = this.buildDetailUrl(data.name);
          const tile = this.computeTileCoords(data.coord.lat, data.coord.lon);
          this.openWeatherTileUrl = this.buildOpenWeatherTileUrl(tile.x, tile.y);
          this.osmTileUrl = this.buildOsmTileUrl(tile.x, tile.y);
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
    // Translate lat/lon to XYZ tile indices for OpenWeatherMap tiles.
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
}
