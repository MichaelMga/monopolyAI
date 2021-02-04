//CLASSES


function PropositionMaterial(offerer, answerer, counterPartAsked){

	this.offerer = offerer;

	this.answerer = answerer;

	this.counterPartAsked = counterPartAsked;
	
}




function CounterPartAsked(array, lossValueForTheOwner, gainValueForTheOtherPlayer){


	////console.log('counterpart asked créée.' + 'loss ' + lossValueForTheOwner);

	this.array = array;

	this.cash = 0;

	this.lossValueForTheOwner = lossValueForTheOwner;

	this.gainValueForTheOtherPlayer = gainValueForTheOtherPlayer;

	this.mortgagesClosed = [];

	this.indirectMonopOpportunity = none;
	


}




function Offer(array, lossValueForTheOwner, gainValueForTheOtherPlayer) {

	this.array = array;

	this.cash = 0;

    this.lossValueForTheOwner = lossValueForTheOwner;

	this.gainValueForTheOtherPlayer = gainValueForTheOtherPlayer;
	
	this.mortgagesClosed = [];

	this.indirectMonopOpportunity = none;



}




function Proposition(offerer, answerer, offer, counterPartAsked ) {
	// For each property and get out of jail free cards, 1 means offered, -1 means requested, 0 means neither.

	this.offerer = offerer;
	this.answerer = answerer;
	this.offer = offer;
	this.counterPartAsked = counterPartAsked;
	this.offererScore = 0;
	this.answererScore = 0;
	this.trick = false;
	this.indirect = false;

}




// PROPOSITIONS DEFS




function tryToCreateProposition(thinker,  gainType , propositionMaterial , trick){




	//THE AI TRIES TO GENERATE REASONABLE PROPOSITIONS, USING A "PROPOSITION MATERIAL" OBJECT

	let offerer = propositionMaterial.offerer;
	let answerer = propositionMaterial.answerer;
	let offer; //VARIABLE WE LL USE FOR THE OFFER OBJECTS WE'LL GENERATE


	
	let counterPartAsked = propositionMaterial.counterPartAsked;

	let bestProposition = {thinkerScore: -infinite , proposition: none};


	let newCounterPartAsked;


	let cpaofferMortgagesToClose = [];

	let offerMortgagesToClose = [];

	

	let proposition;
	let offerArray;
	let answererGain;
	let offererLoss;
	let propertiesAskedPlusCash;


	




	
	//remove elements requested to the answerer



	 if(gainType == indirectGain){

		removeElementsFromPlayer(answerer, counterPartAsked.array);

	 }


   

	 //FIRST, ASK THE OTHER PLAYER TO BUY WHATEVER POSSIBLE (IF THERE ARE MORTGAGES)


	 if(answerer.mortgages.length > 0){	 
		 
		 
	
	    for(var cpaIndex = 0 ; cpaIndex < counterPartAsked.array.length; cpaIndex++){


				  
	  	  if(counterPartAsked.array[cpaIndex].mortgaged == true){

			if((refundableMortgageBeforeOffer(answerer, counterPartAsked.array[cpaIndex] ) == true)){

				closeMortgage(counterPartAsked.array[cpaIndex]);

				cpaofferMortgagesToClose.push(counterPartAsked.array[cpaIndex]);
										 
			};

		 }

	 }



  }




///
  


			 
	

	 //remove color duplicates from offerer array (the AI doesnt offer properties of a color it requests)



	let propertiesArray = [];

	for(var i=0; i < offerer.propertiesByColor.length ; i++){

		 let set = offerer.propertiesByColor[i].properties.slice(0);

		if(set.length > 0){

			propertiesArray.push(set);

		}

	}

     //remove color duplicates ( Dont offer elements having the same color than those you request )

	propertiesArray = removeColorDuplicates(propertiesArray, counterPartAsked.array);
	



	////console.log('here is the proposition material we are actually trying inside the function!!!');

	


	let answererCashSlices = [0 , answerer.cash * 0.1 , answerer.cash * 0.2 , answerer.cash * 0.3 , answerer.cash * 0.4 , answerer.cash * 0.5 ];
	let offererCashSlices = [0, offerer.cash * 0.1 , offerer.cash * 0.2 , offerer.cash * 0.3 , offerer.cash * 0.4 , offerer.cash * 0.5 ];



    //FIRST, GET THE VALUE OF THE COUNTERPART ASKED
	//THEN, TRY TO ADD POSSIBLE PROPOSITIONS TO THE MOVELIST


	//1 ELEMENTS PROPOSITIONS


		 //FOR EACH ANSWERER CASH SLICES

	 
     for(var answererCashSliceIndex = 0; answererCashSliceIndex < answererCashSlices.length; answererCashSliceIndex++){

		////console.log('cash asked in counterpart bucket ' + answererCashSlices[answererCashSliceIndex]);




		//ONLY ONE PLAYER CAN OFFER CASH IN A TRADE. (IF NOT, IT DOESNT MAKE SENSE)

		//SO , IF THE ANSWERER CASH SLICE IS AT THE INDEX 0 :


	    if(answererCashSliceIndex == 0 ){		
			   
					
			//FOR EACH PROPERTIES THAN CAN BE OFFERED


		     for(var propertyIndex = 0; propertyIndex < propertiesArray.length ; propertyIndex++){


				 offerArray = [propertiesArray[propertyIndex]];


				  //IF YOU CAN BUY BACK THE MORTGAGE OF THE ELEMENT YOU OFFER, DO IT. ELSE, OFFER IT THAT WAY.

				 for(var offerIndex=0; offerIndex < offerArray[0].length; offerIndex++){


				  
					if(offerArray[0][offerIndex].mortgaged == true){


						if((refundableMortgageBeforeOffer(offerer, offerArray[0][offerIndex] ) == true)){
							 
							

							closeMortgage(offerArray[0][offerIndex] );

							offerMortgagesToClose.push(offerArray[0][offerIndex]);
                                                     
						};

					}

				 }
				 				 
		     	 //DIVIDE THIS ARRAY IN SETS
			

				
				 for(var offererCashSliceIndex = 0; offererCashSliceIndex < offererCashSlices.length ; offererCashSliceIndex++){

					

					//OFFER


	                if(gainType == directGain){

						   offer = createTradeObject(offerObject, offerer, answerer, offerArray);
						   
	                 } else {

		                 offer = createIndirectTradeObject(offerObject, offerer, answerer, offerArray);
 
					 }



					 offer.mortgagesClosed = offerMortgagesToClose;

					 offer.cash = offererCashSlices[offererCashSliceIndex];


					 
					//COUNTERPART ASKED


					 if(gainType == indirectGain){
						removeElementsFromPlayer(offerer, offer.array);
						propertiesAskedPlusCash = createIndirectTradeObject(counterPartAskedObject, offerer, answerer, [counterPartAsked.array]);			 
						addElementsToPlayer(offerer, offer.array);

					
					} else {
						propertiesAskedPlusCash = createTradeObject(counterPartAskedObject, offerer, answerer, [counterPartAsked.array]);
					 }


					 propertiesAskedPlusCash.mortgagesClosed = cpaofferMortgagesToClose;
		


						
		        		 //RETURN AN OFFER OBJECT
				      

						 proposition = new Proposition(offerer, answerer, offer ,  propertiesAskedPlusCash);


						 proposition.trick = trick;

						 
						 			
						 if(profitableTrade(offerer,  proposition , trick , gainType ) == true){


							if(thinker == offerer){

									
							   if(proposition.offererScore > bestProposition.thinkerScore){
   
   
								   bestProposition.proposition = proposition;
   
								   bestProposition.thinkerScore = proposition.offererScore;
   
   
   
							   }
   
   
   
							 } else {
   
										  
								if(proposition.answererScore > bestProposition.thinkerScore){
   
								   bestProposition.proposition = proposition;
   
								   bestProposition.thinkerScore = proposition.answererScore;
   
   
							   }
   
						   }
					
					  }				

				  }




				  if(offerMortgagesToClose.length != 0){

				      	 for(var n=0; n < offerMortgagesToClose.length ; n++){

					     	reverseMortgageClosing(offerMortgagesToClose[n]);

						} 

					   offerMortgagesToClose = [];

				  }
				
	        }

	  }
   }

	

////console.log('now, here is the proposition list : ' + propositionList);
   
//FUNCTION END


	//add elements requested back to the answerer


    //If we asked the other player to close mortgages, reverse the closing
		
		if (cpaofferMortgagesToClose.length != 0){  

			for(var n=0; n < cpaofferMortgagesToClose.length ; n++){

			  reverseMortgageClosing(cpaofferMortgagesToClose[n]);

		    } 


         }










	if(gainType == indirectGain){

		addElementsToPlayer(answerer, counterPartAsked.array);
		
	     search++;
     	////console.log(('AI is done thinking' + search));

	 }


	




 return bestProposition;

}


function createTradeObject( type , offerer, answerer, tradeArray ){

	//tradeArray => (offer) [rueDeCourcelles, avenueDeLaRepublique]


    let lossValueForTheOwner = 0 ;
    let gainValueForTheOtherPlayer = 0;
    let tradeObject;
    let owner;
	let otherPlayer;


    if(type == offerObject){
	  
   	  tradeObject = new Offer( explodeSet(tradeArray), lossValueForTheOwner, gainValueForTheOtherPlayer);
	  owner = offerer;
	  otherPlayer = answerer;

    } else {

  	  tradeObject = new CounterPartAsked( explodeSet(tradeArray), lossValueForTheOwner, gainValueForTheOtherPlayer);
	  owner = answerer;
	  otherPlayer = offerer;

	}
	
	

	  for(var tradeSetIndex = 0; tradeSetIndex < tradeArray.length ; tradeSetIndex++){
	
 	       //LOSS VALUE FOR THE OFFERER
 
		  tradeObject.lossValueForTheOwner += getArrayLossValueForPlayer(owner, tradeArray[tradeSetIndex]);

	      //GAIN VALUE FOR THE OTHER PLAYER

		  tradeObject.gainValueForTheOtherPlayer += getArrayGainValueForPlayer(otherPlayer,tradeArray[tradeSetIndex]);



		  //COMPUTE THE MORTGAGE VALUE



		  for(var i=0; i < tradeArray[tradeSetIndex].length ; i++){

			
			if(tradeArray[tradeSetIndex][i].mortgaged == true ){

	           //GAIN VALUE FOR THE OTHER PLAYER

		        tradeObject.gainValueForTheOtherPlayer -= (tradeArray[tradeSetIndex][i].mortgageValue * 3);

			}

		  }




       }
	  
	 //FOR EACH SET (KNOWING THAT ELEMENTS MIGHT BE OF DIFFERENT TYPES, AND THAT ELEMENT VALUE NEED TO BE CALCULATED PER TYPE)
 
	 ////console.log('total gain=>' + tradeObject.gainValueForTheOtherPlayer);

     return tradeObject;
}



function getArrayGainValueForPlayer(player, array){

	 let color = array[0].color;
	 let currentSet = player.propertiesByColor[color.index].properties;
     let currentSetValue = calculateSetValue(currentSet);

	  //THEN, CREATE A COPY OF THIS ARRAY, AND PUSH IT THE NEW ELEMENTS. THEN, RECALCULATE THE VALUE.
	  //THEN, ALL WE NEED TO DO IS SUBSTRACT THE NEWVALUE FROM THE OLD ONE.

	 let newSet = createPostGainsSet(currentSet, array);
	 let newSetValue = calculateSetValue(newSet);



	  return (newSetValue - currentSetValue);
	  
 }


function getArrayLossValueForPlayer(player, array){

	let color = array[0].color;

	//calculate the current set value
   	let currentSet = player.propertiesByColor[color.index].properties;

   //calculate the set value after the loss

	let currentSetValue = calculateSetValue(currentSet);
	let newSet = createPostLossSet(currentSet,array);
	let newSetValue = calculateSetValue(newSet);


	return (newSetValue - currentSetValue);
}




function profitableTrade(thinker, proposition , trick , gainType){

 
	let offer = proposition.offer;
	let counterPartAsked = proposition.counterPartAsked;
	let offerer = proposition.offerer;
	let answerer = proposition.answerer;
	let offererScore = 0;
	let answererScore = 0;
	let minimumThinkerGain;
	let apparentScore = 0;
	

	offererScore += counterPartAsked.gainValueForTheOtherPlayer;
	offererScore -= offer.lossValueForTheOwner;
	offererScore -= offer.cash;

	if(trick == false){
		
			answererScore -= counterPartAsked.lossValueForTheOwner;


	} else {

		//AI TRIES TO TRICK THE OPPONENT

		let gainedSets = divideArrayInSets(counterPartAsked.array);

		for(var i=0; i < gainedSets.length; i++){

			apparentScore += getArrayGainValueForPlayer(offerer, gainedSets[i]);
			apparentScore += counterPartAsked.cash;

			answererScore -= getArrayLossValueForPlayer(answerer, gainedSets[i]);

		}
				
	}

	offererScore += counterPartAsked.cash;
	answererScore -= counterPartAsked.cash;
	answererScore += offer.gainValueForTheOtherPlayer;
	answererScore += offer.cash;

   
	//SITUATION FRAGILITY (INFLUENCING CASH VALUE)

	let tradingPlayers = [offerer, answerer];




	 proposition.offererScore = offererScore;

	 proposition.answererScore = answererScore;
	




	let thinkerScore;
	let interlocutorScore;


	//WHATS THE STATUS OF THE AI TRIGGERING THIS FUNCTION IN THIS TRADE?


	if(thinker == offerer ){

	   thinkerScore = offererScore;
	   thinkerLoss =  offer.lossValueForTheOwner;
	   interlocutorScore = answererScore;


	} else {	 


	   thinkerScore = answererScore;
	   thinkerLoss =  counterPartAsked.lossValueForTheOwner;
	   interlocutorScore = offererScore;

	}

	//BEHAVIOUR OF THE AI



	if(trick == true){

		thinkerScore = apparentScore;

	}






	
	if(counterPartAsked.array.length == 3){

	   if(offer.array.length == 3){


		   console.log("-----------------------MONOPOLY TRADE");

		   console.log(proposition);

		   console.log('thinker score=>' + thinkerScore)

		   console.log('other player score=>' + interlocutorScore)



	   }

   }


   minimumThinkerGain = (-thinkerLoss * 4);


	 
   if(thinker == offerer &&  trick == true && counterPartAsked.indirectMonopOpportunity != none ){

	minimumThinkerGain = 0;

   }


		 

	 if(thinkerScore >  minimumThinkerGain){


		//determine a certain range

		//IF THINKERSCORE IS higher than otherplayer score * (entre 0.90 et 1.20)

			 //AI BEHAVIOUR
			 

			 let topLimit;

			 let bottomLimit;


			 if(thinker == ai1){

				//top limit : value between 1 and 1.5
		   
			   topLimit =  interlocutorScore * (1 + (Math.random()/2));
			   
				//THE AI1 wants to have a better situation than the other player

			   bottomLimit = interlocutorScore * ((Math.random()/5) + 0.6);

			   
			  } else{

		    	//top limit : value between 1 and 1.33

			   //bottom limit : value between 0.8 AND 1.1

			   topLimit =  interlocutorScore * (1 + (Math.random()/2));
			   
			   //THE AI1 wants to have a better situation than the other player

			  bottomLimit = interlocutorScore * ((Math.random()/5) + 0.6);

				  
			  }

	
			   

		   if(thinker == offerer){	


				//THE BENEFIT TO THE OFFER HAS TO BE HIGHER THAN A CERTAIN LIMIT, BUT SMALLER THAN A CERTAIN VALUE (NOT TO RISK REFUSAL)
			   
			   
			   if (bottomLimit < thinkerScore && thinkerScore < topLimit ){
					  profitableProposition = true;

			   } else{
					   profitableProposition = false;
			   }

			   
		   } else {
							   
			   if (bottomLimit < thinkerScore ){

				   profitableProposition = true;

			   } else{

				  profitableProposition = false;

			   }

		}



		   if (profitableProposition == true ){	
			   

			  if(gainType == indirectGain){

				if(answerer == humanPlayer){

	

				 //alert("cette proposition est raisonnable (thinker: " + thinker.name + ')');
				 //alert('the thinker perceived a value of ' + thinkerScore );
				 //alert('the other player perceived a value of ' + interlocutorScore );
				 //alert('here is the offer : ');
 
 
				for(var i=0; i < offer.array.length; i++){	
					 //alert('offer element ' + i + ' ' + offer.array[i].name);
				}
 
					//alert('and, here is the cash in the offer :' + offer.cash);				
					//alert('here is the counterpart : ');
 
 
				for (var i=0; i < counterPartAsked.array.length; i++){
					
				   //alert('counterpart asked ' + i + ' ' + counterPartAsked.array[i].name);
				   
				}


			  }
			
			}

				return true;


			} else {	


				if(gainType == indirectGain){


					if(answerer == humanPlayer){

						//alert("cette proposition n'est pas raisonnable (thinker: " + thinker.name + ')');

						//alert('the thinker perceived a value of ' + thinkerScore );
						//alert('the other player perceived a value of ' + interlocutorScore );
	  
						//alert('here is the offer : ');
	  
	  
						for(var i=0; i < offer.array.length; i++){	
							 //alert('offer element ' + i + ' ' + offer.array[i].name);
					   }
	  
						 //alert('and, here is the cash in the offer :' + offer.cash);				
						 //alert('here is the counterpart : ');
	  
	  
					 for(var i=0; i < counterPartAsked.array.length; i++){
						 
						//alert('counterpart asked ' + i + ' ' + counterPartAsked.array[i].name);
						
					 }



					}



					
			


		}

			


				 //console.log('and, here is the cash asked :' + counterPartAsked.cash);



				 return false;


		
			//IF NEGATIVE THINKERSCORE, IMMEDIATLY RETURN FALSE

		   } 


		} else {

			if(gainType == indirectGain){

							
			//alert("cette proposition n'est pas raisonnable (thinker: " + thinker.name + ')');

			//alert('the thinker perceived a value of ' + thinkerScore );
			//alert('the other player perceived a value of ' + interlocutorScore );

			//alert('here is the offer : ');

			

			for(var i=0; i < offer.array.length; i++){	
				//alert('offer element ' + i + ' ' + offer.array[i].name);
		  }

			//alert('and, here is the cash in the offer :' + offer.cash);				
			//alert('here is the counterpart : ');


	    	for(var i=0; i < counterPartAsked.array.length; i++){
			
		     //alert('counterpart asked ' + i + ' ' + counterPartAsked.array[i].name);
		     
	  	  }



			}
				
		


	
		   return false;


	 }



//RETURN THE PROFITABILITY, WITH THE POINT OF VIEW OF A PLAYER A




}







function processPropositionAndAnswer(offerer, answerer, proposition){


	//IF THE TRADE IS PROFITABLE (IF THE AI IS P18) P18ChecksProfitableTrade(){ } , B45 checks Profitable trade

	//IF THE PROPOSITION IS PROFITABLE , ACCEPT THE OFFER.

	//MEANING : ELEMENTS ARE ADDED AND REMOVED FROM BOTH PLAYERS ARRAYS



}






function clearInBuildingProposition(){


	user.inBuildingProposition = none;


}



function explodeSet(set){

	let explodedSet = [];

	//set => [ [rueDeCourcelles, rueDeLaPaix ] , [ avenueHenriMartin, BdMalesherbes] ];


	 for(var i=0; i < set.length; i++){

		  for(var y=0 ; y < set[i].length; y++){

			explodedSet.push(set[i][y]);
			
		  }
	 }
	 


	return explodedSet;

}


function createIndirectTradeObject(type , offerer, answerer, tradeArray){

		//this function creates a trade object, with owner losses, and other player gain.
		
       //return => indirectMonopoly = false , gainValue = //arrayGainValue 

 	 let tradeObject;
	 let owner;
	 let otherPlayer;
	   

	 if(type == offerObject){

		tradeObject = new Offer( explodeSet(tradeArray), 0, 0);
	    owner = offerer;
		otherPlayer = answerer;
		
   } else {

	   tradeObject = new CounterPartAsked( explodeSet(tradeArray), 0 , 0);
  	   owner = answerer;
	   otherPlayer = offerer;

   }

   
   
	   //ownerLoss

	   for(var tradeSetIndex = 0 ; tradeSetIndex < tradeArray.length ; tradeSetIndex++){

		  let staticLoss = getArrayLossValueForPlayer(owner , tradeArray[tradeSetIndex]);

		  let staticGain = getArrayGainValueForPlayer(otherPlayer , tradeArray[tradeSetIndex]);


		   tradeObject.lossValueForTheOwner += staticLoss;
		   tradeObject.gainValueForTheOtherPlayer += staticGain;


			  //if an element brings a direct monopoly, break there.

		
  
			  if(monopolyGain(otherPlayer, [tradeArray[tradeSetIndex]]) == true){

				console.log('direct monopoly detected!! full set =>' + staticGain);

			
				continue;


			  }


		   let set = getSetValueAtDepth2(otherPlayer, owner, tradeArray[tradeSetIndex]);
				
			
		   if(set.monopolyOpportunity == false){
 
			//nothing
 
    		} else {


				tradeObject.gainValueForTheOtherPlayer -= staticGain;

				tradeObject.indirectMonopOpportunity = set.proposition;
 
		    	//compute a synergetic cost for the player loosing the array 
			
			   //Simply so that the offerer would rather propose an offer without synergetic cost , and a player (0.75) will prefer a direct monop exchange.
				 
			    tradeObject.lossValueForTheOwner += (0.25 * set.gainValue);

			    tradeObject.gainValueForTheOtherPlayer += (0.75 * set.gainValue);

		}
	
	}

	//handle collision => if two element receive the same monopoly, only select the better gain


	return tradeObject;

}






function getSetValueAtDepth2(playerA , playerB , array){

	

	let obj = { monopolyOpportunity: false , gainValue: 0 , proposition: none };

	let nonTradingPlayers = getNonTradingPlayersArray(playerA, playerB);

	let offeredElements = [];


	for(var i=0; i < nonTradingPlayers.length ; i++){




			let newSet = getNewSet(playerA.propertiesByColor[array[i].color.index].properties, array);
			  
		    let lossValueForTheOwner = calculateSetValue(newSet); 
		 
		    let gainValueForTheOtherPlayer = getArrayGainValueForPlayer(nonTradingPlayers[i] , newSet);
		
	 	    let counterPartAsked = new CounterPartAsked(newSet , lossValueForTheOwner, gainValueForTheOtherPlayer );
			 
		    let propositionMaterial = new PropositionMaterial(nonTradingPlayers[i] , playerA, counterPartAsked );

		   //Whats the biggest offer (so, direct gain for the answerer ) , a nonTradingPlayer could do.

		   
			  


			let bestProposition = tryToCreateProposition(playerA, directGain, propositionMaterial);

			


		   //for each proposition :
   
		   if(bestProposition.proposition != none){

		     	if(monopolyGain(playerA, divideArrayInSets(bestProposition.proposition.offer.array)) == true){ 
					 
					
					
					removeElementsFromPlayer(nonTradingPlayers[i], bestProposition.proposition.offer.array);

					offeredElements.push({player: nonTradingPlayers[i], elements: bestProposition.proposition.offer.array});
				  
				 
				
					obj.gainValue = bestProposition.proposition.answererScore ;

					obj.proposition = bestProposition.proposition;

					obj.monopolyOpportunity = true;


					

			   }

		   }		
  
	 }


	   
	 if(offeredElements.length != 0){
    
		for(var i=0; i < offeredElements.length ; i++){
			addElementsToPlayer(offeredElements[i].player, offeredElements[i].elements);
		}
   
   
	 }



		return obj;
		 

}







function getNewSet(arrayA , arrayB){

	   let newArray = arrayA.slice(0);
	   
	    for(var i=0; i < arrayB.length; i++){
			newArray.push(arrayB[i]);
		}

		return newArray;
}




function monopolyGain(player, sets){
        

  for(var setIndex = 0 ; setIndex < sets.length ; setIndex++ ) {


	let set = sets[setIndex];		
	let color = set[0].color;
	let propertiesType = set[0].type;
	let playerSet = player.propertiesByColor[color.index].properties;
 

    if(propertiesType == rentalProperty){


  	  if(color == darkBlue || color == brown){

	      if(playerSet.length != 2){

			if((playerSet.length + set.length) == 2){

				//console.log('---------------------------------------new monopoly!!');


				return true;

		 	}

		}

      } else {

		
	    if(playerSet.length != 3){


			if((playerSet.length + set.length) == 3){


				//console.log('------------------------------------------------------new monopoly!!');

				return true;

			

			}

		}
	
      }

    }

  }


  return false;

  
}



var elementsRemoved = 0;


function removeElementsFromPlayer(player, elementsArray){

	
	for(var i=0; i < elementsArray.length ; i++){


		////console.log('cp element ==> ' + counterPartAsked.array[i].name);


		  //delete the element

		let elementColor =  elementsArray[i].color;


		 for(var y=0; y < player.propertiesByColor[elementColor.index].properties.length; y++){


			  if(player.propertiesByColor[elementColor.index].properties[y] == elementsArray[i] ) {

				 ////console.log('element deleted');

				  player.propertiesByColor[elementColor.index].properties.splice(y,1);
				  
				  

	            elementsRemoved++;


			  }

		 }
		
	}



}


var elementsAdded = 0;

function addElementsToPlayer(player, array){

	
	for(var i=0; i < array.length ; i++){

		
		let elementColor = array[i].color;


		////console.log('element added back at color ' + elementColor.name);

		player.propertiesByColor[elementColor.index].properties.push(array[i]);

		

	  elementsAdded++;



	}









    
}






function refundableMortgageBeforeOffer(player, element){


	if(player.cash >= (element.mortgageValue * 1.5)){


		return true;


	} else {


		return false;
	}




}