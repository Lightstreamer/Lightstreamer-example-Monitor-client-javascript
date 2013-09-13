# Lightstreamer Monitor Demo Client for JavaScript #

This project includes a web client front-end example for the [Lightstreamer Monitor Demo Adapter](https://github.com/Weswit/Lightstreamer-example-Monitor-adapter-java).

## Monitor Console Demo ##

<table>
  <tr>
    <td style="text-align: left">
      &nbsp;<a href="http://demos.lightstreamer.com/MonitorDemo" target="_blank"><img src="http://www.lightstreamer.com/img/demo/screen_monitor.png"></a>&nbsp;
      
    </td>
    <td>
      &nbsp;An online demonstration is hosted on our servers at:<br>
      &nbsp;<a href="http://demos.lightstreamer.com/MonitorDemo" target="_blank">http://demos.lightstreamer.com/MonitorDemo</a>
    </td>
  </tr>
</table>

This application shows a real-time monitor console. Several metrics are reported as they change on the server.<br>

The demo includes the following client-side technologies:
* Three [Subscription](http://www.lightstreamer.com/docs/client_javascript_uni_api/Subscription.html)s containing the items for the statistics, subscribed to in <b>MERGE</b> mode feeding three [StaticGrid](http://www.lightstreamer.com/docs/client_javascript_uni_api/StaticGrid.html)s. Fields from a single item are associated to cells scattered in the page.
* Three [Subscription](http://www.lightstreamer.com/docs/client_javascript_uni_api/Subscription.html)s containing the items for the server logging, subscribed to in <b>DISTINCT</b> mode feeding three [DynaGrid](http://www.lightstreamer.com/docs/client_javascript_uni_api/DynaGrid.html)s.

# Deploy #

Before you can run the demo some dependencies need to be solved:

-  Get the lightstreamer.js file from the [latest Lightstreamer distribution](http://www.lightstreamer.com/download) 
   and put it in the "src/js" folder of the demo (if that is the case, please create it). Alternatively you can build a lightstreamer.js file from the 
   [online generator](http://www.lightstreamer.com/distros/Lightstreamer_Allegro-Presto-Vivace_5_1_1_Colosseo_20130305/Lightstreamer/DOCS-SDKs/sdk_client_javascript/tools/generator.html).
   In that case be sure to include the LightstreamerClient, Subscription, DynaGrid, StaticGrid and StatusWidget modules and to use the "Use AMD" version.
-  Get the require.js file form [requirejs.org](http://requirejs.org/docs/download.html) and put it in the "src/js" folder of the demo.
-  Get the zip file from [script.aculo.us](http://script.aculo.us/downloads) and put the prototype.js, scriptaculous.js, and slider.js files in the "src/js/scriptaculous" folder of the demo.

You can deploy this demo in order to use the Lightstreamer server as Web server or in any external Web Server you are running. 
If you choose the former case please note that in the <LS_HOME>/pages/demos/ folder there is a copy of the /src directory of this project, if this is non your case please create the folders <LS_HOME>/pages/demos/MessengerDemo then copy here the contents of the /src folder of this project.<br>
The client demo configuration assumes that Lightstreamer Server, Lightstreamer Adapters and this client are launched on the same machine. If you need to targeting a different Lightstreamer server please search this line:
```js
var lsClient = new LightstreamerClient(protocolToUse+"//localhost:8080","DEMO");
```
in js/lsClient.js file and change it accordingly.<br>
Anyway the [MONITOR]() and [MonitorDemo]() Adapters have to be deployed in your local Lightstreamer server instance. The factory configuration of Lightstreamer server already provides this adapter deployed.<br>
The demo are now ready to be launched.

# See Also #

## Lightstreamer Adapters needed by this demo client ##

* To be add: [Lightstreamer Monitor Demo Adapter]()

## Similar demo clients that may interest you ##

* [Lightstreamer StockList Demo Client for JavaScript](https://github.com/Weswit/Lightstreamer-example-Stocklist-client-javascript)
* [Lightstreamer Chat Demo Client for JavaScript](https://github.com/Weswit/Lightstreamer-example-Chat-client-javascript)
* [Lightstreamer Portfolio Demo Client for JavaScript](https://github.com/Weswit/Lightstreamer-example-Portfolio-client-javascript)

# Lightstreamer Compatibility Notes #

- Compatible with Lightstreamer JavaScript Client library version 6.0 or newer.