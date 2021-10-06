function selectLang()
{

var lang = document.getElementById("lang_opt");
theIndx=lang.selectedIndex;
lang_id=lang.options[theIndx].value;
if(lang_id=="0")
	{
		alert("Select Language");
		return;
	}
var lno=parseFloat(lang_id);
$('#sen_opt').load('experiment6-0.php?ind='+lno);
}



function selectSentence()
{

var lno= document.selector.Language.value;
var sentence = document.getElementById("sentence_opt");
theIndx=sentence.selectedIndex;
sentence_id=sentence.options[theIndx].value;
if(sentence_id=="-1")
	{
		alert("Select a sentence");
		return;
	}
var sno=parseFloat(sentence_id);
$('#display').load('experiment6-1.php?ind='+sno+'&lang='+lno);
}
