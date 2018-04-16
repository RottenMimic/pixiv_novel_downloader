var raw_novel=document.getElementById("novel_text").textContent;
var raw_template='';
var title=document.querySelector(".layout-body h1.title").textContent;
var default_template=['[title]','[author]','','[caption]','','★[tags]','','[content_aozora]','','[datetime]','[url]'].join('\n');

//add download button
var click_button=document.createElement('a');
click_button.id='dl_nvl';
click_button.href='#';
click_button.textContent='📥';
document.querySelector(".layout-body h1.title").prepend(click_button);

//load template & set event
chrome.storage.sync.get(
	{
		temp_text: default_template
	}, function(items) {
		raw_template=items.temp_text;
		document.getElementById("dl_nvl").addEventListener("click", myScript);
	}
);

function myScript(){ 
		var tmp;
		var tmp_tx=raw_template;
		
		//***get information***
		var novel_dic={};
		novel_dic['title']=title;
		novel_dic['author']=document.querySelector(".author").textContent;
		tmp=document.querySelector('.caption');
		novel_dic['caption']='';
		if(tmp){
			novel_dic['caption']=tmp.innerHTML.replace(/<br>/g,'\n');
			tmp=document.createElement('p');
			tmp.innerHTML=novel_dic['caption'];
			novel_dic['caption']=tmp.textContent;
		}
		tmp=document.querySelectorAll(".tags .text");
		novel_dic['tags']=''
		for(var i=0;i<tmp.length;i++){
			novel_dic['tags']+=tmp[i].textContent+' ';
		}
		novel_dic['tags']=novel_dic['tags'].trim();
		novel_dic['url']=window.location.href;
		novel_dic['datetime']=document.querySelectorAll(".meta li")[0].textContent;
		
		//***format content***
		var content;
		var slice_tx=function(tx,s1,s2){
			var c1=0,c2=0;
			c1=tx.indexOf(s1);
			if(c1<0 || c1>tx.length){return false;}
			c2=tx.indexOf(s2,c1);
			if(c2<0){return false;}
			
			return [tx.slice(0,c1),tx.slice(c1+s1.length,c2),tx.slice(c2+s2.length)];
		}
		var remove_format=function(s1,s2,exp=null){
			var arr=[];
			while(true){
				arr=slice_tx(content,s1,s2);
				if(arr==false){break;}
				
				if(exp){
					content=arr[0] + exp(arr[1]) + arr[2];
				}else{
					content=arr[0] + arr[2];
				}
			}
		}
		//aozora
		if(tmp_tx.indexOf('[content_aozora]')>=0){
			content=raw_novel;
			//new page
			while(content.indexOf('[newpage]')>=0){
				content=content.replace('[newpage]', '［＃改ページ］');
			}
			//pixivimage
			remove_format('[pixivimage:',']');
			//jump
			remove_format('[jump:',']');
			//jumpuri
			remove_format('[[jumpuri:',']]',function(tx){
				return tx.split('>')[0];
			});
			//chapter
			remove_format('[chapter:',']',function(tx){
				return tx + '［＃「' + tx + '」は中見出し］';
			});
			//ruby
			remove_format('[[rb:',']]',function(tx){
				return tx.replace(' > ','《')+'》';
			});
			novel_dic['content_aozora']=content;
		}
		//plain text
		if(tmp_tx.indexOf('[content_plain_text]')>=0){
			content=raw_novel;
			//new page
			while(content.indexOf('[newpage]')>=0){
				content=content.replace('[newpage]', '\r\n\r\n\r\n');
			}
			//pixivimage
			remove_format('[pixivimage:',']');
			//jump
			remove_format('[jump:',']');
			//jumpuri
			remove_format('[[jumpuri:',']]',function(tx){
				return tx.split('>')[0];
			});
			//chapter
			remove_format('[chapter:',']',function(tx){
				return tx;
			});
			//ruby
			remove_format('[[rb:',']]',function(tx){
				return tx.replace(' > ','(')+')';
			});
			novel_dic['content_plain_text']=content;
		}
		if(tmp_tx.indexOf('[content_raw]')>=0){
			novel_dic['content_raw']=raw_novel;
		}
		
		//***template***
		var total_tx='';
		while(true){
			tmp=slice_tx(tmp_tx,'[',']');
			if(tmp==false){
				break;
			}else{
				if(tmp[1] in novel_dic){
					total_tx+=tmp[0] + novel_dic[tmp[1]];
					tmp_tx=tmp[2];
				}else{
					total_tx+=tmp[0]+'['
					tmp_tx=tmp[1]+']'+tmp[2];
				}
			}
		}
		total_tx+=tmp_tx;
		total_tx=total_tx.replace(/\n/g,'\r\n').replace(/\r\r/g,'\r');
		
		//***download***
		tmp = document.createElement('a');
		tmp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(total_tx));
		tmp.setAttribute('download', title+'.txt');
		tmp.style.display = 'none';
		document.body.appendChild(tmp);
		tmp.click();
		document.body.removeChild(tmp);
		
		//***click good button***
		tmp=document.querySelector('.rated');
		if(!tmp){
			tmp=document.querySelector('._nice-button');
			if(tmp){tmp.click();}
		}

	return false;
}
