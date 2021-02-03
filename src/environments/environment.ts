// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  bingoApi: 'https://thebingoapi.herokuapp.com',
  defaultItems: {
    Sport: ["basketball", "bowling", "dog race", "football", "horse race", "soccer", "table tennis", "tennis"],
    Fruit: ["banana", "cherry", "grape", "kiwi", "lemon", "melon", "orange", "strawberry"],
    Battle: ["Deal 3 Damage", "Heal 2", "Shield damage"]
  },
  defaultCat: [{ name: "Sport", title: "What to Play?" }, { name: "Fruit", title: "Taste of the nature" }, { name: "Battle", title: "Battle of LUCK" }]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
