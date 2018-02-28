var raw_novel=document.getElementById("novel_text").textContent;

var title=document.querySelector(".layout-body h1.title").textContent;

//add download button
var click_button=document.createElement('a');
click_button.id='dl_nvl';
click_button.href='#';
click_button.textContent='📥';
document.querySelector(".layout-body h1.title").prepend(click_button);

document.getElementById("dl_nvl").addEventListener("click", myScript);

function myScript(){
	
	var tmp, c1=0, c2=0;
	
	var author=document.querySelector(".author").textContent;
	tmp=document.querySelector('.caption');
	var caption='';
	if(tmp){
		caption=tmp.innerHTML.replace(/<br>/g,'\r\n');
		tmp=document.createElement('p');
		tmp.innerHTML=caption;
		caption=tmp.textContent;
	}
	var tags=document.querySelector(".tags").textContent.replace(/\*/g, "").replace(/c/g, " ");
	var url=window.location.href;;
	var datetime=document.querySelectorAll(".meta li")[0].textContent;
	
	//format content
	var content=raw_novel;
	tmp='';
	content=content.replace(/\n/g,'\r\n');
	content=content.replace(/\r\r/g,'\r');
	
	//chapter
	while(true){
		c1=content.indexOf('[chapter:');
		if(c1<0 || c1>content.length){break;}
		c2=content.indexOf(']',c1);
		if(c2<0){break;}
		tmp=content.slice(c1+9,c2);
			
		content=[content.slice(0,c1),tmp,'［＃「',tmp,'」は中見出し］',content.slice(c2+1)].join('');
	}
	
	//ruby
	while(true){
		c1=content.indexOf('[[rb:');
		if(c1<0 || c1>content.length){break;}
		c2=content.indexOf(']]',c1);
		if(c2<0){break;}
		tmp=content.slice(c1+5,c2);
		tmp=tmp.replace(' > ','《')+'》';
		content=[content.slice(0,c1),tmp,content.slice(c2+2)].join('');
	}
	
	//new page
	while(true){
		if(content.indexOf('[newpage]')<0){break;}
		content=content.replace('[newpage]', '［＃改ページ］');
	}

	//template
	var total_tx=[title, author,'', caption, '', "★ "+tags, '', content, '', datetime, url].join('\r\n');
	
	//download
	tmp = document.createElement('a');
	tmp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(total_tx));
	tmp.setAttribute('download', title+'.txt');
	tmp.style.display = 'none';
	document.body.appendChild(tmp);
	tmp.click();
	document.body.removeChild(tmp);
	
	//click good button
	tmp=document.querySelector('.rated');
	if(!tmp){
		tmp=document.querySelector('._nice-button');
		if(tmp){tmp.click();}
	}
	
	return false;}
