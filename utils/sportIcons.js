export const sportIconPath = (sport) => {
  const sportAliases = {
    "Ultimate Frisbee": "Frisbee",
    Ultimate: "Frisbee",
  };

  const iconMap = {
    Soccer: require("../assets/soccer.png"),
    Basketball: require("../assets/basketball.png"),
    Frisbee: require("../assets/frisbee.png"),
    Hockey: require("../assets/hockey-puck.png"),
    Volleyball: require("../assets/volleyball-solid.png"),
  };

  const mappedSport = sportAliases[sport] || sport;
  return iconMap[mappedSport] || require("../assets/prayingHands.png");
};
