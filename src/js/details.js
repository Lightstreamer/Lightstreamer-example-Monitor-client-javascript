/*
  Copyright 2013 Weswit Srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

// Lightstreamer Monitor Console Demo
// Table Management for the Server Details Section
  
  require(["js/lsClient","Subscription","StaticGrid"], function(lsClient,Subscription,StaticGrid) {
    function pad(n){
      return n<10 ? '0'+n : n
    }
    
    function serverAddress() {
      return lsClient.connectionDetails.getServerInstanceAddress() || lsClient.connectionDetails.getServerAddress();
    }
    var identificationGrid = new StaticGrid("license",true);
    identificationGrid.setAutoCleanBehavior(true,true);
  
    identificationGrid.addListener({
      onVisualUpdate: function(item, visualUpdateInfo) {
        if (visualUpdateInfo == null) {
          return;
        }
        
        visualUpdateInfo.setHotTime(0);
        visualUpdateInfo.setStyle('infoValue', 'infoValue');
        
        var ms = visualUpdateInfo.getChangedFieldValue("STARTUP_TIME");
        if (ms !== null) {
          ms = new Date(Number(ms));
          var dateStr = ms.getUTCFullYear()+"-"+
            pad(ms.getUTCMonth()+1)+"-"+
            pad(ms.getUTCDate())+" "+
            pad(ms.getUTCHours())+":"+
            pad(ms.getUTCMinutes())+":"
            +pad(ms.getUTCSeconds())+" UTC";
          visualUpdateInfo.setCellValue("STARTUP_TIME",dateStr);
        }
      }
    });
    
    var identificationSubscription = new Subscription("MERGE", identificationGrid.extractItemList(), identificationGrid.extractFieldList());
    identificationSubscription.setDataAdapter("MONITOR");
    identificationSubscription.setRequestedSnapshot("yes");
    identificationSubscription.addListener(identificationGrid);
    
    identificationSubscription.addListener({
      onSubscription: function() {
        identificationGrid.updateRow("monitor_identification",{"SERVER_ADDRESS":serverAddress()});
      }
    });
    
    lsClient.addListener({
      onStatusChange: function(newStatus) {
        if (newStatus.indexOf("DISCONNECTED") != 0) {
          identificationGrid.updateRow("monitor_identification",{"SERVER_ADDRESS":serverAddress()});
        }
      }
    });
    
    lsClient.subscribe(identificationSubscription);
  });
  
//////////////// Subscription Management for Server Local Port Data
  require(["js/lsClient","Subscription","StaticGrid"],function(lsClient,Subscription,StaticGrid) {
  
    var socketGrid = new StaticGrid("socket",true);
    socketGrid.setAutoCleanBehavior(true,true);
    socketGrid.addListener({
      onVisualUpdate: function(item, visualUpdateInfo) {
        if (visualUpdateInfo == null) {
          return;
        }
        
        visualUpdateInfo.setHotTime(0);
        visualUpdateInfo.setStyle('infoValue', 'infoValue');
      }
    });
    
    var socketSubscription = new Subscription("MERGE", socketGrid.extractItemList(), socketGrid.extractFieldList());
    socketSubscription.setDataAdapter("MONITOR");
    socketSubscription.setRequestedSnapshot("yes");
    socketSubscription.addListener(socketGrid);
    
    lsClient.subscribe(socketSubscription);
  });
