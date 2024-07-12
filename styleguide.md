# 🚀 Gallant Code Style Guide 🚀
<style>
@keyframes fly {
  0% { transform: translateY(0) rotate(-45deg); }
  50% { transform: translateY(-50px) rotate(-45deg); }
  100% { transform: translateY(0) rotate(-45deg); }
}

.rocket {
  display: inline-block;
  font-size: 50px;
  animation: fly 2s ease-in-out infinite;
}

.rocket:nth-child(2) { animation-delay: 0.5s; }
.rocket:nth-child(3) { animation-delay: 1s; }
</style>

<div>
  <span class="rocket">🚀</span>
  <span class="rocket">🚀</span>
  <span class="rocket">🚀</span>
</div>
Welcome to our stellar JavaScript style guide! Strap in for a cosmic journey through the galaxy of clean code. 🌌

## 🌟 The Prime Directives

1. **Embrace the Future**: We're voyaging with ECMAScript 2022. Set your phasers to `ecmaVersion: 2022`!
2. **Module Mindset**: Our ship runs on `"module"` power. Import and export with pride!

## 🎭 The Characters in Our Story

### Quotes: The Twins of Text
```javascript
const message = "Double quotes are our heroes!";
```
Why? Because sometimes it's nice to use contractions without escaping!
## Semicolons: The Punctual Punctuation
javascriptCopyconst neverLate = "Always end with a semicolon";
Be like semicolons - always show up where you're expected!
## Indentation: The Space Odyssey
```javascript
Copyfunction spaceExplorer() {
    const mission = "4 spaces per level";
    return mission;
}
```
Four spaces: not too little, not too much. Just right for our code astronauts!

## 🎨 The Art of Variables
### Const: The Immovable Object
```javascript
const GALAXY_NAME = "Milky Way";
```
If it doesn't move, make it const. Be the unmovable rock in the river of change!
## Let: The Shapeshifter
```javascript
let currentPlanet = "Earth";
currentPlanet = "Mars"; // We're moving!
```
Use let for variables that need to transform. No var allowed in our universe!
## Camel Case: The Smooth Operator
```javascript
const ourSmoothSpaceship = "USS Enterprise";
Bumpy names are for asteroids, not for our sleek variables!
```
## 🏗️ The Architecture of Code
### Line Length: The Horizon
Keep your lines under 100 characters. Like a beautiful horizon, not an endless void.
### Empty Lines: The Cosmic Void
```javascript
const firstStar = "Sirius";

const secondStar = "Betelgeuse";
```
One empty line between statements. Any more would be... space waste!

### Curly Braces: The Embracers
```javascript
if (isAlien) {
    greet("Welcome to Earth!");
}
```
Always use curly braces, even for single-line blocks. Embrace your code!

## 🎬 The Script of Functions
### Arrow Functions: The Sleek Shuttles
```javascript
const warpSpeed = (factor) => factor * 299792458;
```
When possible, keep them concise. Less fuel for faster travel!
### Destructuring: The Element Extractor
```javascript
const { captain, engineer } = starshipCrew;
```
Extract what you need, leave the rest. Efficient space travel 101!
## 🎭 The Grand Finale
Remember, young padawan, this style guide is your lightsaber. Wield it with precision, and may the force of clean code be with you!
