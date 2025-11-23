import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MeteoItem } from '../meteoItem';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.html',
  styleUrls: ['./meteo.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class Meteo implements OnInit {
  city: MeteoItem = {
    name: '',
    id: 0,
    weather: null,
  };

  cityList: MeteoItem[] = [];

  constructor() {}

  ngOnInit() {
    const storedList = localStorage.getItem('cityList');

    if (storedList) {
      this.cityList = JSON.parse(storedList);
    }
  }

  onSubmit() {
    const normalized = this.city.name?.trim();
    if (normalized && !this.isCityExist(normalized)) {
      const item = new MeteoItem();
      item.name = normalized;

      this.cityList.push(item);
      this.saveCityList();

      console.log(this.city.name + ' ajouté 👍');
    } else {
      console.log(this.city.name + ' existe déjà ❗');
    }
  }

  /*onSubmit() {
    if (this.city.name !== undefined && this.isCityExist(this.city.name) === false) {
      let currentCity = new MeteoItem();
      currentCity.name = this.city.name;
      this.cityList.push(currentCity);

      this.saveCityList();

      console.log(this.city.name, 'ajouté à la dans la liste');
    } else {
      console.log(this.city.name, 'existe déjà dans la liste');
    }
  }*/

  remove(city: MeteoItem) {
    this.cityList = this.cityList.filter((c) => c.name !== city.name);

    this.saveCityList();
  }

  /*isCityExist(name: string): boolean {
    return this.cityList.some((item) => item.name?.toUpperCase() === name.toUpperCase());
  }*/

  isCityExist(name: string) {
    const norm = name.trim().toUpperCase();
    return this.cityList.some((item) => item.name?.trim().toUpperCase() === norm);
  }

  saveCityList() {
    localStorage.setItem('cityList', JSON.stringify(this.cityList));
  }
}
