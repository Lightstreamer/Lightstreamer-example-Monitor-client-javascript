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
// Table Management for the Log Section

//////////////// Utilities to Handle Splitting of Long Messages

  // Utility method, to split text at a configurable row length
  // Note: setting setPushedHtmlEnabled(true) on the visual table is needed
  // in order to render the splitting; however, any HTML markup in the original
  // text is quoted
  function getStringBreaker(limit) {
    var patternS = "(";
    for (var i = 0; i < limit; i++) {
      patternS += "\\S";
    }
    var pattern = new RegExp(patternS + ")", "g");
    // see http://www.quirksmode.org/oddsandends/wbr.html
    return function(source) {
      var target = source.replace(pattern, "$1&#8203;");
      target = target.replace(/</g, "&lt;");
      return target;
    };
  }
  
  //StringBreaker instance for CLIENT.NAME fields (Activities) and THREAD fields (Warnings and Errors)
  var sbSmall = getStringBreaker(5);
  //StringBreaker instance for MESSAGE fields (Activities, Warnings and Errors)
  var sbMessage = getStringBreaker(20);
     
    //////////////// LogFormatter class
    function LogFormatter(field,brLength) {
      this.breaker = getStringBreaker(brLength);
      this.field = field;
    }
    LogFormatter.prototype = {
      onVisualUpdate: function(key, visualUpdateInfo) {
        if (visualUpdateInfo != null) {
          // format long values
          var value = visualUpdateInfo.getChangedFieldValue(this.field);
          if (value != null) {
            value = this.breaker(value);
            visualUpdateInfo.setCellValue(this.field, value);
          }

        }
      }
    };
    
//////////////// Handling of the Filtering Notification Led
    var lostPhase = 0;
  
    var UpdateCountChecker = function() {
      this.oldCounter = null;
    }
    
    UpdateCountChecker.prototype = {
      onItemUpdate: function(info) {
        var newCounter = info.getValue("COUNTER");
        if (this.oldCounter != null && newCounter != null) {
          if (Number(newCounter) > (Number(this.oldCounter) + 1)) {
            lostPhase++;
            var currLed = document.getElementById("luSignal").src;
            if (currLed != null && currLed.indexOf("led_on.gif") == -1) {
              document.getElementById("luSignal").src = "images/led_on.gif";
            }
            
            var callPhase = lostPhase;
            setTimeout(function() {
              if (callPhase == lostPhase) {
                document.getElementById("luSignal").src = "images/led_off.gif";
              }
            },1000);
          }
        }
        this.oldCounter = newCounter;
      }
    };

//////////////// Subscription and Update Management for the Error/Warning/Activity Message Table
 require(["js/lsClient","Subscription","DynaGrid"],function(lsClient,Subscription,DynaGrid) {
  var errorsGrid = new DynaGrid("errors",true);
  errorsGrid.setAutoScroll("ELEMENT","errTBody");
  errorsGrid.setHtmlInterpretationEnabled(true);
  errorsGrid.setAutoCleanBehavior(true,true);
    
  errorsGrid.addListener(new LogFormatter("MESSAGE",20));
  errorsGrid.addListener(new LogFormatter("THREAD",5));
     
  var warningsGrid = new DynaGrid("warnings",true);
  warningsGrid.setAutoScroll("ELEMENT","warTBody");
  warningsGrid.setHtmlInterpretationEnabled(true);
  warningsGrid.setAutoCleanBehavior(true,true);
   
  warningsGrid.addListener(new LogFormatter("MESSAGE",20));
  warningsGrid.addListener(new LogFormatter("THREAD",5));    
  
  var activitiesGrid = new DynaGrid("activities",true);
  activitiesGrid.setAutoScroll("ELEMENT","actTBody");
  activitiesGrid.setHtmlInterpretationEnabled(true);
  activitiesGrid.setAutoCleanBehavior(true,true);
    
  activitiesGrid.addListener(new LogFormatter("MESSAGE",20));
  activitiesGrid.addListener(new LogFormatter("CLIENT.NAME",5));
    
//////////////// Scriptaculous Configuration for History-Limit Slider

  // number of admitted rows on scroll tables
  var limitRows = 50;
  
  errorsGrid.setMaxDynaRows(limitRows);
  warningsGrid.setMaxDynaRows(limitRows);
  activitiesGrid.setMaxDynaRows(limitRows);

  var rowValues = [1];
  for (var x = 10; x <= 1000; x+=10) {
    rowValues.push(x);
  }
 
  new Control.Slider('handleSelectLimit','selectLimit',{sliderValue:limitRows,values:rowValues,step:10,increment:10,range:$R(1,1000),
    onSlide:function(v){
      var txt = v.toString();
      if (txt.length == 1) {
        document.getElementById("nowLimit").innerHTML = "0" + txt ;
      } else {
        document.getElementById("nowLimit").innerHTML = v;
      }
    },
    onChange:function(v){
      this.onSlide(v);
      if (limitRows != v) {
        errorsGrid.setMaxDynaRows(v);
        warningsGrid.setMaxDynaRows(v);
        activitiesGrid.setMaxDynaRows(v);
        limitRows = v;
      }
    }
  });
  
  var errorsSubscription = new Subscription("DISTINCT", "monitor_log_error", ["TIME","MESSAGE","THREAD","COUNTER"]); 
  errorsSubscription.setDataAdapter("MONITOR");
  errorsSubscription.setRequestedSnapshot("no");
  errorsSubscription.setRequestedMaxFrequency("unlimited");
  errorsSubscription.setRequestedBufferSize(25);
    
  errorsSubscription.addListener(errorsGrid);
  errorsSubscription.addListener(new UpdateCountChecker());
  
  var warningsSubscription = new Subscription("DISTINCT", "monitor_log_warning", ["TIME","MESSAGE","THREAD","COUNTER"]); 
  warningsSubscription.setDataAdapter("MONITOR");
  warningsSubscription.setRequestedSnapshot("no");
  warningsSubscription.setRequestedMaxFrequency("unlimited");
  warningsSubscription.setRequestedBufferSize(25);
    
  warningsSubscription.addListener(warningsGrid);
  warningsSubscription.addListener(new UpdateCountChecker());
  
  var activitiesSubscription = new Subscription("DISTINCT", "monitor_log_info", ["TIME","CLIENT.IP","CLIENT.NAME","MESSAGE","COUNTER"]); 
  activitiesSubscription.setDataAdapter("MONITOR");
  activitiesSubscription.setRequestedSnapshot("no");
  activitiesSubscription.setRequestedMaxFrequency("unlimited");
  activitiesSubscription.setRequestedBufferSize(25);
    
  activitiesSubscription.addListener(activitiesGrid);
  activitiesSubscription.addListener(new UpdateCountChecker());
    
  lsClient.subscribe(activitiesSubscription);
  lsClient.subscribe(warningsSubscription);
  lsClient.subscribe(errorsSubscription);
    
 });
