const userTab= document.querySelector("[data-userWeather]")
const searchTab=document.querySelector("[search-weather]")
const userContainer=document.querySelector(".data-container")
 const grant=document.querySelector(".grant-location-container")
 const formSection=document.querySelector(".form-container")
 const loadingSection=document.querySelector(".loading-container")
 const userInformation=document.querySelector(".user-info-container")
 const cardsPara=document.querySelector(".parameter-container");

  //variable


let currentTab=userTab;
  const API_KEY = "47d2d65ebb73235e8a86a44764541bdf";
  currentTab.classList.add("current-tab");

  getfromSessionStorage();


  function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!formSection.classList.contains("active")){
            userInformation.classList.remove("active");
            grant.classList.remove("active");
            formSection.classList.add("active");
        }
        else{
            // ma phala search wala tab par tha, ab your weather tab visisble krne h
            formSection.classList.remove("active");
            userInformation.classList.remove("active");
            // ab ma your weather tab ma aagya hu ,toh weather bhi display krne  padege ,
            // so let's check local stroage first for coordinates , if we have saved them
            getfromSessionStorage();
        }
    }
    
  }

  userTab.addEventListener("click", ()=>{
    //pass clicked tab as a input
    switchTab(userTab);
  });

  searchTab.addEventListener("click", () =>{
    // pass clicked as  a input
    switchTab(searchTab);
    
  });

//  check if we coordinates are already presnt in seession stroage 
  function getfromSessionStorage(){
     const localCoordinates=sessionStorage.getItem("user-coordinates");
     if(!localCoordinates){
        //agar local coordinates nahi mila hai toh humhe grant location access wla container active krne chaiye 
        grant.classList.add("active");
     }
     else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
     }
  }


  // function jo coordinates leke means longitutude & latitude leke weather fetch krke dege by api 
  async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //toh api call krge toh  grant access location wala section remove dikahna padeege means invisible
    //  uske blda loading  hota hua dikhana padge means visible jab tk api data fetch krke na le aaye 
    
    grant.classList.remove("active");
    loadingSection.classList.add("active");
//   APL CALL
    try{
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      const data= await response.json();

      loadingSection.classList.remove("active");
      userInformation.classList.add("active");
      renderWeatherInfo(data);

    }
    catch{
        loadingSection.classList.remove("active");
    // h.w
    console.error("Error fetching weather data:", error);
    }
  }

  function renderWeatherInfo(weatherInfo){
    // firstly we to fetch the elements
    const cityName=document.querySelector("[data-cityname]");
    const countryIcon=document.querySelector("[data-countryIcon");
    const description=document.querySelector("[weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloud=document.querySelector("[data-cloudiness]")
   
    // fetch values from weatherInfo object and put it UI elements
   cityName.innerText=  weatherInfo?.name;
   countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   description.innerText=weatherInfo?.weather?.[0]?.description;
   weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   temp.innerText = `${weatherInfo?.main?.temp} °C `;
   windspeed.innerText =` ${weatherInfo?.wind?.speed} m/s`;
   humidity.innerText = `${weatherInfo?.main?.humidity} %` ;
   cloud.innerText = `${weatherInfo?.clouds?.all} %`;

}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition); 
      }
      else{
        // h.w- show  an alert for no geo-location support
        // console.log("error to fetch");
        console.error("Geolocation is not supported by this device.");
      }
}

function showPosition(Position){
    const userCoordinates={
        lat:Position.coords.latitude,
        lon:Position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


const grantAccessButton=document.querySelector("[data-grant]");
grantAccessButton.addEventListener("click" ,getlocation);


const searchInput=document.querySelector("[data-searchInput]");
formSection.addEventListener("submit",(e) => {
    e.preventDefault();
    if(searchInput.value==="") return;
     fetchSearchWeatherInfo(searchInput.value);

});

async function fetchSearchWeatherInfo(city){
  loadingSection.classList.add("active");
  userInformation.classList.remove("active");
  grant.classList.remove("ative");

  try{
  const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
  const data=await response.json();
  loadingSection.classList.remove("active");
  userInformation.classList.add("active");
  renderWeatherInfo(data);

  }
  catch{
    console.log("Not Found")
    
  }

}

