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
    if (this.city.name && !this.isCityExist(this.city.name)) {
      const item = new MeteoItem();
      item.name = this.city.name;

      this.cityList.push(item);
      this.saveCityList();

      console.log(this.city.name + ' ajouté 👍');
    } else {
      console.log(this.city.name + ' existe déjà ❗');
    }
  }

  remove(city: MeteoItem) {
    this.cityList = this.cityList.filter((c) => c.name !== city.name);

    this.saveCityList();
  }

  isCityExist(name: string): boolean {
    return this.cityList.some((item) => item.name?.toUpperCase() === name.toUpperCase());
  }

  saveCityList() {
    localStorage.setItem('cityList', JSON.stringify(this.cityList));
  }
}
