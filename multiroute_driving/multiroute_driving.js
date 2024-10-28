ymaps.ready(init);
var k1=55.154;
var k2=61.4291;
var bk1, bk2, toc_n=0;
var mass_toc=[];
window.onload = function() {
document.getElementById('f2').style.display="none";
document.getElementById('f3').style.display="none";
};

function init () {
    var myMap = new ymaps.Map("map", {
            center: [k1, k2],
            zoom: 13,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        });
	
	var multiRoute = new ymaps.multiRouter.MultiRoute({
    // Описание опорных точек мультимаршрута.
    referencePoints: [
        [k1, k2],
        [k1+0.003, k2+0.003]
    ],	
    // Параметры маршрутизации.
    params: {
        // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
        results: 1,
		routingMode: "auto" 
        }
    });
	multiRoute.editor.start();
	myMap.geoObjects.add(multiRoute);

	multiRoute.model.events
						.add('requestsuccess', function() {
							var activeRoute = multiRoute.getActiveRoute();
							document.getElementById('time').value=activeRoute.properties.get("duration").text;
							})
						.add("requestchange", function (event) {
							document.getElementById('k1').value=event.originalEvent.referencePoints[0][0];
							document.getElementById('k2').value=event.originalEvent.referencePoints[0][1];
							k1=event.originalEvent.referencePoints[0][0];
							k2=event.originalEvent.referencePoints[0][1];
							bk1=event.originalEvent.referencePoints[1][0];
							bk2=event.originalEvent.referencePoints[1][1];
							});
    var but = document.getElementById('centr');
    //вешаем на него событие
    but.onclick = function() {
	k1=document.getElementById('k1').value;
	k2=document.getElementById('k2').value;
	myMap.setCenter([k1,k2]);
	document.getElementById('f1').style.display='none';
	document.getElementById('f2').style.display='block';
    
	multiRoute.model.setReferencePoints([[k1,k2],[k1,k2]]);
	var trans=document.getElementById('trans').value
	multiRoute.model.setParams({routingMode: trans,results: 1});
	}
	
	var but2 = document.getElementById('toc');
	but2.onclick = function() {
	mass_toc.push([bk1,bk2]);
	toc_n=toc_n+1;
	document.getElementById('toc_n').value=toc_n;
	}
	
	var but3 = document.getElementById('postr');
	but3.onclick = function() {
	document.getElementById('f2').style.display='none';
	document.getElementById('f3').style.display='block';
	var polygon = new ymaps.Polygon([mass_toc]);
	myMap.geoObjects.add(polygon);
	myMap.geoObjects.remove(multiRoute);
	    var myCircle = new ymaps.Circle([
            // Координаты центра круга.
            [k1,k2],
            // Радиус круга в метрах.
            document.getElementById('okr').value
        ], {}, {
            // Задаем опции круга.
            // Цвет заливки.
            fillColor: "#DB709377",
            // Цвет обводки.
            //strokeColor: "#990066",
            // Прозрачность обводки.
            strokeOpacity: 0.8,
            // Ширина обводки в пикселях.
            strokeWidth: 0
			
        });
	
	    // Добавляем круг на карту.
    myMap.geoObjects.add(myCircle);
	
	var min_k1_okr, min_k2_okr, max_k1_okr, max_k2_okr;
	max_k1_okr=k1;
	var prov_flag=true;
	while(prov_flag){
		max_k1_okr=Number(max_k1_okr)+0.0014;//0.0012;
		if(!(myCircle.geometry.contains([max_k1_okr,k2]))){prov_flag=false;}//max_k1_okr=Number(max_k1_okr)-0.0018/*0.0012*/; 
	}		
	min_k1_okr=k1;
	var prov_flag=true;
	while(prov_flag){
		min_k1_okr=Number(min_k1_okr)-0.0014;//0.0012;
		if(!(myCircle.geometry.contains([min_k1_okr,k2]))){prov_flag=false;}//min_k1_okr=Number(min_k1_okr)+0.0018/*0.0012*/; 
	}	
	max_k2_okr=k2;
	var prov_flag=true;
	while(prov_flag){
		max_k2_okr=Number(max_k2_okr)+0.002;//0.0015;
		if(!(myCircle.geometry.contains([k1,max_k2_okr]))){prov_flag=false;}//max_k2_okr=Number(max_k2_okr)-0.002/*0.0015*/; 
	}	
	min_k2_okr=k2;
	var prov_flag=true;
	while(prov_flag){
		min_k2_okr=Number(min_k2_okr)-0.002;//0.0015;
		if(!(myCircle.geometry.contains([k1,min_k2_okr]))){prov_flag=false;}//min_k2_okr=Number(min_k2_okr)+0.002/*0.0015*/; 
	}
	mass_toc.push([max_k1_okr,max_k2_okr]);
	mass_toc.push([min_k1_okr,min_k2_okr]);
	console.log(mass_toc);
	var min_k1_toc, min_k2_toc, max_k1_toc, max_k2_toc, k1_toc_n, k2_toc_n;
	min_k1_toc=mass_toc[0][0];
	min_k2_toc=mass_toc[0][1];
	max_k1_toc=mass_toc[0][0];
	max_k2_toc=mass_toc[0][1];
	for(var i=0;i<mass_toc.length;i++){
		if(mass_toc[i][0]<min_k1_toc){min_k1_toc=mass_toc[i][0];}
		if(mass_toc[i][1]<min_k2_toc){min_k2_toc=mass_toc[i][1];}
		if(mass_toc[i][0]>max_k1_toc){max_k1_toc=mass_toc[i][0];}
		if(mass_toc[i][1]>max_k2_toc){max_k2_toc=mass_toc[i][1];}
	}
	
	k1_toc_n=parseInt((max_k1_toc-min_k1_toc)/0.0014);//0.0012);
	k2_toc_n=parseInt((max_k2_toc-min_k2_toc)/0.002);//0.0015);

	var xk1=max_k1_toc;
	var xk2=max_k2_toc;
	var xk1_st=max_k1_toc;
	var mass_poli=[];
	for(i=1;i<=k2_toc_n;i++){  
	if(polygon.geometry.contains([xk1,xk2]) || myCircle.geometry.contains([xk1,xk2])){
		//var myPlacemark2 = new ymaps.Placemark([xk1, xk2], {}, {preset: 'islands#greenCircleDotIcon'});
		//myMap.geoObjects.add(myPlacemark2);
		mass_poli.push[xk1,xk2];
		}
	for(j=1;j<=k1_toc_n;j++){
		xk1=xk1-0.0014;//0.0012;
			if(polygon.geometry.contains([xk1,xk2]) || myCircle.geometry.contains([xk1,xk2])){
			//var myPlacemark2 = new ymaps.Placemark([xk1, xk2], {}, {preset: 'islands#greenCircleDotIcon'});
			//myMap.geoObjects.add(myPlacemark2);
			mass_poli.push([xk1,xk2]);
			}}
	
	xk2=xk2-0.002;//0.0015;
	xk1=xk1_st;
	}

	var mg_poli;
	var ms_poli;
	var coor_poli=[];
	var adr_poli=[];
	var a_poli=[]
	var akkum_poli=[];
	var akkum_adr_poli=[];
	var flag_poli=false;
	var k_poli=mass_poli.length-1;
	while(k_poli>0){
    mg_poli=ymaps.geocode([mass_poli[k_poli][0], mass_poli[k_poli][1]], {kind: 'house'});
	mg_poli.then(function(res){
		ms_poli=res.geoObjects._collectionComponent._baseArrayComponent._children;
		var m_poli=0;
		while(m_poli<ms_poli.length){
		coor_poli.push(ms_poli[m_poli].geometry._coordinates);
		adr_poli.push(ms_poli[m_poli]._geoObjectComponent._properties._data.name);
		m_poli=m_poli+1;
	}
	})
	k_poli=k_poli-1;	
	};
	var delay;
	if(Number(document.getElementById('okr').value)==5000){delay=180000;}else{delay=60000;}
setTimeout(() => {var i=0;
	console.log(coor_poli.length);
	var l_poli=0;
	while(l_poli<coor_poli.length){
		var j=0;
		while(j<akkum_poli.length){
			if(coor_poli[l_poli][0]==akkum_poli[j][0] && coor_poli[l_poli][1]==akkum_poli[j][1]){
				flag_poli=true;
			}
		j=j+1;
		}
		if(flag_poli==false){
			akkum_poli.push(coor_poli[l_poli]);
			akkum_adr_poli.push(adr_poli[l_poli]);
		}else{flag_poli=false}
	l_poli=l_poli+1;	
	}
if(akkum_poli.length>0){
console.log(akkum_poli.length);
var met_poli=0;
var met_okr=0;
while(i<akkum_poli.length){
if(polygon.geometry.contains([akkum_poli[i][0],akkum_poli[i][1]])){
//var myPlacemark2 = new ymaps.Placemark([akkum_poli[i][0],akkum_poli[i][1]], {balloonContent:akkum_adr_poli[i]}, {preset: 'islands#blueCircleDotIcon'});
//myMap.geoObjects.add(myPlacemark2);
met_poli=met_poli+1;}
if(myCircle.geometry.contains([akkum_poli[i][0],akkum_poli[i][1]])){
//var myPlacemark2 = new ymaps.Placemark([akkum_poli[i][0],akkum_poli[i][1]], {balloonContent:akkum_adr_poli[i]}, {preset: 'islands#redCircleDotIcon'});
//myMap.geoObjects.add(myPlacemark2);
met_okr=met_okr+1;}
i=i+1;
}
document.getElementById('house_poli').value=met_poli;
document.getElementById('house_okr').value=met_okr;

var myPlacemark = new ymaps.Placemark([k1,k2], {
    data: [
        { weight: met_poli, color: '#FFA002' },
        { weight: met_okr, color: '#880011' }
    ],
    balloonContent: 'Результаты:</br>'+
        'оранжевый – количество домов в полигоне, ' +
        'красный – количество домов в окружности',
    // Подпись к диаграмме.
    iconCaption: met_poli+' домов в полигоне '+met_okr+' в окружности',
    // Оставляем центр диаграммы пустым.
    iconContent: met_okr+met_poli
}, {
    // Устанавливаем для значка метки
    // макет диаграммы.
    iconLayout: 'default#pieChart',
    // Радиус диаграммы.
    iconPieChartRadius: 25,
    // Радиус центрального сектора диаграммы.
    iconPieChartCoreRadius: 15
});

myMap.geoObjects.add(myPlacemark);
}

}, delay);
		
	
}

}



