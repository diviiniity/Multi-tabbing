export class Finder {

    constructor() {  }
 
    findDupl(arr) { 
     /* const duplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)
      
      return Array.from(duplicates);*/
 
      const uniqueElements = new Set(arr);
      const filteredElements = arr.filter(item => {
          if (uniqueElements.has(item)) {
              uniqueElements.delete(item);
          } else {
              return item;
          }
      });
  
      return uniqueElements;
  }
 
     
     checkIfDuplicateExists(arr) {return new Set(arr).size !== arr.length}
 
    
 
 
      
        
 
 }
 
 /*var findDupl= (function (array) {   
    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index);
    console.log(findDuplicates(array ));   })*/
    
 
 
 
 /*var SecondModule = (function(MrFrontendModule) {
    let secondModuleMethods = {};
  
    secondModuleMethods.getTitleFromOtherModule = function() {
      return MrFrontendModule.getTitle();
    }
  
    return secondModuleMethods;
  })(MrFrontendModule);*/
 
 
 
 
 