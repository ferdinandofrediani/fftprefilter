var preSignals={
	'BESSEL' : require('bessel'),
	'fft' :  require('fft-js').fft,
	'fftUtil' : require('fft-js').util,
	'kaiserP' : function(L,a,i){
	var argSqrt=1-Math.pow((2*i/(L-1)-1),2);
	var radix=a*(Math.sqrt(argSqrt));
	//BESSEL function con ordine 0 entrambe
	var up=this.BESSEL.besseli(radix, 0);
	var down=this.BESSEL.besseli(a, 0);
	var result=up/down;
	return result;
	},
	'padding' : function(arr){
	var L=arr.length;
	var bitWise=0;
	while (L!=0){
	bitWise+=1;
	L=L>>1;
	}
	if(bitWise>0){
	bitWise+=3;//aumento di un bit
	var fine=(Math.pow(2,bitWise))-arr.length;
	for(var j = 0  ; j < fine ;j++){
		arr.push(0);//inserisco il numero di zeri necessari
	}
	return arr;
	}
	else{
		return arr;
		}
	},
	'kaiser': function(LE,alpha){
	var filter=[];
  for(var t = 0; t < LE; t++)
		filter.push(this.kaiserP(LE,alpha,t));
	return filter;
	},
	'meanValSub' : function(arr){
		var mean=0;
		var L=arr.length;
		for(var t = 0; t < L; t++)
			mean+=arr[t];
		mean=mean/L;
		for(var t = 0; t < L; t++)
			arr[t]=arr[t]-mean;
		return arr;
	},
	'singleRowProduct' : function(filterK,arr){
		for(var j = 0 ; j < arr.length ; j++)
			arr[j]=arr[j]*filterK[j];
		return arr;

	},
	'preFFT' : function(arrPre,mean,kaiserOrder){
	var prePad=arrPre;
	if(mean=="noMean")
			prePad=this.meanValSub(arrPre);
	var aftPadAr=this.padding(prePad);
	var filtroKaiser=this.kaiser(aftPadAr.length,kaiserOrder);
	return this.singleRowProduct(filtroKaiser,aftPadAr);
},
	'fourierSSB' : function(arr){
		return this.fftUtil.fftMag(this.fft(arr));
	},
	'fVector' : function(fCamp,L){
			var df=fCamp/(2*(L-1));
			var vecF=[];
			for(var i=0; (i*df) < fCamp ; i++)
				vecF[i]=i*df;
			return vecF;

	}
};
module.exports=preSignals;
