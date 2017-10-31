# React Native Carousel Control

React Native Carousel with support for both iOS and Android.
![carousel-demo](https://cloud.githubusercontent.com/assets/671212/13221426/1cc2d1fc-d95a-11e5-88d2-3c4d738814e9.gif)

React >= 16 -> 2.x.x
React <  16 -> 1.x.x

## Installation

```
npm install react-native-carousel-control --save
```

## Usage

```
import Carousel from "react-native-carousel-control";
//...
<Carousel>
    <Text>Hello</Text>
    <Text>World!</Text>
    <Text>From carousel</Text>
</Carousel>
```

The carousel has the following format:

```
     ------------
    |      v--- page
    |-   ----   -|
    | | |    | | |
    | | |    | | |
    | | |    | | |
    |-   ----   -|
    |^-- sneak   |
    |         ^--- gap
     ------------
```

### pageStyle

Type: `PropTypes.object`

The style that will be applied on the page. For example:

```
<Carousel pageStyle={ {backgroundColor: "white", borderRadius: 5} }>
```

### pageWidth

Type: `PropTypes.number`

The width of the page. By default it will adjust to `deviceWidth - 100`.

### initialPage

Type: `PropTypes.number`

The index of the initial page. The first page is `0`.

### onPageChange

Type: `PropTypes.func`

This function will be called every time the page changes.

### sneak

Type: `PropTypes.number`

How much of the adjacent pages will display (see format above).

### currentPage

Type: `PropTypes.number`

Update this value to move carousel to a specific page. For example:

```
<Carousel currentPage={ this.state.pageNumber }>
```

### swipeThreshold

Type: `PropTypes.number`

How much users have to swipe to go to the next/prev page. Default: 0.5 (half the page)

## License

The MIT License (MIT)

Copyright (c) 2016 Gustavo Machado <machadogj@gmail.com>.