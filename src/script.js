// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create global variables
const $form = $("form");
const $textInput = $("input[type='text']");
const $btnFight = $(".btn-fight");
const $btnStart = $(".btn-start");
const $heroName = $("#hero-name");
const $villainName = $("#villain-name");
const $listContainer = $(".list-container");
const $message = $(".message");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create an emtpy app object
const app = {};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create the API call to get data response
app.getDataResponse = function (name) {
  $.ajax({
    url: "https://proxy.hackeryou.com",
    dataType: "json",
    method: "GET",
    data: {
      reqUrl: `https://superheroapi.com/api/2827783424155773/search/${name}`,
      params: {
        dataType: "json",
        method: "GET",
      },
    },
  })
    // Chain the .then() method to get the successful data request
    .then((res) => {
      // Get the array of the API data results
      const resultsArray = res.results;

      // Get the random result from the array of data
      const index = Math.floor(Math.random() * resultsArray.length);
      const result = resultsArray[index];

      // Get the data to check if the data is the result of hero or villain
      const type = result.biography.alignment;
      if (type === "good") {
        // Display the result to hero section
        app.displayInfo("hero", result);

        // Call the function to display the modal overlay the hero section when click the info button
        app.displayDetails("hero");
      } else {
        // Display the result to villain section
        app.displayInfo("villain", result);

        // Call the function to display open the modal overlay the villain section when click the info button
        app.displayDetails("villain");
      }

      // Search if there are enough of 10 <span> elements to get all of the values
      if ($(".fight").length === 10) {
        // Call the score function and store in the variables
        const heroScore = app.score("hero");
        const villainScore = app.score("villain");

        // Listen to the click button to compare the score
        $btnFight.on("click", function () {
          $message.addClass("show");

          // Print the message on the page
          if (heroScore > villainScore) {
            app.displayMessage("hero", "villain", heroScore);
          } else {
            app.displayMessage("villain", "hero", villainScore);
          }
        });
      }
    })
    // Chain the .fail() method to handle the error while getting the data request
    .fail(() => {
      // Empty the sections when the data is rejected
      $listContainer.empty();

      // Pop up the warning box to UI for wrong search input
      alert(
        "Your Heroes or Vilians Not Matched! Please enter the name in the right category!"
      );
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create the function to display the info of heroes and villains to the page
app.displayInfo = function (type, result) {
  const displayHtml = `
  <div class="${type}-card">
    <h3 class="${type}-title">${result.name}</h3>
    <div class="image-container">
      <img
        class="${type}-image"
        src="${result.image.url}"
        alt="${result.name}"
      />
    </div> 
    <div class="feature-container">
      <ul class="${type}-features">
        <li class="feature-list">Race: ${
          result.appearance.race !== "null" ? result.appearance.race : "N/A"
        }</li>
        <li class="feature-list">Combat: <span class="fight">${
          result.powerstats.combat !== "null" ? result.powerstats.combat : "N/A"
        }</span></li>
        <li class="feature-list">Power: <span class="fight">${
          result.powerstats.power !== "null" ? result.powerstats.power : "N/A"
        }</span></li>
        <li class="feature-list">Speed: <span class="fight">${
          result.powerstats.speed !== "null" ? result.powerstats.speed : "N/A"
        }</span></li>
        <li class="feature-list">Durability: <span class="fight">${
          result.powerstats.durability !== "null"
            ? result.powerstats.durability
            : "N/A"
        }</span></li>
        <li class="feature-list">Strength: <span class="fight">${
          result.powerstats.strength !== "null"
            ? result.powerstats.strength
            : "N/A"
        }</span></li>
      </ul>
      <button class="btn btn-info--${type}">More info</button>
    </div>
  </div> 
  <div class="${type}-info--modal">
    <div class="${type}-info">
      <h4>BIOGRAPHY SUMMARY</h4>
      <div class="bio">
        <p>${result.name} is ${
    result.biography.alignment === "-"
      ? "an unknown"
      : result.biography.alignment === "good"
      ? "a fictional superhero"
      : result.biography.alignment === "bad"
      ? "a fictional villain"
      : "a fictional neutral character"
  } who appears in comic books published by ${
    result.biography.publisher !== "-" ? result.biography.publisher : "unknown"
  }
      </p>
      <p>The character made the first appearance ${
        result.biography["first-appearance"] !== "-"
          ? result.biography["first-appearance"]
          : "unknown"
      }. ${result.appearance.gender === "Male" ? "His" : "Her"} full name is ${
    result.biography["full-name"]
  }. ${result.appearance.gender === "Male" ? "He" : "She"} was born in ${
    result.biography["place-of-birth"] !== "-"
      ? result.biography["place-of-birth"]
      : "unknown"
  }.
      </p>
      <p>
      The character's work is ${
        result.work.occupation !== "-" ? result.work.occupation : "unknown"
      }. ${result.appearance.gender === "Male" ? "His" : "Her"} base is in ${
    result.work.base !== "-" ? result.work.base : "unknown"
  }
      </p>
      </br>
      <h4>You might not know:</h4>
      <ul>
      <li>Height: <b>${
        result.appearance.height[0] !== "-"
          ? result.appearance.height[0]
          : "unknown"
      }</b></li>
      <li>Weight: <b>${
        result.appearance.weight[0] !== "-"
          ? result.appearance.weight[0]
          : "unknown"
      }</b></li>
      <li>Eyes color: <b>${
        result.appearance["eye-color"] !== "-"
          ? result.appearance["eye-color"]
          : "unknown"
      }</b></li>
      <li>Hair color: <b>${
        result.appearance["hair-color"] !== "-"
          ? result.appearance["hair-color"]
          : "unknown"
      }</b></li>
      <li>Relatives: <b>${
        result.connections.relatives !== "-"
          ? result.connections.relatives
          : "unknown"
      }</b></li>
      </ul>
      </div>
    </div>
    <button class="${type}--btn-close"><i class="fas fa-times"></i></button>
  </div>
  `;

  // Append the APIs data results on the page
  $(`section.${type}`).append(displayHtml);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function helper to get the sum score
app.score = function (type) {
  // Use .map method to get the values of all span elements
  const sumVal = $(`.${type} .fight`)
    .map((_, item) => {
      return +item.textContent;
    })
    // Chain .get() to get an array of the values
    .get()
    // Chain .reduce() to get the sum of all the values in the array
    .reduce((acc, val) => acc + val);
  return sumVal;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function helper to print the message for the winner
app.displayMessage = function (type1, type2, score) {
  // Empty the message for the winner
  $message.empty();

  // Append the message for the winner on the page
  const messageHtml = `
  <p>The score based on the total score of 5 criteria: combat, power, speed, durability and strength:</p>
  <p><span class="winner">${$(`.${type1}-title`).text()} beats ${$(
    `.${type2}-title`
  ).text()} with ${score} points.</span> </p>
  `;
  $message.append(messageHtml);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function helper to open the modal for more infomation
app.displayDetails = function (type) {
  // Listen to the click button to open the modal
  $(`.btn-info--${type}`).on("click", function () {
    $(`.${type}-info--modal`).addClass("show");
  });

  // Listen to the close button to close the modal
  $(`.${type}--btn-close`).on("click", function () {
    $(`.${type}-info--modal`).removeClass("show");
  });
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create the function to get the value from API
app.getValue = function () {
  // Listen to the submit event from UI input in the form section
  $form.on("submit", function (e) {
    e.preventDefault();

    // Get the value of the input from UI and store it in the variables
    const heroNameValue = $heroName.val();
    const villainNameValue = $villainName.val();

    // Call the getDataResponse functions by passing the argument as the name of hero or villain
    app.getDataResponse(heroNameValue);
    app.getDataResponse(villainNameValue);

    // Empty the input value after submitting the form
    $textInput.val("");

    // Empty the section and message on the page
    $listContainer.empty();
    $message.removeClass("show");
  });
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create an init method in the app object
app.init = function () {
  // Call the getValue function
  app.getValue();

  // Scroll function
  const scrollSToSec = function (sec1, sec2) {
    const sec1CoordTop = sec1.offset().top;
    const sec2CoordTop = sec2.offset().top;
    const position = sec1CoordTop + sec2CoordTop - 50;
    window.scrollTo(0, position);
  };

  // Listen to the start button to scroll to the form section
  $btnStart.on("click", () => scrollSToSec($btnStart, $form));

  // Listen to the submit form to scroll to the list section
  $form.on("submit", () => scrollSToSec($listContainer, $form));

  // Listen to the fight button click to scroll to the score section
  $btnFight.on("click", () => scrollSToSec($btnFight, $message));
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Call the function when the document is ready
$(function () {
  // Call the init method
  app.init();
});
