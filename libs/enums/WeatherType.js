var WeatherType;
(function (WeatherType) {
    WeatherType[WeatherType["NONE"] = 0] = "없음";
    WeatherType[WeatherType["SUNNY"] = 1] = "쾌청";
    WeatherType[WeatherType["RAIN"] = 2] = "비";
    WeatherType[WeatherType["SANDSTORM"] = 3] = "모래바람";
    WeatherType[WeatherType["HAIL"] = 4] = "우박";
    WeatherType[WeatherType["SNOW"] = 5] = "눈";
    WeatherType[WeatherType["FOG"] = 6] = "안개";
    WeatherType[WeatherType["HEAVY_RAIN"] = 7] = "폭우";
    WeatherType[WeatherType["HARSH_SUN"] = 8] = "강한 햇빛";
    WeatherType[WeatherType["STRONG_WINDS"] = 9] = "강풍";
})(WeatherType || (WeatherType = {}));
