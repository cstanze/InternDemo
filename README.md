# InternDemo

## Running

There's not much to it, you can open this file in a browser - preferably one that isn't obselete or outright dead (I'm looking at you *Netscape Navigator*). Another way of running this project is by using [`serve`](https://npmjs.com/package/serve). When running using `serve`, it's as simple as navigating to the root directory of this project and running `serve` on the command line after installing the tool. After which you can view the project in a browser - again not something as antiquated as *Internet Explorer* - using the addresss `localhost:5000`

## Errata

- "Dark" mode not working with some components

## Changelog

- Fixed an issue where selecting items by clicking on the text didn't work.
- Added a simple indicator for the currently editing item
  - Solved an edge case where reordering items while editing would change the current editing item. However, the current changes will be cleared when reordering... this is intended behaviour.
- Fixed an issue where selecting an item then selecting another item would clear the form instead of swapping the contents.
