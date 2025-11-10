window.onload = function () {
  app = new Vue({
    el: "#weatherApp",
    data: {
      loaded: false,
      formCityName: "",
      message: "WebApp Loaded.",
      messageForm: "",
      cityList: [{ name: "Paris" }],
      cityWeather: null,
      cityWeatherLoading: false,
      localTime: "", // heure locale affichée
      timeInterval: null, // pour le timer de mise à jour
    },

    mounted: function () {
      this.loaded = true;
      this.readData();
    },

    methods: {
      readData: function () {
        console.log(
          "JSON.stringify(this.cityList)",
          JSON.stringify(this.cityList)
        );
        console.log("this.loaded:", this.loaded);
      },

      addCity: function (event) {
        event.preventDefault();
        if (this.isCityExist(this.formCityName)) {
          this.messageForm = "existe déjà";
        } else {
          this.cityList.push({ name: this.formCityName });
          this.messageForm = "";
          this.formCityName = "";
        }
      },

      isCityExist: function (_cityName) {
        return (
          this.cityList.filter(
            (item) => item.name.toUpperCase() === _cityName.toUpperCase()
          ).length > 0
        );
      },

      remove: function (_city) {
        this.cityList = this.cityList.filter(
          (item) => item.name !== _city.name
        );
      },

      // ✅ Fonction pour calculer l'heure locale d'une ville
      getLocalTime: function (timezoneOffset) {
        const nowUTC =
          new Date().getTime() + new Date().getTimezoneOffset() * 60000;
        const localTime = new Date(nowUTC + timezoneOffset * 1000);
        return localTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      },

      // ✅ Fonction pour récupérer la météo via API
      meteo: function (_city) {
        let vm = this;
        vm.cityWeatherLoading = true;
        clearInterval(vm.timeInterval); // stoppe l'ancien timer s'il existe

        fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
            _city.name +
            "&units=metric&lang=fr&appid=c612d238ddeb4295a6ec66592ea2456c"
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (json) {
            vm.cityWeatherLoading = false;
            if (json.cod == 200) {
              vm.cityWeather = json;
              vm.message = null;

              // ✅ Initialiser et actualiser l'heure locale
              vm.localTime = vm.getLocalTime(json.timezone);
              vm.timeInterval = setInterval(function () {
                vm.localTime = vm.getLocalTime(json.timezone);
              }, 60000); // mise à jour chaque minute
            } else {
              vm.cityWeather = null;
              vm.message =
                "Météo introuvable pour " +
                _city.name +
                " (" +
                json.message +
                ")";
            }
          });
      },
    },
  });
};
