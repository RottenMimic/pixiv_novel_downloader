//locale
var arr=['page_title','aozora','plain','title','author','caption','datetime','tags','url','content_aozora','content_plain_text','content_raw','help']
var tx, advance_tx, simple_tx, response_tx;
for(var i=0;i<arr.length;i++){
	tx=chrome.i18n.getMessage(arr[i]);
	if(tx.length>0){
		document.getElementById(arr[i]).textContent=chrome.i18n.getMessage(arr[i]);
	}
}
document.getElementById('save').value=chrome.i18n.getMessage('save');
advance_tx=chrome.i18n.getMessage('advance_button');
simple_tx=chrome.i18n.getMessage('simple_button');
response_tx=chrome.i18n.getMessage('response_tx');


var temp_obj=document.getElementById("temp_text");
var default_aozora=['[title]','[author]','','★[tags]','','[content_aozora]','','[datetime]','[url]'].join('\n');
var default_plain=['[title]','[author]','','★[tags]','','[content_plain_text]','','[datetime]','[url]'].join('\n');

function releaseCheck(){
	var obj=document.getElementsByName("novel_type");
	obj[0].checked=false;
	obj[1].checked=false;
}

//insert text in template
function insertText(tx){
	tx="["+tx+"]";
	if (temp_obj.selectionStart || temp_obj.selectionStart == '0') {
		var startPos = temp_obj.selectionStart;
		var endPos = temp_obj.selectionEnd;
		
		temp_obj.value = temp_obj.value.slice(0, startPos)+tx+temp_obj.value.slice(endPos);
		
		temp_obj.selectionStart=startPos+tx.length;
		temp_obj.selectionEnd=temp_obj.selectionStart;
	} else {
		temp_obj.value += tx;
	}
	releaseCheck();
}

var spans=document.getElementsByTagName('span');
for(var i=0;i<spans.length;i++){
	spans[i].addEventListener("click",function(){
		insertText(this.id);
	});
}

var labels=document.getElementsByTagName('label');
labels[0].addEventListener("click",function(){
	temp_obj.value=default_aozora;
});
labels[1].addEventListener("click",function(){
	temp_obj.value=default_plain;
});

//get storage
function show_hide_section(bol){
	document.getElementById("section_simple").style.display=bol?'block':'none';
	document.getElementById("section_advance").style.display=bol?'none':'block';
	document.getElementById("advance_button").textContent=bol? '> '+advance_tx+' <' : '< '+simple_tx+' >';
}

chrome.storage.sync.get(
	{
		temp_text: default_aozora
	}, function(items) {
		var tx=items.temp_text;
		tx=tx.replace(/\r/g,'');
		temp_obj.value=tx;
		//section show/hide
		if(temp_obj.value==default_aozora){
			show_hide_section(true);
		}else if(temp_obj.value==default_plain){
			show_hide_section(true);
			document.getElementsByName('novel_type')[1].checked=true;
		}else{
			show_hide_section(false);
			releaseCheck();
		}
	}
);

//save storage
document.getElementById("save").addEventListener("click", function(){
	chrome.storage.sync.set({
		temp_text: temp_obj.value
	},function(){
		var response=document.getElementById('response');
		response.textContent = response_tx;
		setTimeout(function(){
			response.innerHTML="&nbsp;";
		},750);
	});
});

//section show/hide
document.getElementById("advance_button").addEventListener("click", function(){
	show_hide_section(document.getElementById("section_simple").style.display=='none');
});

temp_obj.addEventListener("input",releaseCheck);