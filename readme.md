# Quiz-rel-cleaner
### *Child Type*: pre-import
### *Platform*: All
### *Required*: Required

This child module is built to be used by the Brigham Young University - Idaho D2L to Canvas Conversion Tool. It utilizes the standard `module.exports => (course, stepCallback)` signature and uses the Conversion Tool's standard logging functions. You can view extended documentation [Here](https://github.com/byuitechops/d2l-to-canvas-conversion-tool/tree/master/documentation).

## Purpose

This child module removes all instances of the rel attribute show below from quiz xml files before they import to canvas. If these rel attributes are not removed the Canvas API will not allow access to the quiz questions, throwing a 500 error every time.

```js
 rel="noopener noreferrer"
 ``` 

## How to Install

```
npm install quiz-rel-cleaner
```

## Run Requirements

This child module uses course.content to supply the XML files. It can run anywhere in the pre-import phase of the conversion tool.

## Options

This tool does not utilize any options.

## Outputs

This module updates the dom property on each quiz file object (located in course.content).

## Process

1. Get quiz XML by sorting through course.content
2. Search for `rel="noopener noreferrer"` with a rexex
3. If any matches are found, remove them
4. Update the dom property with the new XML

## Log Categories

List the categories used in logging data in your module.

- Removed "rel" Tags

## Requirements

Allow future child modules and other programs to access quiz questions via Canvas API