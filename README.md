
# muni-realtime

For this project, you will be using d3.js (http://d3js.org) to draw the real-time positions of San Francisco's buses and trains (SF Muni).
 

What To Do


First, you will need to display a base map of San Francisco. This zip file contains a few different versions in GeoJSON format: http://downloads.thousandeyes.com/challenge/sfmaps.zip


Next, draw SF Muni vehicle locations on top of the map, dynamically updating their locations every 15 seconds. You can get this information from the NextBus real-time data feed. The documentation is here:
http://www.nextbus.com/xmlFeedDocs/NextBusXMLFeed.pdf


Though it's undocumented, NextBus also provides this feed in JSON format. Just change "XML" to "JSON" in the URL. That is to say, you can use http://webservices.nextbus.com/service/publicJSONFeed instead of http://webservices.nextbus.com/service/publicXMLFeed.


Feel free to get creative with how you draw the vehicles, how you transition them to their latest positions, and so on.


Finally, provide a separate HTML control for selecting a subset of routes (the "routeTag" attribute in the data), e.g. show only "N" and "6".  Only the vehicles of the selected routes should be drawn on the map.


How To Build It


In addition to d3, you must use a modern web framework such as (but not limited to!) AngularJS, React, Vue, Aurelia, or Angular2.  You are also welcome to use any additional supporting libraries you want. However, please do not use any non-d3 drawing libraries or out-of-the-box mapping packages such as leaflet.js.

 

Note that the NextBus server allows AJAX requests from all origins, so you can fetch the data directly from your JavaScript code, no backend required.


Submitting Your Solution

 

It typically takes somewhere between 4 and 8 hours to complete a basic, working version of this challenge. However, as long as you submit your solution within a week, you are welcome to spend as much or as little time on it as you would like. Just keep in mind that we are a lot more interested in well-engineered, production-quality code than we are in visual aesthetics or a fully completed challenge. If you find yourself taking significantly longer than 8 hours to complete a basic, working version, or you simply have no more time to spend on it, please submit what you have so far. We will be happy to evaluate it. Above all, have fun! 

 

A Note On Results


We’re assessing challenges primarily on the submitted code, not the number of features or level of polish in the UI. We want to get a sense of the quality of the code you’d be contributing here. If you find yourself having to decide between improving the UI or the code, please focus on improving the code! Structure the submission as if it were code that you’d contribute to an application that requires long term maintenance.


What does this mean? Separation of concerns, avoiding redundant code (single sources of truth), human friendly variable naming, modern coding conventions, following best practices of the chosen frameworks, and avoiding real world performance pitfalls should be the primary focus when implementing the challenge.

 
_________________________________________
Please submit here:
https://app.greenhouse.io/tests/76c77cd07efd2a4ab80abc5f567a9dc7
