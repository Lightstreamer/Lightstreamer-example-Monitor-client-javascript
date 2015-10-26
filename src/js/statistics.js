/*
  Copyright (c) Lightstreamer Srl

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
// Table Management for the Statistics Section

/////////////////Common highlighter  
  define("StyleFormatter",[],function() {
  
    function StyleFormatter(hot,cold,time) {
      this.hot = hot;
      this.cold = cold;
      this.time = time;
    }
    
    StyleFormatter.prototype = {
      onVisualUpdate: function(key, visualUpdateInfo) {
        if (visualUpdateInfo != null) {
            visualUpdateInfo.setHotTime(this.time);
            visualUpdateInfo.setStyle(this.hot, this.cold);
        }
      }
    };
    
    return StyleFormatter;
    
  });
  
//////////////// Statistics Table Management

  require(["js/lsClient","Subscription","StaticGrid","StyleFormatter"], function(lsClient,Subscription,StaticGrid,StyleFormatter) {
    //////////////// Statistics Table Management
    var monitoringGrid = new StaticGrid("stats",true);
    monitoringGrid.setAutoCleanBehavior(true,true);
    monitoringGrid.addListener(new StyleFormatter("lshot","lscold",1000));
    
    monitoringGrid.addListener({
      onVisualUpdate: function(key,updateInfo) {
        if (updateInfo == null) {
          return;
        }
        
        updateInfo.forEachChangedField(function(fieldName,fieldValue) {
          if (fieldValue != null) {
            if (fieldValue.length > 3) {
              var intCharsNum = fieldValue.indexOf(".");
              if (intCharsNum == -1) {
                intCharsNum = fieldValue.length;
              } 
              if (intCharsNum > 3) {
                var res = "";
                while (intCharsNum > 3) {
                  res = "," + fieldValue.substr(intCharsNum-3,3) + res;
                  intCharsNum -= 3;
                }
                res = fieldValue.substr(0,intCharsNum) + res;
                if (fieldValue.indexOf(".") > -1) {
                  res += fieldValue.substr(fieldValue.indexOf("."));
                } 
                updateInfo.setCellValue(fieldName,res);
              }
            } 
          }
        });
      }
    });
    
    var monitoringSubscription = new Subscription("MERGE", monitoringGrid.extractItemList(), monitoringGrid.extractFieldList());
    monitoringSubscription.setDataAdapter("MONITOR");
    monitoringSubscription.setRequestedSnapshot("yes");
    monitoringSubscription.addListener(monitoringGrid);
    
    lsClient.subscribe(monitoringSubscription);

  });
