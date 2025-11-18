import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MeteoService {
  constructor() {}

  getMeteo(name: string): Promise<any> {
    console.log('from service:', name);
    return this.fetchJson(
      'https://api.openweathermap.org/data/2.5/weather?q=' +
        encodeURIComponent(name) +
        '&units=metric&lang=fr&appid=c612d238ddeb4295a6ec66592ea2456c'
    );
  }

  getForecast(name: string): Promise<any> {
    console.log('forecast for:', name);
    return this.fetchJson(
      'https://api.openweathermap.org/data/2.5/forecast?q=' +
        encodeURIComponent(name) +
        '&units=metric&lang=fr&appid=c612d238ddeb4295a6ec66592ea2456c'
    );
  }

  private fetchJson(url: string): Promise<any> {
    return fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (json.cod === 200 || json.cod === '200') {
          return Promise.resolve(json);
        } else {
          return Promise.reject(json.message);
        }
      });
  }
}
