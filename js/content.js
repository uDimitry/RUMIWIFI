(function () {
	//Функция замены текста
	$myfn = function(target, result, selector) {
		var object = $(selector+":contains("+target+")");
		if (object.text()) {
			text = object.html();
			text = text.replace(target, result);
			object.html(text);
		}
	}
	
	//Функция ожидания переменной
	function check(val) {
		if (!val) {
			return setTimeout(check, 1000);
		}
	}
		
	good = 0;
	
	domain = location.host;
	if (domain == "miwifi.com") good = 1;
	title = $(document).find("title").text();
	if (title == "小米路由器") good = 2;
	if ($("#wechatcode").text() == "官方微信") good = 3;
	if ($(".flash-tips h3").text() == "正在升级中") good = 4;
	if ($("head:contains('miwifi.com')").length > 0) good = 5;

	var langType = "ru";
	var langFile = chrome.extension.getURL("lang/" + langType + ".json");
	var langJson = "";
	$.getJSON(langFile, function(data) { langJson = data; });

	if (good >= 1) {
		//Язык
		chrome.storage.local.get("rumiLang", function(results) {
						
			function translateHtml() {
				$(listOf).each(function() {
					var html = $(this).html();
					$.each(langJson, function (index, value) {
						html = html.replace(index, value);
					});
					$(this).html(html);
				});
			}
			
			if (results.rumiLang && results.rumiLang != langType) {
				langType = results.rumiLang;
				langFile = chrome.extension.getURL("lang/" + langType + ".json");
				$.getJSON(langFile, function(data) { langJson = data; });
			}
			
			//Базовые замены
			translateHtml();

			//Динамические заголовки .panel-content .bd .d-bd, .d-is-open .panel-content .bd .d-bd
			function replaceInterval() {
				var x = 0;
				translateInterval = setInterval(function() {
					if (++x === 4) {
						//Остановка репиттера
						clearInterval(translateInterval);
					}
					translateHtml();
					//Убираем мигание времени
					$("#datetiemval:contains('г')").removeAttr('id');
					$("#routerversion:contains('и')").removeAttr('id');
					$("#routermodel:contains('XIAOMI')").removeAttr('id');
				}, 300);
			}
			
			replaceInterval();
			
			//Если на странице движняк
			$(document).keyup(function (e){
				clearInterval(translateInterval);
				translateHtml();
			});
			
			//Для Мышки
			$(document).click(function() {
				clearInterval(translateInterval);
				translateHtml();
			});
			
			//Делаем фон видимым
			$("#doc").css({"opacity": "1"});		
		});
		
		//Меняем заголовок
		$('title').text('RUMIWIFI');

		//Меняем логотип
		var imgURL = chrome.extension.getURL("img/page_logo.png");
		$('#bd .mod-login .title img').attr( "src", imgURL );
		$('.mod-guide-hd .icons img').attr( "src", imgURL );
		
		//Главная
		$("#password").attr("placeholder", "Пароль маршрутизатора");
		
		$("#wechatcode").attr("href", "//4pda.ru/forum/index.php?showtopic=596689");
		$("a:contains('RUMIWIFI')").attr("href", "//pedanto.com/news/rumiwifi-plagin-rusifikacii-proshivki-xiaomi-routera.html");
		
		//Правка стилей
		$(".mod-set .hd h3").css("width", "auto");
		
	}
	//Контрольный Opacity
	setTimeout (function(){
		$("#doc").css({"opacity": "1"});
	}, 2000);
})()
