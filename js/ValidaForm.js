/** Função para criar um objeto XMLHTTPRequest
*/

function CriaRequest() {
	try{
		request = new XMLHttpRequest();        
	}
	catch (IEAtual){
		try{
			request = new ActiveXObject("Msxml2.XMLHTTP");       
		}
		catch(IEAntigo){
			try{
				request = new ActiveXObject("Microsoft.XMLHTTP");          
			}
			catch(falha){
				request = false;
			}
		}
	}
	if (!request){ 
		alert("Seu Navegador não suporta Ajax!");
	}
	else{
		return request;
	}
}

$(document).ready(function(){
    $('#btnListar').click(function(){
        // alert("Teste");
    ContatosConsultar();
    });
	$('#btnEnviar').click(function(){
    	ContatosIncluir();
    });
	$('#link_cep').click(function(){
    	BuscaCep();
    });
});

$(function(){
	//Dialog
	$('#dialog').dialog({
		autoOpen: false,
		width: 600,
		buttons:{
			"OK":function(){
				$(this).dialog("close");
			},
		}
	});
});

function ContatosConsultar(){
    // alert("Teste Método");
    var strnome = $('input[id=txtNome]').val();
	//Definir a url
    var url = "../controllers/ControleContatos.php?page_key=Consultar"+"&txtNome="+strnome+"&HTTP_ACCEPT=application/json";
	//Instanciar o método
	var xmlreq = CriaRequest();
	//Iniciar uma requisição
	xmlreq.open('GET',url,true);
	//Verificar a situação da conexão com o servidor
	xmlreq.onreadystatechange = function(){
		//Verificar se foi concluído com sucesso e se a conexão não foi fechada (readyState=4)
		if(xmlreq.readyState == 4){
			//Verificar se o status da conexão é 200
			if(xmlreq.status == 200){
				// alert(xmlreq.responseText);
				MostrarContatos(JSON.parse(xmlreq.responseText));
			}
		}
	};
	//Envio dos parâmetros
	// xmlreq.send("page_key=Consultar"+"&txtNome="+strnome+"&HTTP_ACCEPT=application/json");
	xmlreq.send(null);
}

function BuscaCep(){
    var strcep = $('input[id=txtCEP]').val();
    var url = "http://viacep.com.br/ws/"+strcep+"/json";
	//Instanciar o método
	var xmlreq = CriaRequest();
	//Iniciar uma requisição
	xmlreq.open('GET',url,true);
	//Verificar a situação da conexão com o servidor
	xmlreq.onreadystatechange = function(){
		if(xmlreq.readyState == 4){
			if(xmlreq.status == 200){
				preencherCampos(JSON.parse(xmlreq.responseText));
			}
		}
	};
	xmlreq.send(null);
}

function MostrarContatos(obj){
	var strTabela = "<table border=1><thead><th>Nome</th><th>Email</th><th>Telefone</th><th>CEP</th><th>UF</th></thead>";
	result = document.getElementById('Resultado');
	if(obj.RetornoDados.length > 1){
		for (var i=0;i < obj.RetornoDados.length;i++){
			strTabela += "<tbody><tr><td> " +
			obj.RetornoDados[i].nomedoContato + '</td><td>' +
			obj.RetornoDados[i].emailContato + '</td><td>' +
			obj.RetornoDados[i].telefoneContato + '</td><td>' +
			obj.RetornoDados[i].cep + '</td><td>' +
			obj.RetornoDados[i].uf + '</td></tr>'
		}
		strTabela += "</tbody></table>";
		result.innerHTML = strTabela;
		$("#Listagem").modal();
	}
	else{
		$('input[name=txtNome]').val(obj.RetornoDados[0].nomedoContato);
		$('input[name=txtMail]').val(obj.RetornoDados[0].emailContato);
		$('input[name=txtPhone]').val(obj.RetornoDados[0].telefoneContato);
		$('input[name=txtCEP]').val(obj.RetornoDados[0].cep);
		$('input[name=txtEndereco]').val(obj.RetornoDados[0].enderecoContato);
		$('input[name=txtBairro]').val(obj.RetornoDados[0].bairro);
		$('input[name=txtCidade]').val(obj.RetornoDados[0].cidade);
		$('input[name=txtUF]').val(obj.RetornoDados[0].uf);
	}
}

function preencherCampos(obj){
	
	if(obj.erro == true){
		$("#Dialog").dialog('open');
		$("#Mensagem").html('Cep Inválido');
		$('input[id=txtCEP').val('');
	}
	else{
		$('input[name=txtEndereco]').val(obj.logradouro);
		$('input[name=txtBairro]').val(obj.bairro);
		$('input[name=txtCidade]').val(obj.localidade);
		$('input[name=txtUF]').val(obj.uf);
	}
}
